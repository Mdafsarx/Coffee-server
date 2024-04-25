const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
// middleWare
app.use(cors());
app.use(express.json());


var uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-kkyhebr-shard-00-00.zgmhkd0.mongodb.net:27017,ac-kkyhebr-shard-00-01.zgmhkd0.mongodb.net:27017,ac-kkyhebr-shard-00-02.zgmhkd0.mongodb.net:27017/?ssl=true&replicaSet=atlas-esi3hx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zgmhkd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        const database = client.db("CoffeesDB").collection('Coffee');
        const userCollection=client.db('CoffeesDB').collection('user')

        app.get('/Coffee', async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // single data information
        app.get('/Coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await database.findOne(query);
            res.send(result)
        })

        app.put('/Coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedCoffee.name,
                    Chef: updatedCoffee.Chef,
                    Supplier: updatedCoffee.Supplier,
                    Taste: updatedCoffee.Taste,
                    Category: updatedCoffee.Category,
                    Details: updatedCoffee.Details,
                    Photo: updatedCoffee.Photo,
                },
            };
            const result = await database.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.post('/Coffee', async (req, res) => {
            const newCoffee = req.body;
            const result = await database.insertOne(newCoffee);
            res.send(result)
        })


        app.delete('/Coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await database.deleteOne(query);
            res.send(result)
        })


        // user data base
        app.post('/user',async(req,res)=>{
          const user=req.body;
          const result = await userCollection.insertOne(user);
          res.send(result)
        })

        app.get('/user',async(req,res)=>{
           const cursor=userCollection.find();
           const result=await cursor.toArray();
           res.send(result);
        })

        app.patch('/user',async(req,res)=>{
            const user=req.body ;
            const filter={email:user.email}
            const Doc={
                $set:{
                    lastSignInTime:user.lastSignInTime
                }
            }
            const result=await userCollection.updateOne(filter,Doc)
            res.send(result)
        })

        app.delete(`/user/:id`,async(req,res)=>{
          const id=req.params.id;
          const filter={_id:new ObjectId(id)}
          const result=await userCollection.deleteOne(filter);
          res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('the coffee server is running')
});

app.listen(port, () => {
    console.log(`the server is running on ${port}`)
})
