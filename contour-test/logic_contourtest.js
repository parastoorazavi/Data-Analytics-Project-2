// usgs endpoint - earthquakes last 30 days
var gridData = 'hstr_data_grid.csv'

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

  // Converts from grid coordinates (indexes) to leaflet coordinates (long, lat).
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
        polygons.push(L.polygon(latlngs, {color:getColour(contours[i].value), weight:0.5, fillOpacity:0.1}));
    };
  };
  var contourLayer = L.layerGroup(polygons);

  // lightmap layer
  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
    maxZoom: 18,
    bounds: [[-90, -180], [90, 180]],
    noWrap: true,
    id: 'light-v10',
    accessToken: API_KEY
  });

  // darkmap layer
  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
    maxZoom: 18,
    bounds: [[-90, -180], [90, 180]],
    noWrap: true,
    id: 'dark-v10',
    accessToken: API_KEY
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
    maxBounds: bounds,
    minZoom: 5,
    zoom: 5,
    layers: [lightmap, contourLayer, markerLayer]
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

