const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwmpo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World! WHOO DB IS WORKING')
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("coiffeur_db").collection("bookings");
    app.post('/addBookings',(req, res) => {
        const booking = req.body;
        console.log(booking)
        bookingCollection.insertOne(booking)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/bookingsByDate',(req, res) => {
      const date = req.body;
      console.log(date.date);
      bookingCollection.find({date: date.date})
      .toArray((err, bookings) => {
        res.send(bookings);
      })

  })
});

app.listen(port || process.env.PORT);