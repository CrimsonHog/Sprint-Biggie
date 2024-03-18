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

const dbConn = client.connect().db("SPRINT").collection("Recipes");