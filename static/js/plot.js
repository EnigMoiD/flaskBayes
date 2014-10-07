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

	var dictFromArrays = function(array) {
		dict = {}

		for (var i in array) {
			dict[array[i][0]] = array[i][1]
		}

		return dict
	}

	var d3updateSuitePlot = function(svg, pmf) {
		var pmf = pmf.pmf

		svg.y = d3.scale.linear()
		.domain([0, _.max(pmf, function(d){return d[1]})[1]])
		.range([height, 0])

		svg.selectAll("rect")
		.data(pmf)
		.transition()
		.attr("y", function(d) {
			return svg.y(d[1])
		})
		.attr("height", function(d) {
			return height - svg.y(d[1])
		})

		d3.select(".heads")
		.on("click", function() {
			var data = d3.select(this).attr("data")

			updateSuite(pmf, data)
		})

		d3.select(".tails")
		.on("click", function() {
			var data = d3.select(this).attr("data")

			updateSuite(pmf, data)
		})
	}

	var d3createSuitePlot = function(pmf) {
		var pmf = pmf.pmf

		svg.x = d3.scale.linear()
		.domain([0, pmf.length])
		.range([0, width])

		svg.y = d3.scale.linear()
		.domain([0, _.max(pmf, function(d){return d[1]})[1]])
		.range([height, 0])

		svg.selectAll("rect")
		.data(pmf)
		.enter().append("rect")
		.attr("x", function(d, i) {
			return svg.x(i)
		})
		.attr("y", function(d) {
			return svg.y(d[1])
		})
		.attr("height", function(d) {
			return height - svg.y(d[1])
		})
		.attr("width", width/pmf.length)
		.attr("class", "bar")
		.attr("data", "H")

		d3.select("body").append("div")
		.attr("class", "button heads")
		.attr("data", "H")
		.on("click", function() {
			var data = d3.select(this).attr("data")

			updateSuite(pmf, data)
		})

		d3.select("body").append("div")
		.attr("class", "button tails")
		.attr("data", "T")
		.on("click", function() {
			var data = d3.select(this).attr("data")

			updateSuite(pmf, data)
		})

		return svg
	}

	var updateSuite = function(pmf, data) {
		$.ajax("/api/pmf", {
			data: JSON.stringify({
				pmf : pmf,
				update: data
			}),
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			success: function(pmf) {
				d3updateSuitePlot(svg, pmf)
			}
		})
	}

	var d3getSuite = function(jsonUrl, callback) {
		d3.json(jsonUrl, callback)
	}

	var width = 300, height = 300

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3getSuite("/api/pmf", d3createSuitePlot)
})()