let info = '/api/v1.0/wa';
let cities = '/api/v1.0/city';
// let citiesBackup = '../static/jsoncity.json'
var weather = 'https://api.openweathermap.org/data/2.5/onecall?'

// date for header of historical page
let n =  new Date();
m = n.getMonth() + 1;
d = n.getDate();
y = n.setFullYear(n.getFullYear() - 1);
document.getElementById("date").innerHTML = n.toLocaleString(d + m, {weekday: 'long', day: 'numeric', month: 'long'});

// select the dropdown menu input
var cityDropdown = d3.select('#City');
var dateInput = d3.select('#datetime');

// fundtion to show map when the page is loaded
function initMap(){
    console.log('map init');

    // set grid data to variable
    var gridData = '../static/hstr_data_grid.csv'

    // d3 json to get data
    d3.csv(gridData, d => {

        // date range
        var dateStart = '2020-01-15 12:00:00'
        // var dateEnd = '2020-03-09 12:00:00'

        // contour layer
        var dataMarkers = [];
        var gridPoints = [];
        for ( var i=0; i<d.length; i++ ) {
            if ( !( [d[i].latitude, d[i].longitude] in dataMarkers ) & ( d[i].date == dateStart ) ) {
                gridPoints.push({'x':parseFloat(d[i].longitude), 'y':parseFloat(d[i].latitude), 'uvi':parseFloat(d[i].uv_index)});
                dataMarkers.push(L.circle([d[i].latitude, d[i].longitude], 20000) 
                .bindPopup(`UVI ${d[i].uv_index} @ ${d[i].date}<hr>lat: ${d[i].latitude}  |  lon: ${d[i].longitude}`));
            }
        };
        var markerLayer = L.layerGroup(dataMarkers);

        // Populate a grid of n×m values.  Uses library d3-array
        var n = 7;
        var m = 5;
        var values = new Array(n * m);
        for ( var j=0; j<m; j++ ) {
            for ( var k=0; k<n; k++) {
            values[j*n+k] = gridPoints[j*n+k].uvi;
            }
    };

    // Converts from grid coordinates (indexes lon-lat) to leaflet coordinates (geographic lat-lon).
    var transform = ({type, value, coordinates}) => {
        return {type, value, coordinates: coordinates.map(rings => {
            return rings.map(points => {
                return points.map(([x, y]) => ([
                -36 - (((-36+12)/m) * y),
                112 + (((128-112)/n) * x)
                ]));
            });
        })};
    }

    // Compute the contour polygons at intervals; returns an array of 'multiPolygon'.  Uses library d3-contour.
    var contours = d3.contours()
        .size([n, m])
        .thresholds([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
        .smooth(true)
        (values).map(transform);

    // d3-contour creates 'multiPolygon' array which are no longer supported by leaflet
    // take contour coordinaters and make 'polygons' to group as layer.
    var polygons = [];
    for ( var i=0; i<contours.length; i++ ) {
        var latlngs = [];
        if (contours[i].coordinates.length != 0) {
            for ( var j=0; j<contours[i].coordinates.length; j++)
            for (var k=0; k<contours[i].coordinates[j][0].length; k++) {
                latlngs.push( contours[i].coordinates[j][0][k] );
            };
            polygons.push(L.polygon(latlngs, {
                color: getColour(contours[i].value), 
                weight:0.5,
                // transparent: true, 
                // setOpacity: 0.5,
                fillOpacity:0.2}));
        };
    };
    var contourLayer = L.layerGroup(polygons, {
        // transparency: true,
        // setOpacity: 0.5
    });

    // lightmap layer
    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 18,
        bounds: [[-90, -180], [90, 180]],
        noWrap: true,
        id: 'light-v10',
        accessToken: API_KEY_M
    });

    // darkmap layer
    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 18,
        bounds: [[-90, -180], [90, 180]],
        noWrap: true,
        id: 'dark-v10',
        accessToken: API_KEY_M
    });

    // basemaps object to hold all layers
    var baseMaps = {
        'Light Map': lightmap,
        'Dark Map': darkmap
    };

    // overlay object to hold data layer
    var overLay = {
        'Grid': markerLayer,
        'Contours': contourLayer
    };

    // bounding coordinates to prevent map replicating
    var southWest = L.latLng(-35, 100);
    var northEast = L.latLng(-10, 140);
    var bounds = L.latLngBounds(southWest, northEast);
    
    // leaflet map
    var myMap = L.map('map', {
        center: [-20, 125],
        zoomSnap: 0.5,
        maxBounds: bounds,
        minZoom: 5.5,
        zoom: 5.5,
        layers: [lightmap, contourLayer]
    });

    // layer control containing basemaps and overlay
    L.control.layers(baseMaps, overLay).addTo(myMap);

    // legend control
    var legend = L.control({ position: 'bottomright' });

    // legend data and format
    legend.onAdd = function () {
        
        // manipulate DOM to insert div with classes
        var div = L.DomUtil.create('div', 'info legend');
        
        // legend bands
        var limits = [5,6,7,8,9,10,11,12,13,14,15];

        // create html items in the div
        limits.forEach( (l, i) =>  { 
        div.innerHTML += '<i style=background:' + getColour(l) + '></i> ' + 
        l + 
        (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        });
        return div;
    };

    // add legend to map
    legend.addTo(myMap);

    }); 

    // function returns colour code
    function getColour(d) {
        return d >= 15 ? '#9932cc' :
            d >= 14 ? '#cb2e8f' :
            d >= 13 ? '#e03d6a' :
            d >= 12 ? '#ed5052' :
            d >= 11 ? '#f5653f' :
            d >= 10 ? '#fa7930' :
            d >= 9 ? '#fe8c22' :
            d >= 8 ? '#ffa015' :
            d >= 7 ? '#ffb307' :
            d >= 6 ? '#ffc500' :
            d >= 5 ? '#ffd700' :
                        "#90ee90";
    };
};

