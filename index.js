import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import { ObjectID } from 'bson';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  app.post("/flights/signup",async(request,response)=>{
    const {email,password}=request.body;
    console.log("bode info",email,password)

    // check if user is already present, if user is not found it will return null 
    const userPresent= await getUserByEmail(email)
    
    // if already present , then userPresent is not null i.e if will be true
    if(userPresent){
        response.send({message:"user already exists"})
        // break,exit from futher code
        return;
    }
    //get hassed password 
    const hashedPassword=await genPassword(password) 
     const result=await client.db("b28wd").collection("flights-users").insertOne({email:email,password:hashedPassword})
     response.send(result)
})

app.post("/flights/login",async(request,response)=>{
    const {email,password}=request.body

    // check is email is present 
    const userPresent= await getUserByEmail(email)

    if(!userPresent){
       response.send({message:"invalid user"})
       return
    }
    //  get the stored/saved password
    const storedPassword=userPresent.password
    // comape saved password and entered password, caomapre will return true if matches else return false
    const isPasswordMatch=await bcrypt.compare(password,storedPassword)

    if(isPasswordMatch){
        // asign a token ,1st parameter unick value , 2nd secrect key
        const token=jwt.sign({id:userPresent._id},process.env.SECRET_KEY)
        response.send({message:"successfuly login",token:token})
    }

    else{
        response.send({message:"invalis password"})
    }
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

async function getUserByEmail(email) {
    return await client.db("b28wd").collection("flights-users").findOne({ email: email });
}

async function genPassword(password) {
    const No_of_Rounds=10                  //no of random rounds
    // add random no.of rounds to add after password
    const salt=await bcrypt.genSalt(No_of_Rounds) 
    // convert password into hashed
    const hashedPassword=await bcrypt.hash(password,salt)
    console.log("hassedpassword is :",hashedPassword)
    return hashedPassword
}

app.listen(PORT,console.log("app started in ",PORT))