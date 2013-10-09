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
		google.load('visualization', '1.1', {packages: ['corechart', 'controls']});
		google.load('visualization', '1', {packages:['gauge']});
		google.setOnLoadCallback(drawGagueChart);
		google.setOnLoadCallback(drawVisualization);
		var direction=1;

		function drawVisualization(){
			powerControl=drawPower();
			myPriceControl=drawMyPrice();
			priceControl=drawPrice();
			tempControl=drawTemp();
			powerControl.setState(tempControl.getState());
			powerControl.draw();
			myPriceControl.setState(tempControl.getState());
			myPriceControl.draw();
			priceControl.setState(tempControl.getState());
			priceControl.draw();

			google.visualization.events.addListener(tempControl, 'statechange', function() {
					powerControl.setState(tempControl.getState());
					powerControl.draw();
					myPriceControl.setState(tempControl.getState());
					myPriceControl.draw();
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
							'hAxis': {
								'baselineColor': 'none',
								'direction': direction 
							}
						},
						'chartView': {
							'columns': [0, 1]
						},
						// 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
						'minRangeSize': 8640
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
			});

			var powerChart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'powerChart',
				'options': {
					// Use the same chart area width as the control for axis alignment.
					colors:['green'],
					title:"Energy Consumption",
					'legend': {	'position': 'none'	},
					'vAxis':{'title':'power [W]'},
					'hAxis':{
							'direction': direction 
						,	'format':'dd/MM/yy HH:mm'
					}
				},
				view:{'columns':[0,1,2] }
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
			power_data.addColumn('number','Power [W]');
			power_data.addColumn({type:'string', role:'annotation'}	);
			var temp = 1;
			var power;
			var nowIsSet=false;
			var now=new Date();
			var daysAgo= Math.floor((arrayData.length / (6*24)));
			for(var i = 0; i < arrayData.length; i++) {
				temp++
				var row = arrayData[i];
				power=getPower(row[6])
				var aDate=new Date(row[0],row[1]-1,row[2],row[3],row[4]);
				if (isNowDate(aDate,now,true)==true && nowIsSet==false){
					power_data.addRow([aDate,power,'Now']);
					nowIsSet=true;
				}else if(row[3]==0 && row[4]==0){
					if (daysAgo==0){
						power_data.addRow([aDate,power,'Today']);
					}else{
						power_data.addRow([aDate,power,daysAgo.toString() + ' Days ago']);
					}
					daysAgo--;
				}else{
					power_data.addRow([aDate,power,null]);
				}
			}

			dashboard.bind(powerControl,powerChart);
			dashboard.draw(power_data);
			return powerControl;
		}

		function drawMyPrice() {
			var dashboard = new google.visualization.Dashboard(
				document.getElementById('dashboard'));

			var myPriceControl = new google.visualization.ControlWrapper({
				'controlType': 'ChartRangeFilter',
				'containerId': 'myPriceControl',
				'options': {
					// Filter by the date axis.
					'filterColumnIndex': 0,
					'ui': {
						'chartType': 'LineChart',
						'chartOptions': {
							'hAxis': {
								'baselineColor': 'none',
								'direction': direction 
							}
						},
						'chartView': {
							'columns': [0, 1]
						},
						// 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
						'minRangeSize': 8640
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
			});

			var myPriceChart = new google.visualization.ChartWrapper({
				'chartType': 'ColumnChart',
				'containerId': 'myPriceChart',
				'options': {
					// Use the same chart area width as the control for axis alignment.
				    colors:['#CC0000'],
					title:"Cost of consumed energy",
					'legend': {	'position': 'none'	},
					'vAxis':{'title':'price [NOK]'},
					'hAxis':{
							'direction': direction 
						,	'format':'dd/MM/yy HH:mm'
					}
				},
				view:{'columns':[0,1,2] }
			});
	
			var priceArray=null
			$.ajax({
				url:'./data/price_data.csv', type:'get',async:false, success:
					function(csvString) {
						temp = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
						priceArray=temp;
					}
			});

			var powerArray=null
			$.ajax({
				url:'./data/power_data.csv', type:'get',async:false, success:
					function(csvString) {
						temp = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
						powerArray=temp;
					}
			});

			var my_price_data = new google.visualization.DataTable();
			my_price_data.addColumn('datetime','Time');
			my_price_data.addColumn('number','Cost');
			my_price_data.addColumn({type:'string', role:'annotation'}	);
			var temp = 1;
			var nowIsSet=false;
			var now=new Date();
			var daysAgo= Math.floor((priceArray.length / (24))-1);
			var hourPrice;
			var row;
			var powerArrayIndex=0;
			for(var i = 0; i < priceArray.length; i++) {
				priceRow=priceArray[i];		
				hourPrice=getHourPrice(priceRow,powerArray);	
				var aDate=new Date(priceRow[0],priceRow[1]-1,priceRow[2],priceRow[3],priceRow[4]);
				if (isNowDate(aDate,now,true)==true && nowIsSet==false){
					my_price_data.addRow([aDate,hourPrice,'Now']);
					nowIsSet=true;
				}else if(priceRow[3]==0 && priceRow[4]==0){
					if (daysAgo==0){
						my_price_data.addRow([aDate,hourPrice,'Today']);
					}else{
						my_price_data.addRow([aDate,hourPrice,daysAgo.toString() + ' Days ago']);
					}
					daysAgo--;
				}else{
					my_price_data.addRow([aDate,hourPrice,null]);
				}
			}

			dashboard.bind(myPriceControl,myPriceChart);
			dashboard.draw(my_price_data);
			return myPriceControl;
		}

		// get the energy per impulses
		function getPower(imps){
			//return imps*0.001;
			return imps*6;
		}
		
		//get the total price of consumed power for the hour specified in priceRow
		function getHourPrice(priceRow,powerArray){
			var row;
			var imps=0;
			var sameHourIndex;
			for(var i=0;i<powerArray.length;i++){
				row=powerArray[i];		
				if(row[0]==priceRow[0] && row[1]==priceRow[1] && row[2]==priceRow[2] && row[3]==priceRow[3]  ){
					sameHourIndex=i;
					break;
				}
			}	
			for(var j=sameHourIndex;j<powerArray.length;j++){
				row=powerArray[j];
				if(row[0]==priceRow[0] && row[1]==priceRow[1] && row[2]==priceRow[2] && row[3]==priceRow[3]  ){
					imps=imps+row[6];	
				}else{
					break;	
				}
			}
			imps=imps+1;
			var price=priceRow[6];
			var hourPrice=price*imps*0.001;
			hourPrice=Math.round(hourPrice*100000)/100000;
			return hourPrice;
		}
		
		// check if the datetime data is the current datetime
		function isNowDate(aDate,d,useMinutePrec){
			var year=d.getFullYear();
			var day=d.getDate();
			var month=d.getMonth();
			var hour=d.getHours();
			var min=d.getMinutes();
			if((year==aDate.getFullYear() ) && (month==aDate.getMonth()) && (day==aDate.getDate()) && (hour==aDate.getHours())){
				if(useMinutePrec==true && (aDate.getMinutes() < (min-10) || (aDate.getMinutes())>(min+10)   ) ){
					return false;
				}else{
					return true;
				}
			}else{
				return false;	
			}
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
								'baselineColor': 'none',
								'direction': direction

							}
						},
						'chartView': {
							'columns': [0, 1]
						},
						// 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
						'minRangeSize': 86400
					}
				},
			});

			var priceChart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'priceChart',
				'options': {
					'vAxis':{'title':'price [NOK]'},
					'hAxis':{
						'direction':direction,
						'format':'dd/MM/yy HH:mm'
					},
					// Use the same chart area width as the control for axis alignment.
					colors:['orange'],
					title:"Power Prices Trondheim",
					//'chartArea': { 	'height': '80%','width': '90%'},
					'legend': {	'position': 'none'	},
					view:{'columns':[0,1,2] }
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
			price_data.addColumn({type:'string', role:'annotation'}	);
			var daysAgo;
			daysAgo= Math.floor((arrayData.length / 24)-1);
			var temp = 1
			var now=new Date();
			for(var i = 0; i < arrayData.length; i++) {
				temp++
				var row = arrayData[i];
				var aDate=new Date(row[0],row[1]-1,row[2],row[3],row[4]);
				if (isNowDate(aDate,now,false)==true){
					price_data.addRow([aDate,row[6],'Now']);
				}else if( row[3]==0){
					if (daysAgo==0){
						price_data.addRow([aDate,row[6],'Today']);
					}else{
						price_data.addRow([aDate,row[6],daysAgo.toString() + ' Days ago']);
					}
					daysAgo--;
				}else{
					price_data.addRow([aDate,row[6],null]);
				}
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
			var month=d.getMonth();
			var hour=d.getHours();
			var min=d.getMinutes();
			var endDate=new Date(year,day,month,hour,min);
			var startDay=day-1;
			var startDate=new Date(year,startDay,month,hour,min);
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
								'baselineColor': 'none',
								'direction' : direction,
								'format':'dd/MM/yy HH:mm'
							}
						},
						'chartView': {
							'columns': [0, 1]
						},
						'minRangeSize': 86400
					}
				},
				// Initial range: 2012-02-09 to 2012-03-20.
				'state': {
					'range': {
				//		'start': new Date(2013,8,29,0,0,0) ,
						'end': new Date()
					}
				}
			});

			var tempChart = new google.visualization.ChartWrapper({
				'chartType': 'AreaChart',
				'containerId': 'tempChart',
				'options': {
					'vAxis':{'title':'temp [C]'},
					'hAxis':{
						'direction': direction,
						'format':'dd/MM/yy HH:mm'
					},
					// Use the same chart area width as the control for axis alignment.
					title: "Temperature Measurement, Trondheim",
					'legend': {	'position': 'none'	}
					//'chartArea': {
					//	'height': '80%',
					//	'width': '90%'
					//},
				},
				// Convert the first column from 'date' to 'string'.
				view: {'columns':[0,1,2]}	
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
			temp_data.addColumn({type:'string', role:'annotation'}	);
			var daysAgo= Math.floor((arrayData.length / 24)-1);
			var temp = 1
			var now=new Date();
			for(var i = 0; i < arrayData.length; i++) {
				temp++
				var row = arrayData[i];
				var aDate=new Date(row[0],row[1]-1,row[2],row[3],row[4]);
				if (isNowDate(aDate,now,false)==true){
					temp_data.addRow([aDate,row[6],'Now']);
				}else if( row[3]==0){
					if (daysAgo==0){
						temp_data.addRow([aDate,row[6],'Today']);
					}else{
						temp_data.addRow([aDate,row[6],daysAgo.toString() + ' Days ago']);
					}
					daysAgo--;
				}else{
					temp_data.addRow([aDate,row[6],null]);
				}
			}


			dashboard.bind(tempControl,tempChart)
			dashboard.draw(temp_data)
			return tempControl;
		}

		//draw gague for power
		function drawGagueChart() {
			$.get("./data/power_data.csv", function(csvString) {
			var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
			var row = arrayData[arrayData.length-1];
			var powerNow=(row[6])*6;
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
	<br> </br>
<div id='gagueChart' align='center'  ></div>
<div align="center">Power usage now [W]</div>

<div id="dashboard">
<div id="powerChart" style='height: 130px;' ></div>
<div id="powerControl" style="display:none"></div>
<br></br>
<div id="myPriceChart" style='height: 130px;' ></div>
<div id="myPriceControl" style="display:none"></div>
<br></br>
<div id="priceChart" style='height: 130px;'></div>
<div id="priceControl" style="display:none"></div>

<br></br>
<div id="tempChart" style='height: 130px;' ></div>
<br></br>
<div id="tempControl" style='height: 40px;'></div>
</div>
<div style='width: 500px'>
<br>
<br>
RasPi Powermeter is made with a <a href="(http://www.raspberrypi.org/"> Raspberry Pi </a> logging led impulses in my apartment's fuse box.
The powerprices and temperature is fetched from <a href="http://www.nordpoolspot.com/">nordpoolspot</a> and <a href="http://www.yr.no/sted/Norge/S%C3%B8r-Tr%C3%B8ndelag/Trondheim/V%C3%A6re/almanakk.html">yr.no</a> respectively, using a python script.
All source code can be found on my <a href="https://github.com/simena86?tab=repositories">github</a>
</div>

<div align="center">
<br>
<form action="http://simena86.github.com">
    <input type="submit" value="Back to main page">
</form>
</div>
</body>
