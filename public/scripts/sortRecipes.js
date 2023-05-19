function sortRecipes(order, callback) {
  recipes.sort((a, b) => {
    const ingredientsA = parseInt(a.n_ingredients);
    const ingredientsB = parseInt(b.n_ingredients);

    if (order === 'asc') {
      return ingredientsA - ingredientsB;
    } else {
      return ingredientsB - ingredientsA;
    }
  });

  // Call the callback function with the sorted recipes
  callback(render("recipes"));
}
