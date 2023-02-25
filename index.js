const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// mongo uri 
const uri = `mongodb+srv://karata_user:srfKi98AFIqtjiQC@myclaster-1.wxhqp81.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1 
});

async function run(){
  try{
    const serviceCollection = client.db('karataDb').collection('services');

    // get all services from db 
    app.get('/services', async(req,res)=>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    // get limited services for home
    app.get('/limitedServices', async(req,res)=>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.limit(3).toArray();
      res.send(result);
    })
  }
  catch{

  }


}
run().catch(err=>console.log(err));



app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
