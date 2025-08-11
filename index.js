const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mrsp38p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Here the collection
    const eventsCollection = client.db('athleticsHub').collection('events');
    const bookingsCollection = client.db('athleticsHub').collection('bookings')


    // here it is used for getting all event that were i create


    app.get('/events', async (req, res) => {
      const events = await eventsCollection.find().toArray();
      res.send(events);
    });

    // here it is used for details page 
    app.get('/events/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await eventsCollection.findOne(query);
      res.send(result);
    });



    app.get('/bookings', async (req, res) => {
      const userEmail = req.query.email;
      const query = { user_email: userEmail };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });


    
    app.get('/my-events', async (req, res) => {
      const userEmail = req.query.email;
      const query = {email: userEmail};
      const events = await eventsCollection.find(query).toArray();
      res.send(events);
    });


    app.post('/events', async (req, res) => {
      const newEvent = req.body;
      console.log(newEvent);
      const result = await eventsCollection.insertOne(newEvent);
      res.send(result);
    });

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });



    // here it is used for delete operation
    app.delete('/events/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await eventsCollection.deleteOne(query);
      res.send(result)
    });

    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }; 
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });




    app.put('/events/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedEvent = req.body;
      const updatedDoc = {
        $set: updatedEvent

      }
      const result = await eventsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

    });


    
  } finally {
  
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('AthleticHub server is ready')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})