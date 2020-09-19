// Path to where the JSON object is located
const url = "samples.json";

// Fetch the JSON data and start using it to populate the HTML page
d3.json(url).then(function (data) {

    // Collect an array of the subject ID's and store them in a variable
    var id = Object.values(data.names);

    // Create dropdown menu options for each subject ID
    id.forEach(item => d3.select("#selDataset").append("option").text(`${item}`))

    // Create a variable to hold all the metadata
    var metadata = Object.values(data.metadata);

    // Create a variable to hold all the sample data
    var samples = Object.values(data.samples);

    /**************************************************************************
     * This function creates and fills the starting values and visualizations *
     **************************************************************************/
    function init() {

        /********************
         * DEMOGRAPHIC INFO *
         ********************/

        // Create an array of the initial subjects metadata and call update function to fill in information
        var subject = Object.entries(metadata[0]);
        // updateDemographics(subject);
        
        // // Create a variable to store the location we will append the starting values to
        // var initial_output = d3.selectAll(".card-body");

        // // Loop through the array and append each key value pair to populate the Demographic Info section
        // subject.forEach(info => initial_output.append("p").text(`${info[0]}: ${info[1]}`));

        // Create variables to hold the initial dataset to make plots
        var sampleValues = samples[0].sample_values;
        var otuIds = samples[0].otu_ids;
        var otuLabels = samples[0].otu_labels;

        /*************
         * BAR CHART *
         *************/

        // Creat the bar chart, top 10 OTU's, in descending order
        var barData = [{
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIds.slice(0, 10).reverse().map(name => `OTU ${name}`),
            text: otuLabels.slice(0, 10),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 OTU's",
            xaxis: {
                'title': {
                    'text': 'Sample Values'
                }
            },
            margin: {
                t: 30,
                r: 0,
                b: 40,
                l: 90,
            }
        };

        var config = { responsive: true }

        Plotly.newPlot("bar", barData, barLayout, config);

        /****************
         * BUBBLE CHART *
         ****************/

        // Create the bubble chart
        var bubbleData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                color: otuIds,
                size: sampleValues
            }
        }];

        var barLayout = {
            title: "OTU Bubble Chart",
            xaxis: {
                'title': {
                    'text': "OTU ID's"
                }
            },
            yaxis: {
                'title': {
                    'text': 'Sample Values'
                }
            }
        };

        Plotly.newPlot("bubble", bubbleData, barLayout, config);

        var gaugeData = [{
            value: subject[6][1],
            title: { text: `Belly Button Washing Frequency - Scrubs/Week`, font: { size: 17 } },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                bar: { color: "#0cc194" },
                axis: {
                    range: [0, 9],
                    tickmode: "array",
                    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                },
                steps: [
                    { range: [0, 1], color: "#f6f6f6" },
                    { range: [1, 2], color: "#ececec" },
                    { range: [2, 3], color: "#e2e2e2" },
                    { range: [3, 4], color: "#d8d8d8" },
                    { range: [4, 5], color: "#cecece" },
                    { range: [5, 6], color: "#c5c5c5" },
                    { range: [6, 7], color: "#bbbbbb" },
                    { range: [7, 8], color: "#b1b1b1" },
                    { range: [8, 9], color: "#a7a7a7" }
                ]
            }
        }];

        var gaugelayout = { width: 500, height: 450 };
        Plotly.newPlot('gauge', gaugeData, gaugelayout);

        
        updateDemographics(subject);

    }

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
        metadata.forEach(function (metadataObjects) {

            // When the matching ID is found, create an array of key value pairs
            if (metadataObjects.id == selection) {

                // Store the key value pairs inside a variable, type will be an array of arrays
                // example: info = [[key, value], [key, value], ...]
                var demoInfo = Object.entries(metadataObjects);

                // Call the updateDemographics function to update the section
                updateDemographics(demoInfo);
            };
        });

        /***********
         * SAMPLES *
         ***********/

        // Search through the samples to find the matching ID that the user selected
        samples.forEach(function (samplesObjects) {

            // When the matching ID is found, create an array of values
            if (samplesObjects.id == selection) {

                // Store the values inside a variable, type will be an array of arrays
                // example: info = [[value], [value], ...]
                var chartData = Object.values(samplesObjects);

                // Call the updateDemographics function to update the section
                updateCharts(chartData);
            };
        });
    }

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

        var updateGauge = {
            value: selectedInfo[6][1]
        };

        Plotly.restyle("gauge", updateGauge);

    }

    /****************************************************************************
     * This function is called to update the Bar Chart section of the dashboard *
     ****************************************************************************/
    function updateCharts(selectedData) {

        // Assign each array to the appropriate variable
        var otu_ids = selectedData[1];
        var sample_values = selectedData[2];
        var otu_labels = selectedData[3];

        // Update the bar chart data and use restyle to change the chart without creating a new plot
        var updateBarChart = {
            x: [sample_values.slice(0, 10).reverse()],
            y: [otu_ids.slice(0, 10).reverse().map(name => `OTU ${name}`)],
            text: [otu_labels.slice(0, 10)],
        };

        // Restyle saves processing power and resources compared to newPlot.
        Plotly.restyle("bar", updateBarChart);

        // Update the bubble chart data and use restyle to change the chart
        var updateBubbleChart = {
            x: [otu_ids],
            y: [sample_values],
            text: [otu_labels],
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values
            }
        };

        Plotly.restyle("bubble", updateBubbleChart);
    }

    // Call the init function to fill in starting values and visualizations
    init();
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);