// function to show info when the page is loaded
function init() {
    console.log('hello init');
    
    // extract the data from json file
    d3.json((info), function(data) {
        
        // run through the data and add the information in dropdown
        d3.json((cities), function(city) {    
            // empty list of perth info
            let perth = [];
            
            // cempty list of cities; 
            var cityList = [];
            
            // loop to get info from city into the city and Perth arrays
            for (i=0; i<city.length; i++) {
                Object.entries(city[i]).forEach(([key, value]) => { 
                    // add cities to the citiesList
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
            
            // add cites list to dropdown menu & extract lat & lon
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
            
            // info date format for Perth line chart
            var month = n.getMonth() + 1;
            var dateL = '';
          
            if (month <10) {dateL = '2020-0'+ month + '-' + n.getDate() + ' 12:00:00'}
            else dateL = '2020-'+ month + '-' + n.getDate() + ' 12:00:00';

            // set date to add to placeholder in filter search
            var dateLastyear = '';
            if (month <10) {dateLastyear = '2020-0'+ month + '-' + n.getDate()}
            else dateL = '2020-'+ month + '-' + n.getDate();

            // add date into placeholder
            document.getElementById('datetime').value = dateLastyear;

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

            // extract info from openweathermap
            var weatherAPI = `${weather}lat=${lat}&lon=${lon}&units=metric&exclude=${exclude}&appid=${API_KEY_W}`

            // empty array for values
            var UVvalue = [];

            d3.json(weatherAPI, function(response) {
                response.daily.forEach(function(data){
                    UVvalue.push(data.uvi);
                });

                // create gauge chart
                let gauge = {
                    domain: {row: 0, column: 1},
                    value: UVvalue[0],
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

                Plotly.newPlot('gaugeChart', [gauge]);
            });
        });
    });
};

initMap();
// start the function to load the page
init();

// function for updating the page
function updatePage() {

    // prevent enter from refreshing the page
    d3.event.preventDefault();
    
    // extract the data from json file
    d3.json((cities), function(city) {
        
        // save the City to a variable
        let chosenCity = cityDropdown.node().value;
        
        // empty list for chosenCity info
        var chosenCityInfo = [];

        for (i=0; i<city.length; i++) {            
            Object.entries(city[i]).forEach(([key, value]) => { 
                // extract info for chosen city
                if (key === 'city' && value === chosenCity) {chosenCityInfo.push(city[i])}; 
            });
        };

        // variables for API call
        var lat = [];
        var lon = [];
        var exclude = ['minutely','hourly','alerts','current'];

        var chosenCityInfoUV = chosenCityInfo.slice(0,1);

        for (i=0; i<chosenCityInfoUV.length; i++) {
            lat.push(chosenCityInfoUV[i].latitude);
            lon.push(chosenCityInfoUV[i].longitude);
        };

        // extract date from filter search box
        // save the date to a variable
        let chosenDate = dateInput.node().value + ' 12:00:00';
        console.log('chosendate ' + chosenDate);
        
        // variables for updating bar chart
        var xValuesChosen = [];
        var yValuesChosen = [];

        // get current + 8 day array for updating plot
        var dateFound = false;
        var counter = 0;
        for (i=0; i<chosenCityInfo.length; i++) {
            
            if (chosenCityInfo[i].date == chosenDate) {
                dateFound = true;
            };
            if (dateFound && counter < 9) {
                xValuesChosen.push(chosenCityInfo[i].date.split(' ')[0]);
                yValuesChosen.push(chosenCityInfo[i].uv_index);
                counter = counter + 1;
            }
            
            if (dateFound && counter >= 9) {
                break;
            }
        };

        // update bar chart
        Plotly.restyle('graph', 'x', [xValuesChosen]);
        Plotly.restyle('graph', 'y', [yValuesChosen]);

        // extract info from openweathermap
        var weatherAPI = `${weather}lat=${lat}&lon=${lon}&units=metric&exclude=${exclude}&appid=${API_KEY_W}`
        
        // empty array for UV values
        var UVvalueChosen = [];

        d3.json(weatherAPI, function(response) {
            response.daily.forEach(function(data){
                UVvalueChosen.push(data.uvi);
            });

            Plotly.restyle('gaugeChart', 'value', [UVvalueChosen[0]]);
        });
    });
};

// when pressing submit button or press enter, use function
let submitButton = d3.select('#button');
let form = d3.select('#searchForm');
form.on('submit', updatePage);

let resetButton = d3.select('#button2');
form.on('reset', init);
