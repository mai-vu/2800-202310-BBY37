function toggleDietaryRestrictions(checkbox) {
  // Update the value of the checkbox input
  checkbox.value = checkbox.checked;

  // Update the value of the hidden input
  const hiddenInput = document.getElementById('ignoreDietaryRestrictionsInput');
  hiddenInput.value = checkbox.checked;
  
  document.getElementById('recipesForm').submit();
}

function sortRecipes() {
  // Get the sorting option (ascending or descending) from the select element
  const selectElement = document.getElementById('sortOption');
  const sortOption = selectElement.value;

  const hiddenInput = document.getElementById('sortInput');
  hiddenInput.value = sortOption;

  console.log(sortOption + " in sortRecipe " + hiddenInput.value);
  
  document.getElementById('recipesForm').submit();
}

//save recipe to user's savedRecipes array, or unsave it if it's already saved
function saveRecipe(id, icon) {
  fetch("/recipes/saveRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.saved) {
        icon.classList.remove("bi-heart");
        icon.classList.add("bi-heart-fill");
      } else {
        // Check if the recipe card is in the '/myRecipes' page
        const isMyRecipesPage = window.location.pathname === '/recipes/myRecipes';
        if (isMyRecipesPage) {
          // Remove the recipe card from the DOM
          const recipeCard = document.getElementById(`recipe-${id}`);
          if (recipeCard) {
            recipeCard.remove();
          }
        }
        icon.classList.remove("bi-heart-fill");
        icon.classList.add("bi-heart");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}