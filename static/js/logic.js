info = '"python/analysis/fcst_data.json"'

// date for header of index page
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = n.toDateString(d + m + y, { month: 'long' });

function init() {
    // extract the data from json file
    d3.json(info).then((data) => {
        // create gauge chart
        let gauge = {
            domain: {row: 0, column: 1},
            value: uv-index[0],
            title: 'UV Index TODAY',
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [1, 16]},
                bar: {color: 'darkblue'},
                steps: [
                    {range: [1, 3], color: 'yellowgreen'},
                    {range: [3, 6], color: 'gold'},
                    {range: [6, 8], color: 'orange'},
                    {range: [8, 11], color: 'lightgoldenrodyellow'},
                    {range: [11, 16], color: 'red'},
                    // {range: [5, 6], color: 'palegreen'},
                    // {range: [6, 7], color: 'palegreen'},
                    // {range: [7, 8], color: 'chartreuse'},
                    // {range: [8, 9], color: 'chartreuse'},
                ]
            }
        }
        Plotly.newPlot('gaugeChart', [gauge]);
    });
};
init();