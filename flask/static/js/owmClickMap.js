
                                    var myMap = L.map('map', {
                                    center: [-27.833, 133.583],
                                    zoom: 5
                                    // zoomControl: false,
                                    });


                                    //BASEMAPS
                                    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                                    {
                                    attribution: '&copy; <a href="http://osm.org/copyright" target = "_blank">OpenStreetMap</a> contributors'
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
                                        url: "https://api.openweathermap.org/data/2.5/weather?lat=" + e.latlng.lat + '&lon=' + e.latlng.lng + "&appid=b80fd2ed7964ad60c921362b393b0613",
                                        dataType: 'json',
                                        success: function(data) {
                                        // storing json data in variables
                                        weatherlocation_lon = data.coord.lon; // lon WGS84
                                        weatherlocation_lat = data.coord.lat; // lat WGS84
                                        weatherstationname = data.name // Name of Weatherstation
                                        weatherstationid = data.id // ID of Weatherstation
                                        weathertime = data.dt // Time of weatherdata (UTC)
                                        temperature = data.main.temp; // Kelvin
                                        airpressure = data.main.pressure; // hPa
                                        airhumidity = data.main.humidity; // %
                                        temperature_min = data.main.temp_min; // Kelvin
                                        temperature_max = data.main.temp_max; // Kelvin
                                        windspeed = data.wind.speed; // Meter per second
                                        winddirection = data.wind.deg; // Wind from direction x degree from north
                                        cloudcoverage = data.clouds.all; // Cloudcoverage in %
                                        weatherconditionid = data.weather[0].id // ID
                                        weatherconditionstring = data.weather[0].main // Weatheartype
                                        weatherconditiondescription = data.weather[0].description // Weatherdescription
                                        weatherconditionicon = data.weather[0].icon // ID of weathericon

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
                                        var weathercondtioniconhtml = "http://openweathermap.org/img/w/" + weatherconditionicon + ".png";
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
                                            popup.setContent("Weatherdata:<br>" + "<img src=" + weathercondtioniconhtml + "><br>" + weatherconditionstring + " (Weather-ID: " + weatherconditionid + "): " + weatherconditiondescription + "<br><br>Temperature: " + temperaturecelsius + "°C<br>Airpressure: " + airpressure + " hPa<br>Humidityt: " + airhumidity + "%" + "<br>Cloudcoverage: " + cloudcoverage + "%<br><br>Windspeed: " + windspeedkmh + " km/h<br>Wind from direction: " + winddirectionstring + " (" + winddirection + "°)" + "<br><br><font size=" + fontsizesmall + ">Datasource:<br>openweathermap.org<br>Measure time: " + weathertimenormal + "<br>Weatherstation: " + weatherstationname + "<br>Weatherstation-ID: " + weatherstationid + "<br>Weatherstation Coordinates: " + weatherlocation_lon + ", " + weatherlocation_lat);           
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


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Margin Convention - Used to display the svg in the desired location on the page
var margin = {top: 50, right: 100, bottom: 50, left: 100},
width = 900 - margin.left - margin.right, // Can use the window's width instead of hardcoding
height = 500  - margin.top - margin.bottom // Can use the window's width instead of hardcoding
;

//Moving SVG to avoid cut-off from the page ends calculated based on the width and height calculated above
const plotObj = d3.select('#linegraph')
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom);
//Transform is a css property that changes the position of the DOM element, translate(x,y) changes it based on the values passed in the x,y vars of the function
const group = plotObj.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip and provide a textDiv to show the content of the tooltip
var div = d3.select("body").append("div")	
            .attr("class", "tip"); //Used for styling the tooltip container div
var textDiv = div.append('div').attr('class','textdiv');

//data-handlers
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'];//array of day strings
const xFormat = d => days[d];//get the string based on the value
var metric = "Celsius";//Default scale of measurement

const callbackFn = data =>{
    //data clean up
    //Data gives a JSON of 3-hr measurement of temperature per day for five days
    const cityInfo = data.city; //Choose the city from the data
    var fcast = []; //Array to hold cleaned up data
    var arr = [data.list.slice(0,6),data.list.slice(6,14),data.list.slice(14,22),data.list.slice(22,30),data.list.slice(30,38)]; //Group data by days
    var d = new Date(); //For calculating the date as a day string
    var i =0; //Pointer variable for convenience
    //Iterate throught the data and calculate average sum and humidity
    arr.forEach(function (day){
        var sum = 0,
        hum = 0;
        day.forEach(function(hr){
            sum += hr.main.temp;
            hum += hr.main.humidity;
        });
        //Convert day to a day string for x axis,  yaxis temperature
        fcast.push({x:days[(d.getDay()+i) % 7],y:Math.ceil(sum/day.length),
        desc: day[0].weather[0].description.toUpperCase() , //Description of weather
        hum: Math.ceil(hum/day.length) //Humdity component
        });
        i++;
    });
    document.getElementById("cityName").innerHTML ="5 Day Weather Forecast for " + cityInfo.name;
    //Setting Page Header based on city, can be changed dynamically if the API Call is made dynamic with Latitude and Longitude coordinates
    //Scale and Axis creation
    const xScale = d3.scalePoint()//Converts to specific Ordinal based scaling
      .domain(fcast.map(d => d.x)) //Maps the x value of the data object from the data array
      .range([0, width]); //Converts into a range from 0 - width of svg ( range is a function of domain)
    const yScale = d3.scaleLinear()
        .domain(d3.extent(fcast,d => d.y))//gets the min and max as a array from the dataset for the value in the second arg
        .range([height,0]).nice(); //Nice gives a rounded value for the domain
    const yNorm = d3.scaleLinear()
        .domain(d3.extent(fcast,d => d.y)).range([1,0]); //Normalizing the temperature value to be used in D3 schemeChromatic, 5 day high = 1, 5 day low = 0
        //Converting the humidity to a range for the radius of the point
    const humSort = fcast.map(d => d.hum).sort(); //Sorting the array from low to high
    const radius = d => { const i = humSort.indexOf(d.hum);
                          return i == -1 ? 1 : i+4; //scaling each point in sorted order to an increasing radius
                        };
    
    //Group For Axis
    const xAxisGroup = group.append('g');
    const yAxisGroup = group.append('g');

    const xAxis = d3.axisBottom().scale(xScale)
            .tickPadding(10).tickSize(-height); //tickPadding is to pad the labels to be not close to the graph. ticksize  in negative draws the line inside the graph
    const yAxis = d3.axisLeft().scale(yScale).ticks(4)
            .tickPadding(10).tickSize(-width);
    
    //Plotting the line graph with a smooth function in curving Monotonically along x axis and not the y axis
    var line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX)
    
    //Define an svg element to hold the line generated previously
    var path = group.append("path")
    .datum(fcast) 
    .attr("class", "line")  //css class
    .attr("d", line); 
    
    //Gets the length of the path object
    var pathLength = path.node().getTotalLength();
    
    //Assigns a transition to create a stroke segment as the length of the path
    path.attr("stroke-dasharray", pathLength + " " + pathLength)//sets the dash array to the length of the path
        .attr("stroke-dashoffset", pathLength)//moves the line by its length, makes it disappear from the screen
        .transition().duration(3000)//in a duration in the argument it reduces the offset to 0 giving the appearance of a growing line
        .attr("stroke-dashoffset", 0);

    //Appends a circle for each datapoint 
    group.selectAll(".dot")
        .data(fcast)
          .enter().append("circle")
        .attr("class", "dot") //css class
        .attr("cx", d => xScale(d.x)) //x coord
        .attr("cy", d => yScale(d.y)) //y coord
        .attr("r", d => radius(d)) //normalized radius
        .attr('fill', d => d3.interpolateRdYlBu(yNorm(d.y))) //changing the color of the circle by temperature high and low for 5 days
        //Tooltip manipulation
        .on('mouseover', function(d){ //identify the current element hovered on
                            d3.select(this)
                            .transition().duration(700) //smooth css transition property for 500ms
                            .attr('r',radius(d) * 1.5);//rescale the point
                            div.transition().duration(500)//transition for the tooltip to give running effect
                            .attr('class','tipshow')//add css class to show the tooltip
                            .style('left',(d3.event.pageX+5)+"px")//positon the tooltip on the x coord of the mouse event
                            .style('top',(d3.event.pageY+5)+"px");//positon the tooltip on the y coord of the mouse event
                            textDiv.transition().duration(700)//transition for changing the text
                            .text( d.desc+ " with "+d.hum+"% humidity");//adding the new additional info for the point
                            
                        })
        .on('mouseout', function(d){ //When mouse leaves the point reset it to the original state
                            d3.select(this)
                            .transition().duration(700)
                            .attr('r',radius(d)); //rescale to original size
                        });
        
    //Positioning the x axis below the svg using the height of the svg defined above
    xAxisGroup.attr("transform", "translate(0," + height + ")").call(xAxis);
    yAxisGroup.call(yAxis); //call is a function that internally calls the yAxis function on the yAxisGroup element
    
    // now add titles to the axes
    group.append("text")//Append a text element
        .attr('class','axeslabel')
        .attr("text-anchor", "middle") //Position along the center of the axis
        .attr("transform", "translate("+ (-45) +","+(height/2)+")rotate(-90)") //to ensure that it can be read vertically
        .text("Temperature("+metric+")");//Text to display for the label

    group.append("text")
        .attr('class','axeslabel')
        .attr("text-anchor", "middle") 
        .attr("transform", "translate("+ (width/2) +","+(height-(-45))+")")  // centre below axis and not on the line
        .text("Days");

};

//Starter function
visualize('metric');
//call to receive data
function visualize(units){
     d3.json("https://api.openweathermap.org/data/2.5/weather?lat=" + e.latlng.lat + '&lon=' + e.latlng.lng + "&units=" + units + "&appid=b80fd2ed7964ad60c921362b393b0613",callbackFn)
}

//Toggle the scale from Celsius to fahrenheit
// d3.select('#button').on('click', function(){ 
//     group.selectAll("*").remove(); //clean the svg
//     if(d3.select(this).attr('current_type') === 'c'){ //Check the current status to toggle
//         d3.select(this).attr('current_type','f').text('Show in Celsius'); //change the button text to display
//         metric = 'Fahrenheit'; //change the metric to be displayed
//         visualize('imperial');//get new dadta and replot
//     }
//     else{
//     d3.select(this).attr('current_type','c').text('Show in Fahrenheit');
//         metric = 'Celsius'; 
//         visualize('metric');
//         }
// });