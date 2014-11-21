(function() {	
	window.d3createBanditPlot = function(pmfs, svg) {
		var pmfarray = pmfs.pmfs

		window.bargraph = d3verticalBar(svg, pmfarray, {
			ydomain: [0, 1],
			title: "Multi-Armed Bandit",
			xlabel: "Bandit",
			ylabel: "Probability",
			color: "rgb(80, 160, 255)",
			opacity: 0.6,
			colors: _(10).times(function() {return randomColor()}),
			opacities: []
		})

		for (var i = 0; i < 10; i++) {
			makeUpdateButton(bargraph, "num"+i+" hidden", {
				data:pmfs.probs[i],
				display:""
			}, "/api/suite/bandit", {
				data: pmfs.probs,
				multipmfs: true,
				index: i
			})
		}

		var getMeans = function(bandits) {
			$.ajax("/api/suite/means", {
				data: JSON.stringify({
					pmfs: bandits
				}),
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				success: function(means) {
					means = means.means
					var bestBanditIndex = _.indexOf(means, _.max(means))
					var bestBandit = bandits[bestBanditIndex]
					updateSuite(bargraph, {
						data: bestBandit,
						index: bestBanditIndex
					}, pmfs.probs[bestBanditIndex], "/api/suite/bandit")
				}
			})
		}

		setInterval(function() {
			getMeans(pmfarray)
		}, 500)

		return svg
	}

	var width = 500, height = 400

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/suite/bandit", svg, d3createBanditPlot)

})()