function removeIngredient(index, ingredient) {
  // Send an AJAX request to remove the ingredient
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

function updateWasteList(ingredients) {
  // Update the UI with the updated ingredient list
  // For example, you can replace the content of a div with id "ingredientList" with the updated list
  const ingredientListDiv = document.getElementById("ingredientList");
  ingredientListDiv.innerHTML = ""; // Clear previous content

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

    ingredientItem.appendChild(ingredientName);
    ingredientItem.appendChild(removeButton);
    ingredientListDiv.appendChild(ingredientItem);
  });
}

function addWaste(waste) {
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
      window.location.reload(); 
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function addWasteFromInput() {
  const input = document.querySelector('input[name="waste"]');
  const waste = input.value.trim();

  if (waste !== "") {
    addWaste(waste);
    input.value = ""; // Clear the input field after adding waste
  }
}



const ingredientsInput = document.getElementById('ingredientsInput');
const findRecipesButton = document.querySelector('form[action="/recipes"] button');
const reduceWasteButton = document.querySelector('form[action="/reduceMyWaste"] button');

function toggleButton() {
  const ingredients = JSON.parse(ingredientsInput.value);
  if (ingredients && ingredients.length >= 1) {
    if (findRecipesButton) {
      findRecipesButton.disabled = false;
    }
    if (reduceWasteButton) {
      reduceWasteButton.disabled = false;
    }
  } else {
    if (findRecipesButton) {
      findRecipesButton.disabled = true;
    }
    if (reduceWasteButton) {
      reduceWasteButton.disabled = true;
    }
  }
}
toggleButton();


//Custom Easter Egg Card Appearance
function showCustomCard(event) {
  event.preventDefault();
  const customCard = document.getElementById('customCard');
  customCard.classList.toggle('hidden');
}