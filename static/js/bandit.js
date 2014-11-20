(function() {	
	window.d3createBanditPlot = function(pmfs, svg) {
		var pmfarray = pmfs.pmfs

		window.bargraph = d3verticalBar(svg, pmfarray, {
			ydomain: [0, 1],
			xlabel: "Bandit",
			ylabel: "Probability",
			color: "rgb(80, 160, 255)",
			opacity: 0.4,
			colors: [],
			opacities: []
		})

		for (var i = 0; i < 10; i++) {
			makeUpdateButton(bargraph, "num"+i, pmfs.probs[i], "/api/suite/bandit", {
				data: pmfs.probs,
				multipmfs: true,
				index: i
			})
		}

		return svg
	}

	var width = 500, height = 400

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/bandit", svg, d3createBanditPlot)
})()