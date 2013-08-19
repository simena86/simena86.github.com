google.load('visualization', '1', {'packages':['corechart']});

$(document).ready(function() {    
$("#btn").click(function() {
$("#chart_div").load("", function(){
var data = google.visualization.arrayToDataTable([
           ['', 'Your Restaurant', 'Other Restaurants'],
           ['Question1',  5, 4],
           ['Question2',  4, 5],
           ['Question3',  3, 2],
           ['Question4',  5, 1]
           ]);

var options = {
    title: 'Company Performance',
    hAxis: {title: 'Questions', titleTextStyle: {color: 'red'}},
    vAxis: {title: '1 = POOR, 5 = EXCELLENT', titleTextStyle: {color: '#FF0000'}, maxValue:'5', minValue:'1'},
    tooltip: {trigger: 'hover'}};

var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
chart.draw(data, options);
});
});
});
