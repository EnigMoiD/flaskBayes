(function() {
	var svgTranslate = function(left, top) {
		return "translate(" + left + "," + top + ")"
	}	

	var svg = d3.select("body").append("svg")
		.attr("width", 300)
		.attr("height", 300)
		.append("g")
		.attr("transform", svgTranslate(0, 0))

	d3.json("http://localhost:5000/api/pmf", function(data) {
		console.log('JSON')
		console.log(data)
	})
})()