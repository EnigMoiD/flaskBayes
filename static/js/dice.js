(function() {	
	window.d3createDicePlot = function(pmf, svg) {
		var pmf = pmf.pmf

		window.bargraph = d3verticalBar(svg, pmf, {
			ydomain: [0, 1],
			xlabel: "Expected Sides of Die",
			ylabel: "Probability"
		})

		makeUpdateButton(bargraph, "four", 4, "/api/suite/dice")
		makeUpdateButton(bargraph, "six", 6, "/api/suite/dice")
		makeUpdateButton(bargraph, "eight", 8, "/api/suite/dice")
		makeUpdateButton(bargraph, "twelve", 12, "/api/suite/dice")
		makeUpdateButton(bargraph, "twenty", 20, "/api/suite/dice")

		return svg
	}

	var width = 300, height = 300

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/dice", svg, d3createDicePlot)

})()