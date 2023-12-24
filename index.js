const express = require('express')
const app = express()
const cors = require('cors');
//const jwt = require('jsonwebtoken');
require('dotenv').config();
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjcsd3j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const userCollection = client.db("task").collection("user");
    const menuCollection = client.db("task").collection("menu");


    app.get('/', (req, res) => {
        res.send('task management')
      })

//menu
app.get('/menu' , async(req,res) =>{
  const result = await menuCollection.find().toArray();
  res.send(result);
})

// app.get('/menu/:email' , async(req,res) =>{
//   const email = req.query.email;
//   const query = {email: email};
//   const result = await menuCollection.find(query).toArray();
//   res.send(result);
// })

app.post('/menu' , async(req,res) =>{
const menu= req.body;
console.log('new menu : ' , menu);
const result = await menuCollection.insertOne(menu);
res.send(result);
})


app.put('/menu/:id', async (req, res) => {
  const item = req.body;
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = {upsert:true} 
  const updatedDoc = {
    $set: {
      name: item.name,
      description: item.description,
      ratings: item.ratings
    }
  }
  const result = await menuCollection.updateOne(filter, updatedDoc ,options);
  res.send(result);
})

app.delete('/menu/:id' , async(req,res) => {
const id = req.params.id;
const query = {_id: new ObjectId(id)}
const result = await menuCollection.deleteOne(query);
res.send(result);
})


  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//iUZhTGi6yVMEg3Oz