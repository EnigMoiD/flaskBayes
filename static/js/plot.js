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
		/* 
			assumes linear scale
			graph data is
			[[x1, y1], [x2, y2], ...]
			this returns a graph object
			options can contain things like scale, style
			options = {
				ydomain: [ymin, ymax],
				xlabel: xlabel,
				ylabel: ylabel,
				colors: [color0, color1, ...]
			}
			attributes of the plot
		*/

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
		var plotSeries = function(series, index) {
			graph.svg.append("g").selectAll("rect")
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
			.attr("fill", options.colors[index])
			.attr("fill-opacity", options.opacities[index])
			.attr("width", graph.width/series.length)
			.attr("class", "bar")
			.attr("series", index)
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

		// updates one series at a time
		// optionally takes an index argument
		// if the plot has multiple series
		graph.update = function(data, index) {
			_.each(data, function(series) {
				graph.svg
				.selectAll("[series='"+index+"']")
				.data(series)
				.transition()
				.attr("y", function(d) {
					return graph.scale.y(d[1])
				})
				.attr("height", function(d) {
					return height - graph.scale.y(d[1])
				})
			})

			graph.data[index] = data[0]
		}

		return graph
	}

	window.updateSuite = function(graph, data, update, url) {
		$.ajax(url, {
			data: JSON.stringify({
				pmf : data.data,
				update: update
			}),
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			success: function(res) {
				graph.update([res.pmf], data.index)
			}
		})
	}

	window.makeUpdateButton = function(plot, name, data, url, options) {
		d3.select("body").append("div")
		.attr("class", "button "+name)
		.attr("data", data)
		.on("click", function() {
			var update = d3.select(this).attr("data")
			update = {
				"update": update,
				"data": options.data[data]
			}
			updateSuite(plot, {data: options.multipmfs? plot.data[data] : plot.data[0], index: options.multipmfs? data : null}, update, url)

		})
	}

	window.d3getSuite = function(jsonUrl, svg, callback) {
		d3.json(jsonUrl, function(data) {
			callback(data, svg)
		})
	}
})()