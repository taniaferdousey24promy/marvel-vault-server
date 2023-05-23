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

  

    const toyCollection = client.db('marvelVault').collection('toys');
    const newToysCollection = client.db('marvelVault').collection('newToys');

    app.get('/newToys',async(req,res)=>{
      console.log(req.query.sellerEmail);
      let query ={};
      if(req.query?.sellerEmail){
        query ={sellerEmail: req.query.sellerEmail}
      }
        const result = await newToysCollection.find(query).toArray();
        res.send(result);
      })

    app.post('/newToys', async(req,res) =>{
        const newToy = req.body;
        console.log(newToy);
        const result= await newToysCollection.insertOne(newToy);
        res.send(result);
    })
    
    app.get('/toys', async(req,res)=>{
        const limit = 20;

        try{
          const result = await toyCollection.find().limit(limit).toArray();
          res.send(result);

        }catch(error){
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
 


    });
    app.get('/toys/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options ={
            projection:{subCategoryName:1,picture:1,toyName:1, price:1,rating:1,description:1, sellerName:1, sellerEmail:1,availableQuantity:1},
        };
        const result = await toyCollection.findOne(query,options);
        // const result = await toyCollection.findOne(query);
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