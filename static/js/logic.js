info = 'static/python/analysis/fcst_data.json'

// date for header of index page
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = n.toDateString(d + m + y, { month: 'long' });

// select the dropdown menu input
let cityDropdown = d3.select('#City');

// function to show info when the page is loaded
function init() {
    console.log('hello');
    // extract the data from json file
    d3.json(info).then((data) => {
        console.log('yes');

        // run through the data and add the information in dropdown
        samples.forEach((sample) => {
            Object.entries(sample).forEach(([key, value]) => {
                // add one line for each sample in the dropdown menu showing the City value
                if (key === 'City') {cityDropdown.append('option').text(value)};
            });
        }); 
        // set filter seach output for Perth
        cityDropdown = 'Perth';

        // variables for line chart
        var xValues = data.date;
        var yValuesLeft = data.uv-index;
        var yValuesRight = data.max-temperature;

        // build line chart
        var traceUV = {
            x: xValues,
            y: yValuesLeft,
            name: 'UV Index',
            type: 'bar',
            color: '#A43820'
        };

        var traceTemp = {
            x: xValues,
            y: yValuesRight,
            name: 'Maximum Temperature (C)',
            type: 'bar',
            color: '#46211A',
        };

        var layoutGraph = {
            Title: 'UV Index and Maximum Temperature',
            yaxis: {title: 'UV Index'},
            yaxis2: {
                title: 'Maximum Temperature (C)',
                titlefont: {color: '#A43820'},
                tickfont: {color: '#46211A'},
                overlaying: 'y',
                side: 'right',
            }
        };

        Plotly.newPlot('graph', [traceUV, traceTemp], layoutGraph);

        // create gauge chart
        let gauge = {
            domain: {row: 0, column: 1},
            value: data.uvIndex[0],
            title: 'UV Index TODAY',
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [1, 16]},
                bar: {color: 'darkblue'},
                steps: [
                    {range: [1, 3], color: 'yellowgreen'},
                    {range: [3, 6], color: 'gold'},
                    {range: [6, 8], color: 'orange'},
                    {range: [8, 11], color: 'darkgoldenrod'},
                    {range: [11, 16], color: 'red'},
                ]
            }
        };

        Plotly.newPlot('gaugeChart', [gauge]);
    });
};

// start the function to load the page
init();

// function for updating the page
function updatePage() {
    // extract the data from json file
    d3.json("static/data/samples.json").then((data) => {
        // save the City to a variable
        chosenCity = cityDropdown.property('City');
        
        // variable for City info
        // let metadata = data.metadata;
        let metadataCity = (data.filter(record => record.city == chosenCity));
        dataCity = metadataCity[0];

        // variables for line chart
        var xValues = dataCity.date;
        var yValuesLeft = dataCity.uv-index;
        var yValuesRight = dataCity.max-temperature;

        // restyle the linegraph with chosen city data
        Plotly.restyle();

        // update gauge chart
        Plotly.restyle("gaugeChart", "value", [dataCity.uv-index]);
    });
};

// Add event listener for City change dropdown
d3.select("#City").on("change", updatePage);