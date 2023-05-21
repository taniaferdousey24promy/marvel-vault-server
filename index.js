const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express ();
const port = process.env.PORT || 5000;


//midleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_PASS);








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hk7n6de.mongodb.net/?retryWrites=true&w=majority`;

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


    const toyCollection = client.db('marvelVault').collection('toys');
    
    app.get('/toys', async(req,res)=>{
        const searchQuery = req.query.search;
        let query = {};
        let options ={};


        if(searchQuery){
            query ={
                'subCategories.name':{
                    $regex: searchQuery,
                    $options: 'i'
                }


            };
            options={
                projection :{
                    Category:1,
                    subCategories:1
                }
            };
        }

        const result = await toyCollection.find(query,options).toArray();

        res.send(result);
    })
    app.get('/toys/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options ={
            projection:{Category:1, subCategories:1},
        };
        const result = await toyCollection.findOne(query,options);
        res.send(result);
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










app.get('/',(req,res)=>{
    res.send('vault is running')

})

app.listen(port, ()=>{
    console.log(`Marvel Vault is running on port ${port}`);
})