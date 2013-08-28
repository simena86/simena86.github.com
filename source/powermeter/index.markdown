---
layout: powermeter
title: "PowerMeter"
date: 2013-04-13 12:02
comments: true
sharing: true
footer: true
---

<head>
   <title>Google Chart Example</title>
   <script src="https://www.google.com/jsapi"></script>
   <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
   <script src="jquery.csv-0.71.js"></script>
   <script>
		google.load("visualization", "1", {packages:["corechart"]});
		google.load('visualization', '1', {packages:['gauge']});
		google.setOnLoadCallback(drawPriceChart);
		google.setOnLoadCallback(drawPowerChart);
		google.setOnLoadCallback(drawGagueChart);
		google.setOnLoadCallback(drawTemperatureChart);
		
		function drawGagueChart() {
			$.get("./data/power_data.csv", function(csvString) {
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var row = arrayData[arrayData.length-1]
			var powerNow=row[5]
			var data = google.visualization.arrayToDataTable([
	          ['Label', 'Value'],
    	      ['Power',powerNow ],
        ]);
        var options = {
          width: 500, height: 130,
          minorTicks: 5
        };
        var chart = new google.visualization.Gauge(document.getElementById('gagueChart'));
        chart.draw(data, options);
		});
		}

		function drawPriceChart() {
			// grab the CSV
			$.get("./data/price_data.csv", function(csvString) {
			// transform the CSV string into a 2-dimensional array
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var data = new google.visualization.DataTable(arrayData);
			data.addColumn('datetime','Time');
			data.addColumn('number','Price [øre/kWh]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
			    var row = arrayData[i];
				data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[6]]);
			}
			console.log(temp)
			// this view can select a subset of the data at a time
			var view = new google.visualization.DataView(data);
			view.setColumns([0, 1]); 
			//var chart = new google.visualization.AnnotatedTimeLine( document.getElementById('chart'));
			//chart.draw(data,{displayAnnotations: true}  );
			var options = {
				colors: ['red'],
				title: "Power Prices, Trondheim",
				hAxis: {title: data.getColumnLabel(0), minValue: data.getColumnRange(0).min, maxValue: data.getColumnRange(0).max},
				vAxis: {title: data.getColumnLabel(1), minValue: data.getColumnRange(1).min, maxValue: data.getColumnRange(1).max},
				legend: 'none'
			};
			var chart = new google.visualization.AreaChart(document.getElementById('priceChart'));
			chart.draw(view, options);
			});
		}

		function drawPowerChart() {
			// grab the CSV
			$.get("./data/power_data.csv", function(csvString) {
			// transform the CSV string into a 2-dimensional array
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var data = new google.visualization.DataTable(arrayData);
			data.addColumn('datetime','Time');
			data.addColumn('number','Power [W]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
			    var row = arrayData[i];
				data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[5]]);
			}

			console.log(temp)
			// this view can select a subset of the data at a time
			var view = new google.visualization.DataView(data);
			view.setColumns([0, 1]); 
			//var chart = new google.visualization.AnnotatedTimeLine( document.getElementById('chart'));
			//chart.draw(data,{displayAnnotations: true}  );
			var options = {

				title: "My Power Usage",
				hAxis: {title: data.getColumnLabel(0), minValue: data.getColumnRange(0).min, maxValue: data.getColumnRange(0).max},
				vAxis: {title: data.getColumnLabel(1), minValue: data.getColumnRange(1).min, maxValue: data.getColumnRange(1).max},
				legend: 'none'
			};
			var chart = new google.visualization.AreaChart(document.getElementById('powerChart'));
			chart.draw(view, options);
			});
		}

		function drawTemperatureChart() {
			$.get("./data/temperature_data.csv", function(csvString) {
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var data = new google.visualization.DataTable(arrayData);
			data.addColumn('datetime','Time');
			data.addColumn('number','Temperature [C]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
			    var row = arrayData[i];
				data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[6]]);
			}
			console.log(temp)
			var view = new google.visualization.DataView(data);
			view.setColumns([0, 1]); 
			var options = {
				colors: ['green'],
				title: "Outside Temperature",
				hAxis: {title: data.getColumnLabel(0), minValue: data.getColumnRange(0).min, maxValue: data.getColumnRange(0).max},
				vAxis: {title: data.getColumnLabel(1), minValue: data.getColumnRange(1).min, maxValue: data.getColumnRange(1).max},
				legend: 'none'
			};
			var chart = new google.visualization.AreaChart(document.getElementById('temperatureChart'));
			chart.draw(view, options);
			});
		}

   </script>
</head>
<body>
	Site under construction
	<br> </br>
<div id='gagueChart' align='center' ></div>
<div align="center">Power usage now</div>
<div id='powerChart' style='width: 1000px; height: 260px;'></div>
<div id='priceChart' style='width: 1000px; height: 160px;'></div>
<div id='temperatureChart' style='width: 1000px; height: 160px;'></div>
</body>
