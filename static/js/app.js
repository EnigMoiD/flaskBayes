(function() {	
	window.d3createEuroPlot = function(pmf, svg) {
		var pmf = pmf.pmf

		window.bargraph = d3verticalBar(svg, pmf, {ydomain: [0, 1]})

		makeUpdateButton(bargraph, "heads", "HHHHHHHHHH", "/api/suite/euro")

		makeUpdateButton(bargraph, "tails", "TTTTTTTTTT", "/api/suite/euro")

		return svg
	}

	var width = 300, height = 300

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/euro", svg, d3createEuroPlot)

})()