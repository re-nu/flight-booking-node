import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

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

const flights=[
    {
        name:"GoAir",
        from:"Delhi",
        to:"Lucknow",
        date:"1 feb 2022",
        departure:"16:55",
        arrive:"18:05",
        Duration:"1h 10m",
        price:"2,050"
    },
    {
        name:"GoAir",
        from:"Lucknow",
        to:"Delhi",
        date:"1 feb 2022",
        departure:"17:55",
        arrive:"19:05",
        Duration:"1h 10m",
        price:"2,050"
    },
    {
        name:"GoAir",
        from:"Mumbai",
        to:"Pune",
        date:"1 feb 2022",
        departure:"16:55",
        arrive:"17:10",
        Duration:"0h 15m",
        price:"1,050"
    },
    {
        name:"GoAir",
        from:"Pune",
        to:"Mumbai",
        date:"1 feb 2022",
        departure:"16:55",
        arrive:"17:10",
        Duration:"0h 15m",
        price:"1,050"
    },
    {
        name:"GoAir",
        from:"Mumbai",
        to:"Bangaluru",
        date:"1 feb 2022",
        departure:"10:55",
        arrive:"12:5",
        Duration:"1h 10m",
        price:"2,099"
    },
    {
        name:"GoAir",
        from:"Bangulu",
        to:"Mumbai",
        date:"1 feb 2022",
        departure:"10:55",
        arrive:"12:5",
        Duration:"1h 10m",
        price:"2,050"
    },
    {
        name:"GoAir",
        from:"Nagpur",
        to:"Mumbai",
        date:"1 feb 2022",
        departure:"10:55",
        arrive:"11:30",
        Duration:"0h 35m",
        price:"1,050"
    },
    {
        name:"GoAir",
        from:"Mumbai",
        to:"Nugpur",
        date:"1 feb 2022",
        departure:"15:05",
        arrive:"15:40",
        Duration:"0h 35m",
        price:"1,050"
    },
]

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

app.listen(PORT,console.log("app started in ",PORT))