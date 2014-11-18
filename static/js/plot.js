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
		// assumes linear scale, graph data is
		// {x:[], y:[]}
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
		.domain([0, graph.data.length])
		.range([0, graph.width])

		graph.scale.y = d3.scale.linear()
		.domain(options.ydomain)
		.range([graph.height, 0])

		// actually do the plotting

		graph.svg.attr("class", "graph")
		graph.svg.selectAll("rect")
		.data(graph.data)
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
		.attr("width", graph.width/graph.data.length)
		.attr("class", "bar")

		graph.svg.append("text")
		.attr("class", "label x")
	    .attr("text-anchor", "end")
	    .attr("x", graph.width)
	    .attr("y", graph.height+20+'px')
	    .text(options.xlabel)

	    graph.svg.append("text")
	    .attr("class", "label y")
	    .attr("text-anchor", "end")
	    .attr("y", "-1em")
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text(options.ylabel);

		graph.update = function(data) {
			graph.svg.selectAll("rect")
			.data(data)
			.transition()
			.attr("y", function(d) {
				return graph.scale.y(d[1])
			})
			.attr("height", function(d) {
				return height - graph.scale.y(d[1])
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