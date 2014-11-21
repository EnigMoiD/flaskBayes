(function() {	
	window.d3createDicePlot = function(pmf, svg) {
		var pmf = pmf.pmf

		window.bargraph = d3verticalBar(svg, [pmf], {
			ydomain: [0, 1],
			title: "Rolling Dice",
			xlabel: "Believed Sides of Dice",
			ylabel: "Probability",
			colors: _(5).times(function() {return randomColor()}),
			opacities: []
		})

		for (var i = 0; i < 20; i++) {
			makeUpdateButton(bargraph, "dice num"+(i+1), {
				data:i+1,
				display:i+1
			}, "/api/suite/dice", {color: randomColor({luminosity: "dark"})})
		}

		return svg
	}

	var width = 500, height = 400

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/dice", svg, d3createDicePlot)
})()