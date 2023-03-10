const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// mongo uri 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@myclaster-1.wxhqp81.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1 
});

async function run(){
  try{

    // collections
    const serviceCollection = client.db('karata').collection('allServices');
    const reviewCollection = client.db('karata').collection('reviews')

     //------------------------------------------//
     // service collection api 

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

    // get a single service data 
    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    // add a new service 
    app.post('/services/post', async(req,res)=>{
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    })

      // service collection api 
     //------------------------------------------//



    //------------------------------------------//
    // review collection api 
    // get a name specific review from db and send to client 
    app.get('/reviews', async(req,res)=>{
      let query = {};
      if(req.query.name){
        query = {
          ServiceName: req.query.name
        }
      }
      const cursor = reviewCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // age a review from client and save to db 
    app.post('/reviews', async(req,res)=>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })

    // get a users all review 
    app.get('/reviewsquery', async(req,res)=>{
      let query = {};
      if(req.query.email){
        query = {
          email : req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })

    // delete a specific review 
    app.delete('/review/:id', async(req,res)=>{
      const id = req.params.id; 
      const query = {_id: new ObjectId(id)}
      const result = await reviewCollection.deleteOne(query);
      res.send(result)
    })

    // update a review 
    app.put('/update/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const user = req.body;
      const option = { upsert: true}
      const updateUserReview = {
        $set: {
          review: user.newReview
        }
      }
      const result = await reviewCollection.updateOne(filter,updateUserReview,option)
      console.log(result);
      res.send(result);
    })

     // review collection api 
    //------------------------------------------//

  }
  catch{

  }


}
run().catch(err=>console.log(err));



app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
