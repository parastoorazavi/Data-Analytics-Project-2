var info = 'static/python/analysis/hstr_data.json';
var cities = 'static/python/analysis/wa_cities.json';

// date for header of historical page
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

        
    });
};

// start the function to load the page
init();

