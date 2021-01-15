// variable to store todays UV value
var info = 'static/python/analysis/fcst_data.json';

d3.json((info) => {
    let uvToday = info[0].uv-value[0];
    return uvToday;
});