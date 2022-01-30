import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import { ObjectID } from 'bson';

dotenv.config()

const app=express();
app.use(cors())
app.use(express.json())
const PORT=process.env.PORT

const MONGO_URL=process.env.MONGO_URL;

async function createConnection(){
    const client=new MongoClient(MONGO_URL)
    await client.connect();
    console.log("Mongodb connected")
    return client
}

const client= await createConnection();


app.get("/",(request,response)=>{
    response.send("welcome to flight booking app")
})

app.post("/flights",async(request,response)=>{
    const flights=request.body
    const result=await client.db("b28wd").collection("flights").insertMany(flights)
    response.send(result)
})

app.get("/flights",async(request,response)=>{
    const flights=await client.db("b28wd").collection("flights").find({}).toArray()
    console.log(flights)
    response.send(flights)
})

app.get("/flight/:id",async(request,response)=>{
  const {id}=request.params
  const flight=await client.db("b28wd").collection("flights").findOne({_id:ObjectID(id)})
  response.send(flight)
})

app.post("/flight",async(request,response)=>{
    const flight=request.body
    console.log(flight)
    const result=await client.db("b28wd").collection("flights").insertOne(flight)
    response.send(result)
})

app.put("/flight/:id",async(request,response)=>{
    const {id}=request.params
    const flight=request.body
    const result=await client.db("b28wd").collection("flights").updateOne({_id:ObjectID(id)},{$set:flight})
    response.send(result)
})

app.delete("/flight/:id",async(request,response)=>{
    const {id}=request.params
    const flight=await client.db("b28wd").collection("flights").deleteOne({_id:ObjectID(id)})
    response.send(flight)
  })

app.post("/books",async(request,response)=>{
  const books=request.body
  const result=await client.db("b28wd").collection("books").insertMany(books)
  response.send(result)
})

app.get("/books",async(request,response)=>{
    const books=await client.db("b28wd").collection("books").find({}).toArray()
    response.send(books)
})

app.listen(PORT,console.log("app started in ",PORT))