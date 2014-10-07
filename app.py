from flask import Flask, request, render_template, json
import thinkbayes2 as tb

app = Flask(__name__)
print(__name__)

class Euro(tb.Suite):
	def Likelihood(self, data, hypo):
		x = hypo / 100.0
		if data == 'H':
			return x
		else:
			return 1-x

pmf = tb.Pmf()
for i in range(1, 101):
	pmf.Set(i, 1)
pmf.Normalize()

euro = Euro(tb.MakePmfFromDict(pmf))

@app.route("/")
def hello():
	return render_template("index.html")

@app.route("/api/pmf", methods=["GET", "POST"])
def pmf():
	if request.method == "GET":
		# pmf = tb.Pmf()
		# for i in range(1, 101):
		# 	pmf.Set(i, 1)
		# pmf.Normalize()
		suitejson = json.jsonify({ "pmf": zip(euro.d.keys(), euro.d.values()) })

		return suitejson
	else:

		# pmf = dict(request.get_json()['pmf'])
		update = request.get_json()['update']

		euro.Update(update)

		return json.jsonify({ "pmf": zip(euro.d.keys(), euro.d.values()) })

"""
posting here with a pmf and an update
responds with the updated version of the pmf
"""

"""
a user interaction
enter data
	create a named pmf (server)
make an interactive graph
	graph the pmf data (client)
interact with the graph, see live updates
	requests for new data (server)
	update graph (client)
"""

"""
hold state on client or server?
definitely client... javascript objects hold data
server just fulfills request for data, operations

PMF: javascript object {outcome: probability}
"""

if __name__ == "__main__":
	app.run(debug=True)

	euro = Euro(tb.MakePmfFromDict(pmf))