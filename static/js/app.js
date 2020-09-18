// Path to where the JSON object is located
const url = "samples.json";

// Fetch the JSON data and start using it to populate the HTML page
d3.json(url).then(function (data) {

    // Collect an array of the subject ID's and store them in a variable
    var id = Object.values(data.names);
    
    // Create dropdown menu options for each subject ID
    id.forEach(item => d3.select("#selDataset").append("option").text(`${item}`))

    var initialPlot = Object.values(data.samples);

    /**************************************************************************
     * This function creates and fills the starting values and visualizations *
     **************************************************************************/
    function init() {
        
        // Set the inital subject ID
        var initialSelection = d3.select("#selDataset").property("value");

        var yAxis = initialPlot[0].otu_ids.slice(0,10).reverse();
        var x = yAxis.map(name => `OTU ${name}`);
        console.log(yAxis);
        
        var data = [{
            x: initialPlot[0].sample_values.slice(0,10).reverse(),
            y: x,
            text: initialPlot[0].otu_labels.slice(0,10),
            name: `ID: ${initialSelection}`,
            type: "bar",
            orientation: "h"
        }];

        var layout = {
            title: `Top 10 OTU's for Subject ID: ${initialSelection}`,
            margin: {
                t: 30,
                r: 0,
                b: 20,
                l: 90,
            }
        };

        Plotly.newPlot("bar", data, layout);


        // Call the optionChanged function to fill in starting values
        optionChanged(initialSelection);
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

        /************
        * METADATA *
        ************/

        // Search through the metadata to find the matching ID that the user selected
        data.metadata.forEach(function (metadataObjects) {

            // When the matching ID is found, create an array of key value pairs
            if (metadataObjects.id == selection) {

                // Store the key value pairs inside a variable, type will be an array of arrays
                // example: info = [[key, value], [key, value], ...]
                var demoInfo = Object.entries(metadataObjects);

                // Call the updateDemographics function to update the section
                updateDemographics(demoInfo);
            };
        });

        /**********
        * SAMPLES *
        ***********/

        // Search through the samples to find the matching ID that the user selected
        data.samples.forEach(function (samplesObjects) {

            // When the matching ID is found, create an array of values
            if (samplesObjects.id == selection) {

                // Store the values inside a variable, type will be an array of arrays
                // example: info = [[value], [value], ...]
                var barData = Object.values(samplesObjects);

                // Call the updateDemographics function to update the section
                //updateBarChart(barData);
            };
        });
    };

    /************************************************************************************
     * This function is called to update the Demographics Info section of the dashboard *
     ************************************************************************************/
    function updateDemographics(selectedInfo) {

        // Create a variable to store the location we will append the return values to
        var output = d3.selectAll(".card-body");

        // Clear any text in the Demographic Info section
        output.text("");

        // Loop through the array and append each key value pair to populate the Demographic Info section
        selectedInfo.forEach(info => output.append("p").text(`${info[0]}: ${info[1]}`));

    };

    /****************************************************************************
     * This function is called to update the Bar Chart section of the dashboard *
     ****************************************************************************/
    function updateBarChart(selectedData) {

        // Create a variable to store the location we will append the bar chart to
        var output = d3.selectAll("#bar");

        // Clear any text in the Demographic Info section
        output.text("");

        // Assign each array to the appropriate variable and get the top 10 results
        var otu_ids = selectedData[1].slice(0,10);
        var sample_values = selectedData[2].slice(0,10);
        var otu_labels = selectedData[3].slice(0,10);
        
    };

    // Call the init function to fill in starting values and visualizations
    init();
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);