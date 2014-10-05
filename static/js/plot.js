(function() {
	var svgTranslate = function(left, top) {
		return "translate(" + left + "," + top + ")"
	}

	var svgAppendCircle = function(svg, r, x, y) {
		return svg.append("circle")
		.attr("r", r)
		.attr("cx", x)
		.attr("cy", y)
	}

	var width = 300, height = 300

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	// Plot a Pmf
	d3.json("http://localhost:5000/api/pmf", function(pmf) {
		var out = pmf.outcomes
		var p = pmf.probabilities

		var x = d3.scale.linear()
		.domain([0, d3.max(out)])
		.range([0, width])

		var y = d3.scale.linear()
		.domain([0, d3.max(p)])
		.range([height, 0])

		svg.selectAll("rect")
		.data(p)
		.enter().append("rect")
		.attr("x", function(d, i) {
			return x(i)
		})
		.attr("y", function(d) {
			return y(d)
		})
		.attr("height", function(d) {
			return height - y(d)
		})
		.attr("width", width/out.length-3)
	})
})()