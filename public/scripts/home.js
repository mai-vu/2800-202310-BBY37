function removeIngredient(index) {
  // Send an AJAX request to remove the ingredient
  fetch('/home/removeIngredient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ index: index })
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
    } else {
      console.error('Failed to remove ingredient');
    }
  })
  .catch(error => {
    console.error('Failed to remove ingredient:', error);
  });
}

  //Custom Easter Egg Card Appearance
  function showCustomCard(event) {
    event.preventDefault();
    const customCard = document.getElementById('customCard');
    customCard.classList.toggle('hidden');
  }