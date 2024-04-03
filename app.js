const express = require('express');
const app = express();
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.set('view engine', 'ejs');

// render the index page
app.get('/', async (req, res) => {
  const searchQuery = req.query.search || '';

  try {
    await client.connect();
    const dbConn = client.db("SPRINT").collection("Recipes");
    let filteredRecipes;

    if (searchQuery) {
      const regexQuery = { $regex: searchQuery, $options: 'i' };
      filteredRecipes = await dbConn.find({ recipeName: regexQuery }).toArray();
    } else {
      filteredRecipes = await dbConn.find().toArray();
    }

    res.render('index', { recipes: filteredRecipes, searchQuery: searchQuery });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// read a single recipe
app.get('/read', async (req, res) => {
  //const recipeID = req.query.recipe;
  const recipeID = parseInt(req.query.recipe);

  try {
    await client.connect();
    const dbConn = client.db("SPRINT").collection("Recipes");

    // Retrieve the recipe with the specified recipeID    
    const recipe = await dbConn.findOne({ recipeID });

    if (!recipe) {
      // Handle the case when the recipe is not found
      return res.status(404).send('Recipe not found');
    }

    res.render('read', { recipe });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});