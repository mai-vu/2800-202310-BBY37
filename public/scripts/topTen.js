//prevent clicking enter from submitting form
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // This will prevent form submission
});


document.getElementById('ingredientInput').addEventListener('input', async function() {
    let testEntry = this.value; // get the current value of the input

    if (testEntry.length > 2) { // start search after at least 3 characters
        try {
            const response = await fetch(`/fuzzySearch?entry=${encodeURIComponent(testEntry)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("the response is ", response);

            const data = await response.json(); // assuming you're expecting JSON

            // Process your data here
            console.log("inside anon function but below", data);
            const suggestionsDiv = document.getElementById('suggestions');
            suggestionsDiv.innerHTML = ''; // Clear out any previous suggestions
            for (const suggestion of data) {
                const btn = document.createElement('button');
                console.log('Button created:', btn);
                btn.type = 'button';
                btn.className = 'btn btn-primary m-1';
                btn.textContent = suggestion;
                
                // Add a click event listener to the button
                btn.addEventListener('click', function() {
                    // When the button is clicked, set the input's value to the suggestion,
                    // and submit the form
                    document.getElementById('ingredientInput').value = suggestion;
                    document.querySelector('[role="userInput"]').submit();
                });
                
                suggestionsDiv.appendChild(btn);
                console.log('Current content of suggestions:', suggestionsDiv.innerHTML);
            }
        } catch (error) {
            console.log('inside anon function Error:', error);
        }
    }
});
