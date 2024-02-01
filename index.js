const express = require('express')
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
//middle ware  
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e60xkn0.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const productCollection = client.db('inventoryManagement').collection('Product')
    const userCollection = client.db('inventoryManagement').collection('users')

    // get all user data by id
    app.post('/users', async(req, res) =>{
      const user = req.body;
      const query = {email: user.email, phone: user.phone}
      const exstingUser = await userCollection.findOne(query)
      if (exstingUser) {
       return res.send({message: 'User already exists'})
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
  })
  // get all user data
  app.get('/users', async(req, res) =>{
    const user = userCollection.find();
    const result = await user.toArray()
    res.send(result)
  })

    // get all products data
    app.get('/allproducts', async(req, res) =>{
        const team =await productCollection.find().toArray();
        res.send(team)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Inventory server is running')
})
app.listen(port, () =>{
    console.log(`server is running on PORT: ${port}`)
})