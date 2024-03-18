const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const recipesFilePath = path.join(__dirname, 'recipes.json');
const recipesData = fs.readFileSync(recipesFilePath, 'utf-8');
const recipes = JSON.parse(recipesData);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const searchQuery = req.query.search || '';

  let filteredRecipes;
  if (searchQuery) {
    filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
  } else {
    filteredRecipes = recipes;
  }

  res.render('index', { recipes: filteredRecipes, searchQuery: searchQuery });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});