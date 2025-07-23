import express from 'express';

import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

async function connectToMongoDB() {
    const uri = "yourConnectionString"; 
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db('yourDatabaseName'); 
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close();
    }
}

connectToMongoDB();

const app = express()

app.get('/',(req,res)=>{
    return res.json({Message:"Yo Your Server is running fine bruh"})
})


app.listen('9000',()=>{
    console.log("app is running on port",9000)
})

