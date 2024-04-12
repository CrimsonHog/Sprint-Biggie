const express = require('express');
const app = express();
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
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
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// render the index page
app.get('/', async (req, res) => {
  const searchQuery = req.query.search || '';

  try {
    await client.connect();
    const dbConn = client.db("SPRINT").collection("Recipes");
    let filteredRecipes;

    if (searchQuery) {
      const regexQuery = { $regex: searchQuery, $options: 'i' };
      filteredRecipes = await dbConn.find({
        $or: [
          { recipeName: regexQuery },
          { author: regexQuery },
          { ingredients: regexQuery },
          { steps: regexQuery }
        ]
      }).sort({ recipeName: 1 }).toArray();
    } else {
      filteredRecipes = await dbConn.find().sort({ recipeName: 1 }).toArray();
    }

    res.render('index', { recipes: filteredRecipes, searchQuery: searchQuery });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// create recipe
app.post('/create', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("SPRINT").collection("Recipes");
    const recipeName = req.body.recipeName;
    const author = req.body.authorName;
    const time = req.body.time;
    const ingredients = req.body.ingredients;
    const steps = req.body.steps;

    // Filter out empty steps and ingredients
    const filteredIngredients = ingredients.filter((ingredient) => ingredient !== '');
    const filteredSteps = steps.filter((step) => step !== '');

    const newRecipe = {
      recipeName,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      time,
      author,
    };

    const result = await collection.insertOne(newRecipe);
    console.log("Inserted recipe:", result.recipeID);

    res.redirect("/");
  } catch (error) {
    console.log("Error Adding Recipe:", error);
  } finally {
    client.close();
  }

});

// read a single recipe
app.get('/read', async (req, res) => {
  const recipeID = new ObjectId(req.query.recipe);

  try {
    await client.connect();
    const dbConn = client.db("SPRINT").collection("Recipes");

    // Retrieve the recipe with the specified recipeID    
    const recipe = await dbConn.findOne({ _id: recipeID });

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

// update recipe
app.post('/update', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("SPRINT").collection("Recipes");
    const recipeId = req.body.recipe; // Get the recipe ID from the hidden input field in the form

    const recipeName = req.body.recipeName;
    const author = req.body.authorName;
    const time = req.body.time;
    const ingredients = req.body.ingredients;
    const steps = req.body.steps;

    // Filter out empty steps and ingredients
    const filteredIngredients = ingredients.filter((ingredient) => ingredient !== '');
    const filteredSteps = steps.filter((step) => step !== '');

    const updatedRecipe = {
      recipeName,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      time,
      author,
    };

    await collection.updateOne({ _id: new ObjectId(recipeId) }, { $set: updatedRecipe });
    console.log("Updated recipe:", recipeId);

    res.redirect(`/read?recipe=${recipeId}`);
  } catch (error) {
    console.log("Error updating recipe:", error);
  } finally {
    client.close();
  }
});

// delete recipe
app.get('/delete', async (req, res) => {
  const recipeID = new ObjectId(req.query.recipe);

  try {
    await client.connect();
    const dbConn = client.db("SPRINT").collection("Recipes");

    // Delete recipe with the specified recipeID
    const result = await dbConn.deleteOne({ _id: recipeID });

    if (result.deletedCount === 0) {
      // If for some reason recipe is not found
      return res.status(404).send('Recipe not found');
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});