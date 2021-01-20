var info = 'http://127.0.0.1:5000/api/v1.0/wa';
var cities = 'http://127.0.0.1:5000/api/v1.0/city';
var weather = 'https://api.openweathermap.org/data/2.5/onecall?'

// date for header of index page
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = n.toLocaleString(d + m + y, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});

// select the dropdown menu input
var cityDropdown = d3.select('#City');

// function to show info when the page is loaded
function init() {
    console.log('hello');
    // extract the data from json file
    d3.json((info), function(data) {
        console.log('yes');
        console.log(data);
        




    // code for map here








        // run through the data and add the information in dropdown
        d3.json((cities), function(city) {    
            // empty list of cities
            var perth = [];
            
            // city = city.slice(0,83); 
            var cityList = [];

            // loop to get info from city list
            for (i=0; i<city.length; i++) {
                Object.entries(city[i]).forEach(([key, value]) => { 
                    // console.log(key, value);
                    // add one cities to the citiesList
                    if (key === 'city') {cityList.push(city[i])};
                    // extract info for Perth
                    if (key === 'city' && value === 'Perth') {perth.push(city[i])};
                });
            };

            // reducing the cities list for the dropdown to 83 cities
            cityList = cityList.slice(0,83);
            console.log(cityList);

            // variables for API call
            var lat = -31.951999999999998;
            var lon = 115.859;
            var exclude = ['minutely','hourly','alerts'];
            var units = 'metric';

            // add cites list to dropdown menu
            for (i=0; i<cityList.length; i++) {
                Object.entries(cityList[i]).forEach(([key, value]) => { 
                    // add cites list to dropdown menu
                    if (key === 'city') {
                        // ad one line for each city
                        let line = cityDropdown.append('option');
                        // log each city in the array
                        line.text(value);
                    };
                    // // extract coordinates for Perth
                    // if (key === 'city' && value === 'Perth') {
                    //     console.log(cityList[i]);
                    //     if (cityList[i].key === 'latitude') {lat.push(cityList[i].value)};
                    //     if (key === 'longitude') {lon.push(value)};
                    // };
                });
            };

            console.log(lat, lon);

            // extract info from openweathermap
            var weatherAPI = `${weather}lat=${lat}&lon=${lon}&units${units}&exclude=${exclude}&appid=${API_KEY_W}`
            
            function ?? (weatherAPI) {
                
            }
            

            console.log(weatherAPI);
        
            // // variables for line chart
            var xValues = ['16-01-2020', '17-01-2020', '18-01-2020', '19-01-2020', '20-01-2020', '21-01-2020', '22-01-2020', '23-01-2020', '24-01-2020'];
            let yValuesUV = [3, 4, 14, 6, 15, 8, 3, 4, 7];
            var yValuesTemp = [32, 34, 37, 32, 38, 35, 38, 29, 35]



            // build line chart
            var traceCurrent = {
                x: xValues,
                y: yValuesUV,
                name: 'UV Index',
                type: 'bar',
                marker: {color: '#a43820'},
            };

            var traceTemp = {
                x: xValues,
                y: yValuesTemp,
                name: 'Max Temperature',
                type: 'line',
                marker: {color: '#003b46'},
                yaxis: 'y2',

            }

            var layoutGraph = {
                xaxis: {
                    tickfont: {color: '#003b46'},
                },
                yaxis: {
                    title: 'UV Index',
                    titlefont: {color: '#a43820'},
                    tickfont: {color: '#a43820'},
                },
                yaxis2: {
                    title: 'Maximum Temperature',
                    titlefont: {color: '#003b46'},
                    tickfont: {color: '#003b46'},
                    overlaying: 'y',
                    side: 'right',
                },
                paper_bgcolor: '#c4dfe6',
                plot_bgcolor: '#c4dfe6',
            };

            Plotly.newPlot('graph', [traceCurrent, traceTemp], layoutGraph);

            // create gauge chart
            let gauge = {
                domain: {row: 0, column: 1},
                value: 5, // extracted in todayUV.js
                title: 'UV Index TODAY',
                type: 'indicator',
                mode: 'gauge+number',
                index: true,
                paper_bgcolor: '#c4dfe6',
                plot_bgcolor: '#c4dfe6',
                gauge: {
                    axis: {range: [1, 16]},
                    bar: {color: '#003B46'},
                    steps: [
                        {range: [1, 3], color: 'yellowgreen'},
                        {range: [3, 6], color: 'gold'},
                        {range: [6, 8], color: 'orange'},
                        {range: [8, 11], color: 'red'},
                        {range: [11, 16], color: 'darkorchid'},
                    ]
                }
            };
            

            Plotly.newPlot('gaugeChart', [gauge]);  
        });
        
    });
};

// start the function to load the page
init();

