function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  console.log(sample);
  var PANEL = document.getElementById("sample-metadata");
  // Clear any existing metadata
  PANEL.innerHTML = '';
  // Loop through all of the keys in the json response and
  // create new metadata tags
  for(var data in sample) {
      h6tag = document.createElement("h6");
      h6Text = document.createTextNode(`${data}: ${sample[data]}`);
      h6tag.append("Hello");
      PANEL.appendChild(h6tag);
  }
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log("In Init");
  // Use the list of sample names to populate the select options
  Plotly.d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      var currentOption = document.createElement('option');
      currentOption.text = sample;
      currentOption.value = sample;
      selector.appendChild(currentOption);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
