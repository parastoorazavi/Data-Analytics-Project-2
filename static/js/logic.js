info = 'static/python/analysis/fcst_data.json'

// date for header of index page
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = n.toDateString(d + m + y, { month: 'long' });

// select the dropdown menu input
let cityDropdown = d3.select('#City');

// function to show infor when the page is loaded
function init() {
    console.log('hello');
    // set filter seach output for Perth
    
    // extract the data from json file
    d3.json(info).then((data) => {
        console.log('yes');
        let uvIndex = uv-index[0];
        // create gauge chart
        let gauge = {
            domain: {row: 0, column: 1},
            value: uvIndex,
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
                    // {range: [5, 6], color: 'palegreen'},
                    // {range: [6, 7], color: 'palegreen'},
                    // {range: [7, 8], color: 'chartreuse'},
                    // {range: [8, 9], color: 'chartreuse'},
                ]
            }
        }
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
        let metadata = data.metadata;
        let metadataCity = (metadata.filter(record => record.id == chosenCity));
        metadataCity = metadataCity[0];

    });
};