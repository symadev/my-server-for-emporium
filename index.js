const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn4mz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    await client.connect();

    // Set up database and collection references
    const database = client.db("CoffeeDB");
    const coffeeCollection = database.collection("Coffee");

    // POST operation for adding coffee
    app.post('/coffee', async (req, res) => {
      console.log('POST /coffee request received');
      const newCoffee= req.body;
      console.log(newCoffee);
      try {
        const result = await coffeeCollection.insertOne(newCoffee);
        res.status(200).json({ message: "Coffee added successfully", data: result });
      } catch (error) {
        console.error("Error adding coffee:", error);
        res.status(500).json({ message: "Error adding coffee", error: error.message });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

run().catch(console.dir);

// Home route
app.get('/', (req, res) => {
  res.send('Coffee Emporium Started!');
});

// Start the server
app.listen(port, () => {
  console.log(`My Emporium server is running on port ${port}`);
});
