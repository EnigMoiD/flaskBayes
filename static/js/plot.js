(function() {
	window.zip = function(arrays) {
		return arrays[0].map(function(_,i){
			return arrays.map(function(array){return array[i]})
		});
	}

	window.svgTranslate = function(left, top) {
		return "translate(" + left + "," + top + ")"
	}

	window.d3verticalBar = function(svg, data, options) {
		// assumes linear scale
		// graph data is
		// [{x:[], y:[]}]
		// this returns a graph object
		// options can contain things like scale, style
		// attributes of the plot

		var graph = this
		
		graph.data = data
		graph.svg = svg
		graph.width = parseInt(svg.style("width"))
		graph.height = parseInt(svg.style("height"))

		graph.scale = {}

		graph.scale.x = d3.scale.linear()
		.domain([0, graph.data[0].length])
		.range([0, graph.width])

		graph.scale.y = d3.scale.linear()
		.domain(options.ydomain)
		.range([graph.height, 0])

		graph.svg.attr("class", "graph")

		// actually do the plotting
		var plotSeries = function(series) {
			graph.svg.selectAll("rect")
			.data(series)
			.enter().append("rect")
			.attr("x", function(d, i) {
				return graph.scale.x(i)
			})
			.attr("y", function(d) {
				return graph.scale.y(d[1])
			})
			.attr("height", function(d) {
				return graph.height - graph.scale.y(d[1])
			})
			.attr("width", graph.width/series.length)
			.attr("class", "bar")
		}

		_.each(graph.data, plotSeries)

		graph.svg.append("text")
		.attr("class", "label x")
	    .attr("text-anchor", "end")
	    .attr("x", graph.width)
	    .attr("y", graph.height+40+'px')
	    .text(options.xlabel)

	    graph.svg.append("text")
	    .attr("class", "label y")
	    .attr("text-anchor", "end")
	    .attr("y", "-3em")
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text(options.ylabel)

	    var xAxis = d3.svg.axis()
	    .scale(graph.scale.x)
	    .orient("bottom")

	    graph.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0,"+graph.height+")")
	    .call(xAxis)

	    var yAxis = d3.svg.axis()
	    .scale(graph.scale.y)
	    .orient("left")

	    graph.svg.append("g")
	    .attr("class", "axis")
	    .call(yAxis)

		graph.update = function(data) {
			_.each(data, function(series) {	
				graph.svg.selectAll("rect")
				.data(series)
				.transition()
				.attr("y", function(d) {
					return graph.scale.y(d[1])
				})
				.attr("height", function(d) {
					return height - graph.scale.y(d[1])
				})
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
				graph.update([pmf.pmf])
			}
		})
	}

	window.makeUpdateButton = function(plot, name, data, url) {
		d3.select("body").append("div")
		.attr("class", "button "+name)
		.attr("data", data)
		.on("click", function() {
			var update = d3.select(this).attr("data")

			updateSuite(plot, plot.data[0], update, url)
		})
	}

	window.d3getSuite = function(jsonUrl, svg, callback) {
		d3.json(jsonUrl, function(data) {
			callback(data, svg)
		})
	}
})()