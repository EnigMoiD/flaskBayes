(function() {	
	window.d3createBanditPlot = function(pmfs, svg) {
		var pmfarray = pmfs.pmfs

		window.bargraph = d3verticalBar(svg, pmfarray, {
			ydomain: [0, .1],
			xlabel: "Bandit",
			ylabel: "Probability",
			colors: [
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255",
				"rgb(80, 160, 255"
			],
			opacities: [
				0.2,
				0.2,
				0.2,
				0.2,
				0.2,
				0.2,
				0.2,
				0.2,
				0.2,
				0.2
			]
		})

		for (var i = 0; i < 10; i++) {
			makeUpdateButton(bargraph, "num"+i, i, "/api/suite/bandit", {data: pmfs.probs, multipmfs: true})
		}

		return svg
	}

	var width = 300, height = 300

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/bandit", svg, d3createBanditPlot)
})()