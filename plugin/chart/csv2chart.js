/*****************************************************************
** Author: Asvin Goel, goel@telematique.eu
**
** csv2chart.js is a plugin for reveal.js allowing to integrate
** Chart.js in reveal.js
**
** Version: 0.2
** 
** License: MIT license (see LICENSE.md)
**
******************************************************************/

var RevealChart = window.RevealChart || (function(){
	function parseJSON(str) {
	    var json;
	    try {
        	json = JSON.parse(str);
	    } catch (e) {
        	return null;
    		}
            return json;
	}

	/*
	* Recursively merge properties of two objects 
	*/
	function mergeRecursive(obj1, obj2) {

	  for (var p in obj2) {
	    try {
	      // Property in destination object set; update its value.
	      if ( obj1[p].constructor==Object && obj2[p].constructor==Object ) {
	        obj1[p] = mergeRecursive(obj1[p], obj2[p]);
	
	      } else {
	        obj1[p] = obj2[p];
	
	      }
	
	    } catch(e) {
	      // Property in destination object not set; create it and set its value.
	      obj1[p] = obj2[p];
	
	    }
	  }
	
	  return obj1;
	}


	function createChart(canvas, CSV, comments) {
		canvas.chart = null;
		var ctx = canvas.getContext("2d");
		var chartOptions = { responsive: true };
		var chartData = { labels: null, datasets: []};
		if ( comments !== null ) for (var j = 0; j < comments.length; j++ ){
			comments[j] = comments[j].replace(/<!--/,'');
			comments[j] = comments[j].replace(/-->/,'');
			var config = parseJSON(comments[j]);
			if ( config ) {
				if ( config.data ) {
					mergeRecursive( chartData, config.data);
				}
				if ( config.options ) {
					mergeRecursive( chartOptions, config.options);
				}
			}
		}
		
		var lines = CSV.split('\n').filter(function(v){return v!==''});
		// if labels are not defined, get them from first line
		if ( chartData.labels === null && lines.length > 0 ) {
			chartData.labels = lines[0].split(',');
			chartData.labels.shift();
			lines.shift();
		} 
		// get data values
		for (var j = 0; j < lines.length; j++ ){
			if (chartData.datasets.length <= j) chartData.datasets[j] = {};
			chartData.datasets[j].data =  lines[j].split(','); //.filter(function(v){return v!==''});
			chartData.datasets[j].label = chartData.datasets[j].data[0];
			chartData.datasets[j].data.shift();
			for (var k = 0; k < chartData.datasets[j].data.length; k++ ){
				chartData.datasets[j].data[k] = Number(chartData.datasets[j].data[k]);
			}
		}

		// add chart options
		var config = chartConfig[canvas.getAttribute("data-chart")];
		if ( config ) {
			for (var j = 0; j < chartData.datasets.length; j++ ){
				for (var attrname in config) {
					if ( !chartData.datasets[j][attrname]  ) {
						chartData.datasets[j][attrname] = config[attrname][j%config[attrname].length];  
					}
				}
			}
		}		

		canvas.chart = new Chart(ctx, { type: canvas.getAttribute("data-chart"), data: chartData, options: chartOptions }); 

	}

	var initializeCharts = function(){
		// Get all canvases
		var canvases = document.querySelectorAll("canvas");
		for (var i = 0; i < canvases.length; i++ ){
			// check if canvas has data-chart attribute
			if ( canvases[i].hasAttribute("data-chart") ){
				var CSV = canvases[i].innerHTML.trim();
				var comments = CSV.match(/<!--[\s\S]*?-->/g);
				CSV = CSV.replace(/<!--[\s\S]*?-->/g,'').replace(/^\s*\n/gm, "") 
				if ( ! canvases[i].hasAttribute("data-chart-src") ) {
					createChart(canvases[i], CSV, comments);
				}
				else {
					var canvas = canvases[i];
					var xhr = new XMLHttpRequest();
					xhr.onload = function() {
						if (xhr.readyState === 4) {
							createChart(canvas, xhr.responseText, comments);
						}
						else {
							console.warn( 'Failed to get file ' + canvas.getAttribute("data-chart-src") +". ReadyState: " + xhr.readyState + ", Status: " + xhr.status);
						}
					};

					xhr.open( 'GET', canvas.getAttribute("data-chart-src"), false );
					try {
						xhr.send();
					}
					catch ( error ) {
						console.warn( 'Failed to get file ' + canvas.getAttribute("data-chart-src") + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + error );
					}
				}

			} 
		}
	}

	function recreateChart(canvas) {
		var config = canvas.chart.config;
		canvas.chart.destroy();
		setTimeout( function() { canvas.chart = new Chart(canvas, config); }, 500); // wait for slide transition
	}

	// check if chart option is given or not
	var chartConfig = Reveal.getConfig().chart || {};

	// set global chart options
	var config = chartConfig["defaults"];
	if ( config ) {
		mergeRecursive(Chart.defaults, config);
	}		

	Reveal.addEventListener('ready', function(){
		initializeCharts();
		Reveal.addEventListener('slidechanged', function(){
			var canvases = Reveal.getCurrentSlide().querySelectorAll("canvas[data-chart]");
			for (var i = 0; i < canvases.length; i++ ){
				if ( canvases[i].chart && canvases[i].chart.config.options.animation ) { 
					recreateChart( canvases[i] );
				}
			}
		
		});
	});
})();
