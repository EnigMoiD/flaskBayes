from flask import Flask, request, render_template, json
import thinkbayes2 as tb

app = Flask(__name__)
print(__name__)

@app.route("/")
def hello():
	return render_template("index.html")

@app.route("/api/pmf", methods=["GET", "POST"])
def pmf():
	if request.method == "GET":
		pmf = tb.Pmf()
		for i in range(1, 7):
			pmf.Set(i, 1)
		pmf.Normalize()
		pmf += pmf
		suitejson = json.jsonify({ "pmf": zip(pmf.d.keys(), pmf.d.values()) })

		return suitejson
	else:
		class Dice(tb.Suite):
			def Likelihood(self, data, hypo):
				if hypo < data:
					return 0
				else:
					return 1.0/hypo

		pmf = dict(request.get_json()['pmf'])
		update = request.get_json()['update']

		dice = Dice(tb.MakePmfFromDict(pmf))
		dice.Update(update)

		return json.jsonify({ "pmf": zip(dice.d.keys(), dice.d.values()) })

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