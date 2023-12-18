
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Fetch data and log to console
d3.json(url).then(function (bellybutton) {
    console.log(bellybutton);
});
// Top 10 OTUs
function bellybutton(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let samples = sampleData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let barTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU' + object),
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top 10 OTUs for Subject ${id}`, 
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };
        let barData = [barTrace];
        Plotly.newPlot('bar', barData, barLayout);
    })
}

// Fetch data and create bubble chart
function createBubbleChart(id) {
    d3.json(url).then(function (data) {
        let sampleData = data.samples;
        let sample = sampleData.find(s => s.id === id);
        let trace = {
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: 'Viridis'  // You can choose a different colorscale if desired
            },
            text: sample.otu_labels
        };
        let layout = {
            title: `Bubble Chart for Subject ${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
        let bubbleData = [trace];
        Plotly.newPlot('bubble', bubbleData, layout)    
    })
};

// Create new plot upon ID change
function optionChanged(id) {
    bellybutton(id);
    showDemographicInfo(id)
    createBubbleChart(id)
    // panelInfo(id);  // You might need to implement this function or remove the call if not needed.
};

// Dropdown Menu and initial function
function init() {
    let dropDown = d3.select('#selDataset');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        optionChanged(names[0]);  // Call the function with the initial value
    })
};

// Demographic Info
function showDemographicInfo(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample => sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};

// Call the init function to set up the initial state
init();
