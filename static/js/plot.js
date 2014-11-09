(function() {
	window.svgTranslate = function(left, top) {
		return "translate(" + left + "," + top + ")"
	}

	window.d3verticalBar = function(svg, data, options) {
		// assumes linear scale, graph data is
		// {x:[], y:[]}
		// this returns a graph object
		// options can contain things like scale, style
		// attributes of the plot

		var graph = this
		console.log("data")
		console.log(data)
		
		graph.data = data
		graph.svg = svg
		graph.width = parseInt(svg.style("width"))
		graph.height = parseInt(svg.style("height"))

		graph.scale = {}

		graph.scale.x = d3.scale.linear()
		.domain([0, data.x.length])
		.range([0, graph.width])

		graph.scale.y = d3.scale.linear()
		.domain(options.ydomain || [0, _.max(data.y)])
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

	window.updateSuite = function(graph, pmf, data, url) {
		$.ajax(url, {
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

	window.makeUpdateButton = function(plot, name, data, url) {
		d3.select("body").append("div")
		.attr("class", "button "+name)
		.attr("data", data)
		.on("click", function() {
			var update = d3.select(this).attr("data")

			updateSuite(plot, plot.data, update, url)
		})
	}

	window.d3getSuite = function(jsonUrl, svg, callback) {
		d3.json(jsonUrl, function(data) {
			callback(data, svg)
		})
	}
})()