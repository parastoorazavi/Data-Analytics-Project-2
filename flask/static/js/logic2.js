var info = '/api/v1.0/wa';
var cities = '/api/v1.0/city';

// date for header of historical page
let n =  new Date();
m = n.getMonth() + 1;
d = n.getDate();
y = n.setFullYear(n.getFullYear() - 1);
document.getElementById("date").innerHTML = n.toLocaleString(d + m, {weekday: 'long', day: 'numeric', month: 'long'});

// select the dropdown menu input
var cityDropdown = d3.select('#City');

// function to show info when the page is loaded
function init() {
    console.log('hello init');
    
    // extract the data from json file
    d3.json((info), function(data) {
        console.log('yes');
        console.log(data);
        
        // run through the data and add the information in dropdown
        d3.json((cities), function(city) {    
            // empty list of cities
            var perth = [];
            
            // city = city.slice(0,83); 
            var cityList = [];
            
            // loop to get info from city list
            for (i=0; i<city.length; i++) {
                Object.entries(city[i]).forEach(([key, value]) => { 
                    // add cities to the citiesList
                    if (key === 'city') {cityList.push(value)};
                    // extract info for Perth
                    if (key === 'city' && value === 'Perth') {perth.push(city[i])};
                });
            };
            console.log(perth);
            // reducing the cities list for the dropdown to 83 cities
            cityList = cityList.slice(0,83);
            // add cites list to dropdown menu
            cityList.forEach((City) => {
                // ad one line for each city
                let line = cityDropdown.append('option');
                // log each city in the array
                line.text(City);
            });

            // info date format for Perth line chart
            var month = n.getMonth() + 1;
            var dateL = '';
          
            if (month <10) {dateL = '2020-0'+ month + '-' + n.getDate() + ' 12:00:00'}
            else dateL = '2020-'+ month + '-' + n.getDate() + ' 12:00:00';
            
            console.log(dateL);

            // variables for bar chart
            var xValues = [];
            var yValues = [];

            // get current + 8 day array for plot
            var dateFound = false;
            var counter = 0;
            for (i=0; i<perth.length; i++) {
                
                if (perth[i].date == dateL) {
                    dateFound = true;
                };
                if (dateFound && counter < 9) {
                    xValues.push(perth[i].date.split(' ')[0]);
                    yValues.push(perth[i].uv_index);
                    counter = counter + 1;
                }
                
                if (dateFound && counter >= 9) {
                    break;
                }
            };
            
            console.log(xValues);
            console.log(yValues);

            // build bar chart
            var traceHist = {
                x: xValues,
                y: yValues,
                name: 'UV Index Historical',
                type: 'line',
                marker: {color: '#a43820'},
            };

            var layoutGraph = {
                // barmode: 'group',
                xaxis: {
                    tickfont: {color: '#003b46'},
                },
                yaxis: {
                    title: 'UV Index historical',
                    titlefont: {color: '#a43820'},
                    tickfont: {color: '#a43820'},   
                },             
                paper_bgcolor: '#c4dfe6',
                plot_bgcolor: '#c4dfe6',
            };

            Plotly.newPlot('graph', [traceHist], layoutGraph);


            // create gauge chart
            let gauge = {
                domain: {row: 0, column: 1},
                value: 5, // extracted in todayUV.js
                title: 'UV Index TODAY',
                type: 'indicator',
                mode: 'gauge+number',
                index: true,
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

// button.addEventListener('click',function(){
    // function for updating the page
    function updatePage() {
        console.log('hello updatepage')
        d3.event.preventDefault();
        // extract the data from json file
        d3.json((cities), function(city) {
            console.log(city);
            // save the City to a variable
            var chosenCity = cityDropdown.node().value;
           
            console.log('chosencity ' + chosenCity);

            // empty list for chosenCity info
            var chosenCityInfoX = [];

            // loop to get info from city list
            // for (i=0; i<city.length; i++) {
            //     // Object.entries(city[i]).forEach(([key, value]) => { 
            //     //     // console.log('key' + key);
            //     //     // console.log('value' + value);
            //     //     // extract info for chosen City
                    
            //     //     if ((key == 'city') && (value == chosenCity)) {
            //     //         // chosenCityInfoX.push(JSON.stringify(city[i]));
            //     //         chosenCityInfoX.push(city[i]);
            //     //         console.log(city[i]);
            //     //         typeof city[i];
            //     //     };
            //     // });
                
            // };
            city.forEach(function(res){
                console.log(res);
                if (res.city == chosenCity){
                    chosenCityInfoX.push(res);
                }
            });
            // console.log('chosenCityInfo' + JSON.parse(chosenCityInfoX));
            console.log('chosenCityInfo' + chosenCityInfoX);


        });
    };


// });




// when pressing submit button or press enter, use function
let submitButton = d3.select('#button');
let form = d3.select('#searchForm');
form.on('submit', updatePage);

let resetButton = d3.select('#button2');
form.on('reset', init);
