// Path to where the JSON object is located
const url = "samples.json";

// Fetch the JSON data and start using it to populate the HTML page
d3.json(url).then(function (data) {

    // Collect an array of the subject ID's and store them in a variable
    var id = Object.values(data.names);

    // Create dropdown menu options for each subject ID
    id.forEach(item => d3.select("#selDataset").append("option").text(`${item}`))

    function init() {
        var initialSelection = 940;
        updateDemographics(initialSelection);
    };

    // When there is a change to the DOM, call the optionChanged function
    d3.selectAll("#selDataset").on("change", optionChanged);

    /********************************************************************************************
     * This function is called when there is a change made to the DOM, via user selection/input *
     ********************************************************************************************/
    function optionChanged() {

        // Select the dropdown menu option
        var menuOption = d3.select("#selDataset");

        // Assign the value of the dropdown menu option to a variable
        var selection = menuOption.property("value");

        updateDemographics(selection);

    };

    /************************************************************************************
     * This function is called to update the Demographics Info section of the dashboard *
     ************************************************************************************/
    function updateDemographics(searchIndex) {

        // Create a variable to store the location we will append the return values
        var output = d3.selectAll(".card-body");

        // Clear any text in the Demographic Info section
        output.text("");

        // Search through the metadata to find the index for the matching ID that the user selected
        data.metadata.forEach(function (dataObjects) {

            // When the matching ID is found, create an array of key value pairs, then print out the info
            if (dataObjects.id == searchIndex) {

                // Store the key value pairs (as an array) inside a variable, type will be an array of arrays
                // example: info = [[key, value], [key, value], ...]
                var info = Object.entries(dataObjects);

                // Loop through the array and append each key value pair to populate the Demographic Info section
                info.forEach(item => output.append("p").text(`${item[0]}: ${item[1]}`));
            };
        });
    };

    init();
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
