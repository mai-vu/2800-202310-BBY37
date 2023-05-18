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
      console.log(data);
      if (data.saved) {
        icon.classList.remove("bi-star");
        icon.classList.add("bi-star-fill");
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
        icon.classList.remove("bi-star-fill");
        icon.classList.add("bi-star");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }