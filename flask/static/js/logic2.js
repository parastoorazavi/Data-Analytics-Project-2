var info = 'http://127.0.0.1:5000/api/v1.0/city';
var cities = 'static/python/analysis/wa_cities.json';

// var info = 'static/flask/hist.sqlite';
// var cities = 'static/flask/cities.sqlite';

// date for header of historical page
n =  new Date();
y = n.getFullYear() - 1;
m = n.getMonth() + 1;
d = n.getDate();
console.log(y);
document.getElementById("date").innerHTML = n.toLocaleString(d + m + y, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
alert("hi");
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

