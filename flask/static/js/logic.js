let info = '/api/v1.0/wa';
let cities = '/api/v1.0/city';
let weather = 'https://api.openweathermap.org/data/2.5/onecall?'

// date for header of index page
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = n.toLocaleString(d + m + y, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});

// select the dropdown menu input
var cityDropdown = d3.select('#City');

// function to show map when the page is loaded
function initMap() {

    // run through the data and add the information in dropdown
    d3.json((cities), function(city) {  
        
        // add cities from dropdown to the a variable for a layer
        // empty array of city info; 
        var cityList = [];

        // loop to get info from city list
        for (i=0; i<city.length; i++) {
            Object.entries(city[i]).forEach(([key, value]) => { 
                // add one cities to the citiesList
                if (key === 'city') {cityList.push(city[i])};
            });
        };

        // reducing the cities list to all 83 cities
        cityList = cityList.slice(0,83);

        var cityMarkers = [];

        for (var i = 0; i<cityList.length; i++) {
            cityMarkers.push(
                L.circle([cityList[i].latitude, cityList[i].longitude], {
                    stroke: true,
                    fillOpacity:0.5,
                    color: '#07575b',
                    fillColor: '#07575b',
                    radius: 200,

                }), 
            );
                // .bindPopup('<h5>' + cityList[i].city + '</h5>'); 
        };

        // initiate the map

        // Insert Max Boundaries to WA 
        var southWest = L.latLng(-35, 100);
        var northEast = L.latLng(-10, 140);
        var bounds = L.latLngBounds(southWest, northEast);

        var myMap = L.map('map', {
            center: [-25.328, 122.298],
            mapbounds: bounds, // Initiate max bounds
            zoomSnap: 0.1,
            zoom: 5.5,
            minZoom: 4.8,
            zoomControl: true,
        });
        
        // basemap layer
        var osm = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY_M
          }).addTo(myMap);

        // darkmap layer
        var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 18,
        bounds: [[-90, -180], [90, 180]],
        noWrap: true,
        id: 'dark-v10',
        accessToken: API_KEY_M
        });

        // create layer groups
        var citiesLL = L.layerGroup(cityMarkers);

        // Insert Suburb Boundaries
            
        var geoData = 'static/waSuburbs.geojson'


        var geojson;

        function getColor(d) {
            return  d > 18000 ? '#800026' :
                    d > 16000  ? '#BD0026' :
                    d > 15000  ? '#E31A1C' :
                    d > 14000  ? '#FC4E2A' :
                    d > 13000   ? '#FD8D3C' :
                    d > 12000   ? '#FEB24C' :
                    d > 11000   ? '#FED976' :
                    '#FFEDA0';
        }

        function style(feature) {
            return {
                fillColor: getColor(feature.properties.lc_ply_pid),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.8
            };
        }

        // // Use D3 to read the data into Leaflet
            d3.json(geoData, function(data){
                L.geoJson(data, {
                    style: style,
        // onEachFeature: onEachFeature
                }).addTo(myMap);
            });

        // basemaps object to hold all layers
        var baseMaps = {
            'Light map': osm,
            'Dark Map': darkmap
        };

        // create overlay object
        var overlayMaps = {
            'Cities': citiesLL,
        }
       
        // layer control containing basemaps and overlay
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false,
        }).addTo(myMap);
        
        var popup = L.popup();

        //popup function
        function onMapClick(e) {
            popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString()) //esample from leaflet, will be immediately replaced by weatherpopup...
            .openOn(myMap);

            //getting json function
            $(document).ready(function(){
                $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + e.latlng.lat + '&lon=' + e.latlng.lng + "&appid=" + API_KEY_W,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    // storing json data in variables
                    uvindex = data.current.uvi; // UV Index
                    weatherlocation_lon = data.lon; // lon WGS84
                    weatherlocation_lat = data.lat; // lat WGS84
                    weatherstationname = data.name // Name of Weatherstation
                    weatherstationid = data.id // ID of Weatherstation
                    weathertime = data.dt // Time of weatherdata (UTC)
                    temperature = data.current.temp; // Kelvin
                    airpressure = data.current.pressure; // hPa
                    airhumidity = data.current.humidity; // %
                    temperature_min = data.daily.temp_min; // Kelvin
                    temperature_max = data.daily.temp_max; // Kelvin
                    windspeed = data.current.wind_speed; // Meter per second
                    winddirection = data.current.wind_deg; // Wind from direction x degree from north
                    cloudcoverage = data.current.clouds; // Cloudcoverage in %

                    weatherconditionid = data.current.weather[0].id // ID
                    weatherconditionstring = data.current.weather[0].main // Weatheartype
                    weatherconditiondescription = data.current.weather[0].description // Weatherdescription
                    weatherconditionicon = data.current.weather[0].icon // ID of weathericon

                    // Converting Unix UTC Time
                    var utctimecalc = new Date(weathertime * 1000);
                    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
                    var year = utctimecalc.getFullYear();
                    var month = months[utctimecalc.getMonth()];
                    var date = utctimecalc.getDate();
                    var hour = utctimecalc.getHours();
                    var min = utctimecalc.getMinutes();
                    var sec = utctimecalc.getSeconds();
                    var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min + ' Uhr';

                    // recalculating
                    var weatherconditioniconhtml = "http://openweathermap.org/img/w/" + weatherconditionicon + ".png";
                    var weathertimenormal = time; // reallocate time var....
                    var temperaturecelsius = Math.round((temperature - 273) * 100) / 100;  // Converting Kelvin to Celsius
                    var windspeedknots = Math.round((windspeed * 1.94) * 100) / 100; // Windspeed from m/s in Knots; Round to 2 decimals
                    var windspeedkmh = Math.round((windspeed * 3.6) * 100) / 100; // Windspeed from m/s in km/h; Round to 2 decimals
                    var winddirectionstring = "Im the wind from direction"; // Wind from direction x as text
                    if (winddirection > 348.75 &&  winddirection <= 11.25) {
                        winddirectionstring =  "North";
                    } else if (winddirection > 11.25 &&  winddirection <= 33.75) {
                        winddirectionstring =  "Northnortheast";
                    } else if (winddirection > 33.75 &&  winddirection <= 56.25) {
                        winddirectionstring =  "Northeast";
                    } else if (winddirection > 56.25 &&  winddirection <= 78.75) {
                        winddirectionstring =  "Eastnortheast";
                    } else if (winddirection > 78.75 &&  winddirection <= 101.25) {
                        winddirectionstring =  "East";
                    } else if (winddirection > 101.25 &&  winddirection <= 123.75) {
                        winddirectionstring =  "Eastsoutheast";
                    } else if (winddirection > 123.75 &&  winddirection <= 146.25) {
                        winddirectionstring =  "Southeast";
                    } else if (winddirection > 146.25 &&  winddirection <= 168.75) {
                        winddirectionstring =  "Southsoutheast";
                    } else if (winddirection > 168.75 &&  winddirection <= 191.25) {
                        winddirectionstring =  "South";
                    } else if (winddirection > 191.25 &&  winddirection <= 213.75) {
                        winddirectionstring =  "Southsouthwest";
                    } else if (winddirection > 213.75 &&  winddirection <= 236.25) {
                        winddirectionstring =  "Southwest";
                    } else if (winddirection > 236.25 &&  winddirection <= 258.75) {
                        winddirectionstring =  "Westsouthwest";
                    } else if (winddirection > 258.75 &&  winddirection <= 281.25) {
                        winddirectionstring =  "West";
                    } else if (winddirection > 281.25 &&  winddirection <= 303.75) {
                        winddirectionstring =  "Westnorthwest";
                    } else if (winddirection > 303.75 &&  winddirection <= 326.25) {
                        winddirectionstring =  "Northwest";
                    } else if (winddirection > 326.25 &&  winddirection <= 348.75) {
                        winddirectionstring =  "Northnorthwest";
                    } else {
                        winddirectionstring =  " - currently no winddata available - ";
                    };

                    //Popup with content
                    var fontsizesmall = 1;
                    popup.setContent("Weatherdata:<br>" + "<img src=" + weatherconditioniconhtml + "><br>" + weatherconditionstring + " (Weather-ID: " + weatherconditionid + "): " + weatherconditiondescription + "<br><br> <strong>UV Index: " + uvindex + "</strong><br><br>Temperature: " + temperaturecelsius + "°C<br>Airpressure: " + airpressure + " hPa<br>Humidity: " + airhumidity + "%" + "<br>Cloudcoverage: " + cloudcoverage + "%<br><br>Windspeed: " + windspeedkmh + " km/h<br>Wind from direction: " + winddirectionstring + " (" + winddirection + "°)" + "<br><br><font size=" + fontsizesmall + ">Datasource:<br>openweathermap.org<br>Measure time: " + weathertimenormal + "<br>Weatherstation: " + weatherstationname + "<br>Weatherstation-ID: " + weatherstationid + "<br>Weatherstation Coordinates: " + weatherlocation_lon + ", " + weatherlocation_lat);           
                    },
                    error: function() {
                        alert("error receiving wind data from openweathermap");
                    }
                });        
            });
            //getting json function ends here

        //popupfunction ends here
        }

        //popup
        myMap.on('click', onMapClick);

    });
        
};

