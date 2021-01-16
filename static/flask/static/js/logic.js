var info = 'static/python/analysis/fcst_data.json';
var cities = 'static/python/analysis/hstr_data_city.json';

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

        var perth = [];
        // run through the data and add the information in dropdown
        d3.json((cities[0]), function(city) {        
            // going only through the cities for the dropdown
            Object.entries(city).forEach(([key, value]) => {
                // add one line for each sample in the dropdown menu showing the City value
                if (key === 'city') {cityDropdown.append('option').text(value)};
                // extract info for Perth
                if (key === 'city' & value === 'Perth') {perth.push(city)};
                return perth;
                
            });
            console.log(perth);
        }); 
            
        
        
    });
};

// start the function to load the page
init();

