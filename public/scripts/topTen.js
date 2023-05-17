//test mispelled word
let testEntry = "bananaa";

document.getElementById('topTenButton').addEventListener('click', async function() {
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
        console.log("inside anon function", data);
    } catch (error) {
        console.log('inside anon function Error:', error);
    }
});