// function to show info when the page is loaded
function init() {

    // run through the data and add the information in dropdown
    d3.json((cities), function(city) {    
        // empty list of cities
        var perth = [];
        
        // empty array of city info; 
        var cityList = [];

        // loop to get info from city list
        for (i=0; i<city.length; i++) {
            Object.entries(city[i]).forEach(([key, value]) => { 
                // add one cities to the citiesList
                if (key === 'city') {cityList.push(city[i])};
                // extract info for Perth
                if (key === 'city' && value === 'Perth') {perth.push(city[i])};
            });
        };

        // reducing the cities list for the dropdown to 83 cities
        cityList = cityList.slice(0,83);

        // variables for API call
        var lat = [];
        var lon = [];
        var exclude = ['minutely','hourly','alerts','current'];

        // add cites list to dropdown menu & extract lat &
        for (i=0; i<cityList.length; i++) {
            Object.entries(cityList[i]).forEach(([key, value]) => { 
                // add cites list to dropdown menu
                if (key === 'city') {
                    // ad one line for each city
                    let line = cityDropdown.append('option');
                    // log each city in the array
                    line.text(value);
                };
                // extract coordinates for Perth
                if (key === 'city' && value === 'Perth') {
                    var lat1 = (cityList[i].latitude);
                    var lon1 = (cityList[i].longitude);
                    lat.push(lat1);
                    lon.push(lon1);
                };
            });
        };

        // extract info from openweathermap
        var weatherAPI = `${weather}lat=${lat}&lon=${lon}&units=metric&exclude=${exclude}&appid=${API_KEY_W}`

        // empty array for values
        var xValues = [];
        var yValuesUV = [];
        var yValuesTemp = [];

        d3.json(weatherAPI, function(response) {
            response.daily.forEach(function(data){
                xValues.push(data.dt);
                yValuesUV.push(data.uvi);
                yValuesTemp.push(data.temp.max);
            });

            // Converting Unix UTC Time
            for (i=0; i<xValues.length; i++) {
                var utctimecalc = new Date(xValues[i] * 1000);
                // weekday
                var weekday = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat','Sun'];
                var day = weekday[utctimecalc.getDay()];
                // day
                var date = utctimecalc.getDate();
                //month
                var months = ['Jan','Feb','Mar','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec','12'];
                var month = months[utctimecalc.getMonth()];
                // update array
                xValues[i] = day + ' ' + date + ' ' + month + ' ';
            };

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
                value: yValuesUV[0],
                title: 'UV Index TODAY<br>for your chosen City or Town',
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

            var layout = {
                paper_bgcolor: "#C4DFE6",
                color: '#003b46',
            }
            
            Plotly.newPlot('gaugeChart', [gauge], layout);  
        });
    });
};

