fetch('https://images-api.nasa.gov/search?media_type=image&q=Saturn')
  .then(response => response.json())  // Read the response and turn it into JSON
  .then(data => {
    document.getElementById("data").innerHTML = 
      `<p>First result title: ${data.collection.items[0].data[0].title}</p>`;
  })
  .catch(error => console.log("Oops, something went wrong!", error));
