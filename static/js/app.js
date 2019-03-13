function buildMetadata(sample) {
  console.log("in buildMetadata sample");
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sampleMetaData) => {
    // Use document to select the panel with id of `#sample-metadata`
    var PANEL = document.getElementById("sample-metadata");
    // Clear any existing metadata
    PANEL.innerHTML = '';
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleMetaData).forEach(function([key, value]) {
      console.log(key, value);
      h6tag = document.createElement("h6");
      h6Text = document.createTextNode(`${key}: ${value}`);
      h6tag.append(h6Text);
      PANEL.appendChild(h6tag);
    });
  });
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

// Calls this function for the first time to build chart
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {
    
    var sampleValues = sampleData[0]['sample_values'];
    var otuIDs = sampleData[0]['otu_ids'];
    var labels = [];
    // get otu_labels for hovertext
    d3.json('/otu').then((otuData) => { 
      labels = otuIDs.map(function(item) {
        return otuData[item]
      });
      // Build Pie Chart
      var pieData = [{
        values: sampleValues.slice(0, 10),
        labels: otuIDs.slice(0, 10),
        hovertext : labels.slice(0, 10),
        hoverinfo: 'hovertext',
        type: 'pie'
      }];
      var pieLayout = {
          margin: { t: 0, l: 0 }
      };
      var PIE = document.getElementById('pie');
      Plotly.plot(PIE, pieData, pieLayout);

      // Build Bubble Chart
      var bubbleData = [{
        x: otuIDs,
        y: sampleValues,
        text: labels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: "Earth",
        } 
      }];

      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID' }
      };
      var BUBBLE = document.getElementById('bubble');
      Plotly.plot(BUBBLE, bubbleData, bubbleLayout);
    });
  });
}

// Calls this function each time to update existing chart based on the option change
function updateCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {
    
    var sampleValues = sampleData[0]['sample_values'];
    var otuIDs = sampleData[0]['otu_ids'];
    var labels = [];
    // get otu_labels for hovertext
    d3.json('/otu').then((otuData) => { 
      labels = otuIDs.map(function(item) {
        return otuData[item]
      });
      console.log('in update charts sample values', sampleValues);
      console.log('in update charts outids, ', otuIDs);

      console.log('in update charts labels, ',labels);
      // Build Pie Chart
      var pieUpdate = {
        values: [sampleValues.slice(0, 10)],
        labels: [otuIDs.slice(0, 10)],
        hovertext : [labels.slice(0, 10)],
        hoverinfo: 'hovertext',
        type: 'pie'
      };
      var PIE = document.getElementById('pie');
      Plotly.restyle(PIE, pieUpdate);

      // Build Bubble Chart
      var BUBBLE = document.getElementById('bubble');
      Plotly.restyle(BUBBLE, 'x', [otuIDs]);
      Plotly.restyle(BUBBLE, 'y', [sampleValues]);
      Plotly.restyle(BUBBLE, 'text', [labels]);
      Plotly.restyle(BUBBLE, 'marker.size', [sampleValues]);
      Plotly.restyle(BUBBLE, 'marker.color', [otuIDs]);
    });
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = document.getElementById('selDataset');
  console.log("In Init");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
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
  updateCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
