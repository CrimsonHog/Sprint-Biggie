// for editing ingredients and steps in the create recipe form
document.addEventListener("DOMContentLoaded", function() {
    const addIngredientBtn = document.getElementById("addIngredientBtn");
    const addStepBtn = document.getElementById("addStepBtn");
    const ingredientsContainer = document.getElementById("ingredientsContainer");
    const stepsContainer = document.getElementById("stepsContainer");
  
    addIngredientBtn.addEventListener("click", function() {
      const ingredientInput = document.createElement("input");
      ingredientInput.type = "text";
      ingredientInput.className = "form-control mb-2";
      ingredientInput.name = "ingredients[]";
      ingredientInput.required = false;
      ingredientsContainer.appendChild(ingredientInput);
    });
  
    addStepBtn.addEventListener("click", function() {
      const stepTextArea = document.createElement("textarea");
      stepTextArea.className = "form-control form-control-sm mb-2";
      stepTextArea.name = "steps[]";
      stepTextArea.rows = 3;
      stepTextArea.required = false;
      stepsContainer.appendChild(stepTextArea);
    });

    // for deleting recipes
    document.getElementById('deleteBtn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the anchor tag
      
        const recipeId = this.getAttribute('data-recipe-id');
        const confirmDelete = confirm('Are you sure you want to delete this recipe? This action cannot be undone.');
        
        if (confirmDelete) {
          window.location.href = '/delete?recipe=' + recipeId;
        }
      });

  });