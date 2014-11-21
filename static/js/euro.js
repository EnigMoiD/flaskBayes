(function() {	
	window.d3createEuroPlot = function(pmf, svg) {
		var pmf = pmf.pmf

		window.bargraph = d3verticalBar(svg, [pmf], {
			ydomain: [0, 1],
			title: "Coin Flip",
			colors: _(1).times(function() {return randomColor()}),
			xlabel: "Coin Balance Belief",
			ylabel: "Probability"
		})

		makeUpdateButton(bargraph, "tails", {
			data:"TTTTTTTTTT",
			display:"Tails"
		}, "/api/suite/euro", {color: randomColor({luminosity: "dark"})})
		makeUpdateButton(bargraph, "heads", {
			data:"HHHHHHHHHH",
			display:"Heads"
		}, "/api/suite/euro", {color: randomColor({luminosity: "dark"})})

		return svg
	}

	var width = 500, height = 400

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/euro", svg, d3createEuroPlot)
})()