const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guqdp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const taskList = client.db("MyData").collection("volunteersInfo");
    const addedEventsData = client.db("MyData").collection("volunteersdata");
    console.log('db connection success')
    app.post("/volunteerdata", (req, res) => {
      const product = req.body;
      taskList.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })
    
    app.get('/volunteersdata', (req, res) => {
        taskList.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // query 
    app.get('/taskList', (req, res) => {
        taskList.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // delete volunteers data
    app.delete('/volunteersdata/:id', (req, res) => {
        taskList.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) =>{
            console.log(result)
             res.send(result.deletedCount > 0)})
    })

    app.post("/addevent", (req, res) => {
      const products = req.body;
      addedEventsData.insertOne(products)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })
    app.get('/geteventdata', (req, res) => {
        addedEventsData.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
   
});

app.listen(process.env.PORT || port)
