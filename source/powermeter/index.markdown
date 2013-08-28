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
   		// load the visualization library from Google and set a listener
		//	google.load("visualization", "1", {packages: ['annotatedtimeline']});
		//google.load("visualization", "1", {packages:["corechart"]});
		google.load('visualization', '1.1', {packages: ['corechart', 'controls']});
		google.load('visualization', '1', {packages:['gauge']});
		google.setOnLoadCallback(drawPriceChart);
		google.setOnLoadCallback(drawPowerChart);
		google.setOnLoadCallback(drawGagueChart);
		google.setOnLoadCallback(drawPrice);
		
		function drawPrice() {
			var dashboard = new google.visualization.Dashboard(
				document.getElementById('dashboard'));

			var control = new google.visualization.ControlWrapper({
				'controlType': 'ChartRangeFilter',
				'containerId': 'control',
				'options': {
					// Filter by the date axis.
					'filterColumnIndex': 0,
					'ui': {
						'chartType': 'LineChart',
						'chartOptions': {
							'chartArea': {
								'width': '90%'
							},
							'hAxis': {
								'baselineColor': 'none'
							}
						},
						// Display a single series that shows the closing value of the stock.
						// Thus, this view has two columns: the date (axis) and the stock value (line series).
						'chartView': {
							'columns': [0, 1]
						},
						// 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
						'minRangeSize': 86400000
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
				'state': {
					'range': {
						'start': new Date(2013, 8, 9),
						'end': new Date(2013, 8, 11)
					}
				}
			});

			var chart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'chart',
				'options': {
					// Use the same chart area width as the control for axis alignment.
					'chartArea': {
						'height': '80%',
						'width': '90%'
					},
					'hAxis': {
						'slantedText': false
					},
					'vAxis': {
						'viewWindow': {
							'min': 0,
							'max': 200
						}
					},
					'legend': {
						'position': 'none'
					}
				},
				// Convert the first column from 'date' to 'string'.
				'view': {
					'columns': [{
							'calc': function (dataTable, rowIndex) {
								return dataTable.getFormattedValue(rowIndex, 0);
							},
							'type': 'string'
						},
						1
					]
				}
			});


			$.get("./data/price_data.csv", function(csvString) {
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var data = new google.visualization.DataTable(arrayData);
			data.addColumn('datetime','Time');
			data.addColumn('number','Price [øre/kWh]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
			    var row = arrayData[i];
				data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[5]]);
			}


			dashboard.bind(control, chart);
			dashboard.draw(data);
			});
		}
		
		
		


		function drawGagueChart() {
			// grab the CSV
			$.get("./data/power_data.csv", function(csvString) {
			// transform the CSV string into a 2-dimensional array
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var row = arrayData[arrayData.length-1]
			var powerNow=row[5]
			var data = google.visualization.arrayToDataTable([
	          ['Label', 'Value'],
    	      ['Power',powerNow ],

        ]);

        var options = {
          width: 500, height: 130,
         // redFrom: 0, redTo: 5000,
         // yellowFrom:75, yellowTo: 90,
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
				data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[5]]);
			}

			console.log(temp)
			// this view can select a subset of the data at a time
			var view = new google.visualization.DataView(data);
			view.setColumns([0, 1]); 
			//var chart = new google.visualization.AnnotatedTimeLine( document.getElementById('chart'));
			//chart.draw(data,{displayAnnotations: true}  );
			var options = {
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

   </script>
</head>
<body>
	Site under construction
	<br> </br>
<div id='gagueChart' align='center' ></div>
<div align="center">Power usage now</div>
<div id='powerChart' style='width: 1000px; height: 220px;'></div>
<div id='priceChart' style='width: 1000px; height: 220px;'></div>
<div id="dashboard">
<div id="chart" style='width: 915px; height: 300px;'></div>
<div id="control" style='width: 915px; height: 50px;'></div>
</div>

</body>
