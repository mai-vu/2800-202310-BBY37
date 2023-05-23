//prevent clicking enter from submitting form
document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault(); // This will prevent form submission
});
  
function removeIngredient(index) {
  // Send an AJAX request to remove the ingredient
  fetch('/home/removeIngredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index
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
        toggleFindRecipesButton();
      } else {
        console.error('Failed to remove ingredient');
      }
    })
    .catch(error => {
      console.error('Failed to remove ingredient:', error);
    });
}

const ingredientsInput = document.getElementById('ingredientsInput');
const findRecipesButton = document.querySelector('form[action="/recipes"] button');

function toggleFindRecipesButton() {
  const ingredients = JSON.parse(ingredientsInput.value);
  if (ingredients && ingredients.length >= 1) {
    findRecipesButton.disabled = false;
  } else {
    findRecipesButton.disabled = true;
  }
}
toggleFindRecipesButton();

//Custom Easter Egg Card Appearance
function showCustomCard(event) {
  event.preventDefault();
  const customCard = document.getElementById('customCard');
  customCard.classList.toggle('hidden');
}

function goToWebcam() {
  window.location.href = "/webcam";
}