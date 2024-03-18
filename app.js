require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3300;
const { MongoClient, ServerApiVersion } = require('mongodb');


const client = new MongoClient(process.env.URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run(){
    try {
        await client.connect();
        const dbConn = await client.db("SPRINT").collection("Recipes");
        const result = dbConn;
        console.log(result);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
};

app.listen(port, ()=> {
    run();
});