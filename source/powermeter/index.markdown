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
		//google.load("visualization", "1", {packages:["corechart"]});
		google.load('visualization', '1', {packages:['gauge']});
		google.setOnLoadCallback(drawGagueChart);
		google.setOnLoadCallback(drawVisualization);

		function drawVisualization(){
			powerControl=drawPower();
			priceControl=drawPrice();
			tempControl=drawTemp();

			google.visualization.events.addListener(tempControl, 'statechange', function() {
					powerControl.setState(tempControl.getState());
					powerControl.draw();
					priceControl.setState(tempControl.getState());
					priceControl.draw();
			});
		}
		
		function drawPower() {
			var dashboard = new google.visualization.Dashboard(
				document.getElementById('dashboard'));

			var powerControl = new google.visualization.ControlWrapper({
				'controlType': 'ChartRangeFilter',
				'containerId': 'powerControl',
				'options': {
					// Filter by the date axis.
					'filterColumnIndex': 0,
					'ui': {
						'chartType': 'LineChart',
						'chartOptions': {
						//	'chartArea': {
						//		'width': '90%'
						//	},
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
						'minRangeSize': 8640
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
				'state': {
					'range': {
						'start': new Date(2013, 8, 22,0),
						'end': new Date(2013, 8, 22,23)
					}
				}
			});

			var powerChart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'powerChart',
				'options': {
					// Use the same chart area width as the control for axis alignment.
					colors:['green'],
					title:"Power Consumption",
					'legend': {	'position': 'none'	}
				},
				view:{'columns':[0,1] }
			});
	
			var arrayData=null
			$.ajax({
				url:'./data/power_data.csv', type:'get',async:false, success:
					function(csvString) {
						temp = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
						arrayData=temp;
					}
			});

			var power_data = new google.visualization.DataTable();
			power_data.addColumn('datetime','Time');
			power_data.addColumn('number','Power [W]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
				var row = arrayData[i];
				power_data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[6]]);
			}

			dashboard.bind(powerControl,powerChart)
			dashboard.draw(power_data)
			return powerControl;
		}
		

		// price data
		function drawPrice() {
			var dashboard = new google.visualization.Dashboard(
				document.getElementById('dashboard'));

			var priceControl = new google.visualization.ControlWrapper({
				'controlType': 'ChartRangeFilter',
				'containerId': 'priceControl',
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
						'minRangeSize': 86400
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
				'state': {
					'range': {
						'start': new Date(2013, 8, 22,0),
						'end': new Date(2013, 8, 22,23)
					}
				}
			});

			var priceChart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'priceChart',
				'options': {
					// Use the same chart area width as the control for axis alignment.
					colors:['orange'],
					title:"Power Prices Trondheim",
					//'chartArea': { 	'height': '80%','width': '90%'},
					'legend': {	'position': 'none'	},
					view:{'columns':[0,1] }
				}
			});
	
			var arrayData=null
			$.ajax({
				url:'./data/price_data.csv', type:'get',async:false, success:
					function(csvString) {
						temp = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
						arrayData=temp;
					}
			});

			var price_data = new google.visualization.DataTable();
			price_data.addColumn('datetime','Time');
			price_data.addColumn('number','Price [øre/KWh]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
				var row = arrayData[i];
				price_data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[6]]);
			}

			dashboard.bind(priceControl,priceChart)
			dashboard.draw(price_data)
			return priceControl;
		}


		// temp data
		function drawTemp() {
			var dashboard = new google.visualization.Dashboard(
				document.getElementById('dashboard'));
			var d=new Date();
			var year=d.getFullYear();
			var day=d.getDate();
			var month=d.getMonth()+1;
			var hour=d.getHours();
			var min=d.getMinutes();
			var tempControl = new google.visualization.ControlWrapper({
				'controlType': 'ChartRangeFilter',
				'containerId': 'tempControl',
				'options': {
					// Filter by the date axis.
					'filterColumnIndex': 0,
					'ui': {
						'chartType': 'LineChart',
						'chartOptions': {
						//	'chartArea': {
						//		'width': '90%'
						//	},
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
						'minRangeSize': 86400
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
				'state': {
					'range': {
						'start': new Date(2013, 8, 22,0),
						'end': new Date(year,month,day,hour,min)
					}
				}
			});

			var tempChart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'tempChart',
				'options': {
					// Use the same chart area width as the control for axis alignment.
					title: "Temperature Measurement, Trondheim",
					'legend': {	'position': 'none'	}
					//'chartArea': {
					//	'height': '80%',
					//	'width': '90%'
					//},
				},
				// Convert the first column from 'date' to 'string'.
				view: {'columns':[0,1]}	
			});
	
			var arrayData=null
			$.ajax({
				url:'./data/temperature_data.csv', type:'get',async:false, success:
					function(csvString) {
						temp = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
						arrayData=temp;
					}
			});

			var temp_data = new google.visualization.DataTable();
			temp_data.addColumn('datetime','Time');
			temp_data.addColumn('number','Temperature [C]')
			var temp = 1
			for(var i = 0; i < arrayData.length; i++) {
				temp++
				var row = arrayData[i];
				temp_data.addRow([new Date(row[0],row[1],row[2],row[3],row[4]),row[6]]);
			}

			dashboard.bind(tempControl,tempChart)
			dashboard.draw(temp_data)
			return tempControl;
		}

		//draw gague for power
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
          width: 500, height: 99,
          minorTicks: 5
        };
        var chart = new google.visualization.Gauge(document.getElementById('gagueChart'));
        chart.draw(data, options);
		});
		}

   </script>
</head>
<body>
	Site under construction
	<br> </br>
<div id='gagueChart' align='center'  ></div>
<div align="center">Power usage now</div>

<div id="dashboard">
<div id="powerChart" style='height: 110px;' ></div>
<div id="powerControl" style="display:none"></div>
<br></br>
<div id="priceChart" style='height: 110px;'></div>
<div id="priceControl" style="display:none"></div>

<br></br>
<div id="tempChart" style='height: 110px;' ></div>
<br></br>
<div id="tempControl" style='height: 40px;'></div>

</div>

</body>
