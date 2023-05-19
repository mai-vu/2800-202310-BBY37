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
        // Refresh the page
        location.reload();
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