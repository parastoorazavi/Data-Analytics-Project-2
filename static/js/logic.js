var info = 'static/python/analysis/fcst_data.json';
var cities = 'static/python/analysis/wa_cities.json';

// date for header of index page
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = n.toDateString(d + m + y, { month: 'long' });

// select the dropdown menu input
var cityDropdown = d3.select('#City');

// function to show info when the page is loaded
function init() {
    console.log('hello');
    // extract the data from json file
    d3.json((info), function(data) {
        console.log('yes');
        console.log(data);

        var perth = []
        // run through the data and add the information in dropdown
        d3.json((cities), function(city) {        
            // going only through the cities for the dropdown
            Object.entries(city.city).forEach(([key, value]) => {
                // add one line for each sample in the dropdown menu showing the City value
                cityDropdown.append('option').text(value);
                // // extract info for Perth
                // if (value === 'Perth') {//use key value to extract lat and long};
                // return perth;
                
            });
            console.log(perth);
        }); 
            
        
        
    });
};

// start the function to load the page
init();

