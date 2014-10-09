(function() {
	var svgTranslate = function(left, top) {
		return "translate(" + left + "," + top + ")"
	}

	var d3verticalBar = function(svg, data, options) {
		// assumes linear scale, graph data is
		// {x:"", y:""}
		// this returns a graph object
		// options can contain things like scale, style
		// attributes of the plot

		var graph = this

		graph.scale = {}

		graph.data = data
		graph.svg = svg
		graph.width = parseInt(svg.style("width"))
		graph.height = parseInt(svg.style("height"))

		graph.scale.x = d3.scale.linear()
		.domain([_.min(data.x), _.max(data.x)])
		.range([0, graph.width])

		graph.scale.y = d3.scale.linear()
		.domain([0, _.max(data.y)])
		.range([graph.height, 0])

		// actually do the plotting

		graph.svg.selectAll("rect")
		.data(graph.data.y)
		.enter().append("rect")
		.attr("x", function(d, i) {
			return graph.scale.x(i)
		})
		.attr("y", function(d) {
			return graph.scale.y(d)
		})
		.attr("height", function(d) {
			return graph.height - graph.scale.y(d)
		})
		.attr("width", graph.width/graph.data.y.length)
		.attr("class", "bar")

		graph.update = function(data) {
			graph.scale.y = d3.scale.linear()
			.domain([0, _.max(data.y)])
			.range([graph.height, 0])

			graph.svg.selectAll("rect")
			.data(data.y)
			.transition()
			.attr("y", function(d) {
				return graph.scale.y(d)
			})
			.attr("height", function(d) {
				return height - graph.scale.y(d)
			})

			graph.data = data
		}

		return graph
	}

	var d3createSuitePlot = function(pmf) {
		var pmf = pmf.pmf

		window.bargraph = d3verticalBar(svg, pmf)

		d3.select("body").append("div")
		.attr("class", "button heads")
		.attr("data", "H")
		.on("click", function() {
			var update = d3.select(this).attr("data")

			updateSuite(bargraph, bargraph.data, update)
		})

		d3.select("body").append("div")
		.attr("class", "button tails")
		.attr("data", "T")
		.on("click", function() {
			var update = d3.select(this).attr("data")

			updateSuite(bargraph, bargraph.data, update)
		})

		return svg
	}

	var updateSuite = function(graph, pmf, data) {
		$.ajax("/api/pmf", {
			data: JSON.stringify({
				pmf : pmf,
				update: data
			}),
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			success: function(pmf) {
				graph.update(pmf.pmf)
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