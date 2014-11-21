(function() {	
	window.d3createDicePlot = function(pmf, svg) {
		var pmf = pmf.pmf

		window.bargraph = d3verticalBar(svg, [pmf], {
			ydomain: [0, 1],
			title: "Rolling Dice",
			xlabel: "Believed Sides of Dice",
			ylabel: "Probability"
		})

		for (var i = 0; i < 20; i++) {
			makeUpdateButton(bargraph, "num"+(i+1), i+1, "/api/suite/dice", {})
		}

		return svg
	}

	var width = 300, height = 300

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/dice", svg, d3createDicePlot)

})()