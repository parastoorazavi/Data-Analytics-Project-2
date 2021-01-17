var info = 'static/python/analysis/hstr_data.json';
var cities = 'static/python/analysis/wa_cities.json';

// date for header of historical page
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
    d3.json((info), function(data) {
        console.log('yes');

        var data = data[0];
        console.log(data); // undefined
        
        // run through the data and add the information in dropdown
        cities.forEach((sample) => {
            Object.entries(sample).forEach(([key, value]) => {
                // add one line for each sample in the dropdown menu showing the City value
                if (key === 'City') {cityDropdown.append('option').text(value)};
            });
        }); 
        // set filter seach output for Perth
        cityDropdown = 'Perth';

        // // variables for line chart
        // var xValues = data.date[];
        // var yValuesLeft = data.uv-index[];

        // build line chart
        var traceUV = {
            x: xValues,
            y: yValuesLeft,
            name: 'UV Index',
            type: 'bar',
            color: '#A43820'
        };

        var layoutGraph = {
            Title: 'Historical UV Index',
            yaxis: {title: 'UV Index'},
            scene: {bgcolor: "#BA5536"}
        };

        Plotly.newPlot('graph', [traceUV], layoutGraph);

        // create gauge chart
        let gauge = {
            domain: {row: 0, column: 1},
            value: uvToday, // extracted in todayUV.js
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
    d3.json(("static/data/samples.json"), function(data) {
        // save the City to a variable
        chosenCity = cityDropdown.property('City');
        
        // variable for City info
        // let metadata = data.metadata;
        let metadataCity = (data.filter(record => record.city == chosenCity));
        dataCity = metadataCity[0];

        // function to add 8 days to the selected date
        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };, 
            // or
        var someDate = new Date();
        var numberOfDaysToAdd = 8;
        someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
            // Formatting to dd/mm/yyyy :
        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();
        var someFormattedDate = dd + '/'+ mm + '/'+ y;

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

// when pressing submit button or press enter, use function
let submitButton = d3.select('#button');
let form = d3.select('#searchForm');
form.on('submit', updatePage());

let resetButton = d3.select('#button2');
form.on('reset', init());