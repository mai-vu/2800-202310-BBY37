function sortRecipes(sortOrder) {
  const recipesContainer = document.querySelector('.row');
  const recipeCards = Array.from(recipesContainer.querySelectorAll('.col-md-6'));

  recipeCards.sort((cardA, cardB) => {
    const timeA = getTimeValue(cardA);
    const timeB = getTimeValue(cardB);

    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  recipesContainer.innerHTML = '';

  for (const card of recipeCards) {
    recipesContainer.appendChild(card);
  }
}

function getTimeValue(card) {
  const timeText = card.querySelector('.card-body .card-text strong:contains("Time:")').nextSibling.textContent;
  const minutes = parseInt(recipes[i].minutes);

  return minutes;
}