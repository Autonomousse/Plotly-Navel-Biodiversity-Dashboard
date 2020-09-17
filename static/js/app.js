// Path to where the JSON object is located
const url = "samples.json";

// Fetch the JSON data and start using it to populate the HTML page
d3.json(url).then(function(data) {

    // Collect an array of the subject ID's and store them in a variable
    var id = Object.values(data.names);

    // Create dropdown options for each subject ID
    id.forEach(item => d3.select("#selDataset").append("option").text(`${item}`))
    
});