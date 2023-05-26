// Send an AJAX request to remove the ingredient
function removeIngredient(index, ingredient) {
  // Send a POST request to remove the ingredient from the session
  fetch('/home/removeIngredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index,
        ingredient: ingredient
      })
    })
    .then(response => {
      if (response.ok) {
        // Remove the ingredient from the UI
        const ingredientItem = document.getElementById(`ingredientItem-${index}`);
        ingredientItem.remove();

        // Update the value of the hidden input with the updated ingredients array
        const ingredientsInput = document.getElementById('ingredientsInput');
        const updatedIngredients = Array.from(document.querySelectorAll('.ingredient-item span'))
          .map(ingredient => ingredient.textContent.trim());
        ingredientsInput.value = JSON.stringify(updatedIngredients);

        // Toggle the Find Recipes button
        toggleButton();
      } else {
        console.error('Failed to remove ingredient');
      }
    })
    .catch(error => {
      console.error('Failed to remove ingredient:', error);
    });
}

// Update the UI with the updated waste list
function updateWasteList(ingredients) {
  // get the div that contains the waste ingredients list
  const ingredientListDiv = document.getElementById("ingredientList");
  ingredientListDiv.innerHTML = ""; // Clear previous content

  // Add each waste ingredient to the list
  ingredients.forEach((ingredient, index) => {
    const ingredientItem = document.createElement("div");
    ingredientItem.id = `ingredientItem-${index}`;
    ingredientItem.className = "ingredient-item d-flex align-items-center justify-content-between comfortaaBold";

    const ingredientName = document.createElement("span");
    ingredientName.className = "me-2";
    ingredientName.textContent = ingredient;

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-sm btn-outline-danger comfortaaBold";
    removeButton.style.borderRadius = "100px";
    removeButton.textContent = "x";
    removeButton.addEventListener("click", () => {
      removeIngredient(index, ingredient);
    });

    // Add the ingredient name and the remove button to the ingredient item
    ingredientItem.appendChild(ingredientName);
    ingredientItem.appendChild(removeButton);
    ingredientListDiv.appendChild(ingredientItem);
  });
}

// Add waste from pre-defined list when user clicks on a waste item
function addWaste(waste) {
  // Send an AJAX request to add the waste
  fetch("/home/addIngredient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ingredient: waste
    })
  })
    .then(response => {
      console.log("Response status:", response.status);

      // Update the UI with the updated ingredient list
      window.location.reload(); 
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

// Add waste from the input field
function addWasteFromInput() {
  // Get the value of the input field
  const input = document.querySelector('input[name="waste"]');
  const waste = input.value.trim();

  // Add the waste if it is not empty
  if (waste !== "") {
    addWaste(waste);
    input.value = ""; // Clear the input field after adding waste
  }
}

// Add event listeners to the input field and the button
const ingredientsInput = document.getElementById('ingredientsInput');
const findRecipesButton = document.querySelector('form[action="/recipes"] button');
const reduceWasteButton = document.querySelector('form[action="/reduceMyWaste"] button');

// Toggle the Find Recipes button
function toggleButton() {
  // Enable the Find Recipes button if there is at least one ingredient
  const ingredients = JSON.parse(ingredientsInput.value);
  if (ingredients && ingredients.length >= 1) {
    if (findRecipesButton) {
      findRecipesButton.disabled = false;
    }

    // Enable the Reduce Waste button if there is at least one ingredient
    if (reduceWasteButton) {
      reduceWasteButton.disabled = false;
    }
  } else {

    // Disable the Find Recipes button if there are no ingredients
    if (findRecipesButton) {
      findRecipesButton.disabled = true;
    }

    // Disable the Reduce Waste button if there are no ingredients
    if (reduceWasteButton) {
      reduceWasteButton.disabled = true;
    }
  }
}
toggleButton();

// Disable the Reduce Waste button after clicking
document.addEventListener('DOMContentLoaded', function() {
  const reduceWasteButton = document.querySelector('form[action="/reduceMyWaste"] button');
  
  // Disable the button after clicking
  if (reduceWasteButton) {
    document.querySelector('form[action="/reduceMyWaste"]').addEventListener('submit', function() {
      if (!reduceWasteButton.disabled) {
        reduceWasteButton.disabled = true;
      }
    });
  }
});

//Call the updateFindRecipes function when the toggle is clicked
function updateFindRecipes(value) {
  // Send an AJAX request to update the findRecipes value
  fetch('/home/updateFindRecipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ findRecipes: value })
  })
  .then(response => {
    if (response.ok) {
      // Update was successful

      //redeirect to the home page
      window.location.href = '/home';
    } else {

      // Handle error case
      console.error('Error updating findRecipes value');
    }
  })
  .catch(error => {
    console.error(error);
  });
}


//Custom Easter Egg Card Appearance
function showCustomCard(event) {
  event.preventDefault();
  const customCard = document.getElementById('customCard');
  customCard.classList.toggle('hidden');
}