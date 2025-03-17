document.getElementById("fetchData").addEventListener("click", function() {
    fetch("https://images-api.nasa.gov/search?media_type=image&q=Saturn")
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            let items = data.collection.items; // Get the array of results
            if (items.length > 0) {
                let firstItem = items[0]; // Get the first item
                let title = firstItem.data[0].title; // Get the title of the first result

                // Check if there is a link to the image in the API response
                let imageUrl = firstItem.links ? firstItem.links[0].href : ""; // Get the image URL from the links array

                // If an image URL is available, display it
                if (imageUrl) {
                    document.getElementById("output").innerHTML = `
                        <h2>${title}</h2>
                        <img src="${imageUrl}" alt="NASA Image" />
                    `;
                } else {
                    document.getElementById("output").innerHTML = `
                        <h2>${title}</h2>
                        <p>No image available.</p>
                    `;
                }
            } else {
                document.getElementById("output").innerHTML = "No results found.";
            }
        })
        .catch(error => {
            console.log("Oops! Something went wrong:", error);
            document.getElementById("output").innerHTML = "Error fetching data.";
        });
});
