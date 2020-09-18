// Path to where the JSON object is located
const url = "samples.json";

// Fetch the JSON data and start using it to populate the HTML page
d3.json(url).then(function (data) {

    // Collect an array of the subject ID's and store them in a variable
    var id = Object.values(data.names);

    // Create dropdown menu options for each subject ID
    id.forEach(item => d3.select("#selDataset").append("option").text(`${item}`))

    /**************************************************************************
     * This function creates and fills the starting values and visualizations *
     **************************************************************************/
    function init() {
        
        // Set the inital subject ID
        var initialSelection = 940;

        // Call the updateDemographics function to fill in starting values
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

        // Call the appropriate functions to update the dashboard accordingly
        updateDemographics(selection);

    };

    /************************************************************************************
     * This function is called to update the Demographics Info section of the dashboard *
     ************************************************************************************/
    function updateDemographics(searchIndex) {

        // Create a variable to store the location we will append the return values to
        var output = d3.selectAll(".card-body");

        // Clear any text in the Demographic Info section
        output.text("");

        // Search through the metadata to find the matching ID that the user selected
        data.metadata.forEach(function (dataObjects) {

            // When the matching ID is found, create an array of key value pairs, then append the info
            if (dataObjects.id == searchIndex) {

                // Store the key value pairs inside a variable, type will be an array of arrays
                // example: info = [[key, value], [key, value], ...]
                var info = Object.entries(dataObjects);

                // Loop through the array and append each key value pair to populate the Demographic Info section
                info.forEach(info => output.append("p").text(`${info[0]}: ${info[1]}`));
            };
        });
    };

    // Call the init function to fill in starting values and visualizations
    init();
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