// start the function to load the page
initMap();
init();

// function for updating the page
function updatePage() {

    // prevent enter from refreshing the page
    d3.event.preventDefault();

    // run through the data and add the information in dropdown
    d3.json((cities), function(city) {    

         // save the City to a variable
        let chosenCity = cityDropdown.node().value;
        
        // empty list for chosenCity info
        var chosenCityInfo = [];

        for (i=0; i<84; i++) {            
            Object.entries(city[i]).forEach(([key, value]) => { 
                // extract info for chosen city
                if (key === 'city' && value === chosenCity) {chosenCityInfo.push(city[i])}; 
            });
        };

        // variables for API call
        var lat = [];
        var lon = [];
        var exclude = ['minutely','hourly','alerts','current'];

        for (i=0; i<chosenCityInfo.length; i++) {
            lat.push(chosenCityInfo[i].latitude);
            lon.push(chosenCityInfo[i].longitude);
        };

        // extract info from openweathermap
        var weatherAPI = `${weather}lat=${lat}&lon=${lon}&units=metric&exclude=${exclude}&appid=${API_KEY_W}`

        // empty array for values
        var xValuesChosen = [];
        var yValuesUVChosen = [];
        var yValuesTempChosen = [];

        d3.json(weatherAPI, function(response) {
            response.daily.forEach(function(data){
                xValuesChosen.push(data.dt);
                yValuesUVChosen.push(data.uvi);
                yValuesTempChosen.push(data.temp.max);
            });

            // update uv chart
            Plotly.restyle('graph', 'x', [xValuesChosen]);
            Plotly.restyle('graph', 'y', [yValuesUVChosen]);
            Plotly.restyle('graph', 'y', [yValuesTempChosen]);
            Plotly.restyle('gaugeChart', 'value', [yValuesUVChosen[0]]);

        });
    });
    
};


// when pressing submit button or press enter, use function
let submitButton = d3.select('#button');
let form = d3.select('#searchForm');
form.on('submit', updatePage);

let resetButton = d3.select('#button2');
form.on('reset', init);