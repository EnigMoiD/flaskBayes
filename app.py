from flask import Flask, request, render_template, json
import thinkbayes2 as tb

app = Flask(__name__)
print(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/api/pmf/", methods=["GET"])
def pmf():
	pmf = tb.Pmf()
	for i in range(1, 7):
		pmf.Set(i, 1)
	pmf.Normalize()
	pmfjson = json.jsonify(pmf.d)
	
	return pmfjson

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
    app.run()
