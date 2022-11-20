function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
   // console.log(metadata)
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
var samplesArray = data.samples;
  //   console.log(samplesArray)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
var samplesArrayDesired = samplesArray.filter(a => a.id == sample);
   // console.log(samplesArrayDesired);
    //  5. Create a variable that holds the first sample in the array.
var firstSamp = samplesArrayDesired[0];
 //   console.log(firstSamp)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
var otuIDS = firstSamp.otu_ids;
var otuLabels = firstSamp.otu_labels;
var sampleVals = firstSamp.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
   // var order = otuIDS.sort((e,f) => f-e)
   // console.log(order)


   //var yticks = otuIDS.slice(0,10).reverse().map(otuID => `OTU ${otuID}`);
    var yticks = otuIDS.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    //console.log(yticks)

 //     // 8. Create the trace for the bar chart. 

var barData = [{
  x: sampleVals,
  y: yticks,
  type: "bar",
  orientation: "h"
}];

// 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top Ten Bacteria Cultures Found",
     //   margin:{t: 30, l: 150}
     //   yaxis:{autorange: 'reversed'},
         };
      // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDS,
      Y: sampleVals,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleVals,
        color: otuIDS,
        colorscale: "Electric"
              }
       }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1200
    };

          // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
      
    

      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      
      var samplesnoDesired = data.metadata
   //    console.log(samplesnoDesired);


    // 2. Create a variable that holds the first sample in the metadata array.
    var results = samplesnoDesired.filter(first => first.id == sample);
    var result= results[0];
   // console.log(result)
   
    // 3. Create a variable that holds the washing frequency.
  washFreq = result.wfreq    
   //  console.log(washFreq)
    
    // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 5], y: [0, 1] },
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "Belly Button Wash Frequencey <br> Scrubs Per Week"},
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "lightgray" },
            { range: [2, 4], color: "gray" },
            { range: [4, 6], color: "cyan" },
            { range: [6, 8], color: "royalblue" },
            { range: [6, 8], color: "RebeccaPurple" }
        ]}
  }];

          // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
    });
  }