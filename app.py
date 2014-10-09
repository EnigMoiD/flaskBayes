from flask import Flask, request, render_template, json
import thinkbayes2 as tb

app = Flask(__name__)
print(__name__)

"""
I want a way to package up pmfs and send them.
Right now it's an object:

{"pmf": [[outcome, prob], [outcome, prob], ...]}

This works fine.
"""

def packaged(pmf):
	return json.jsonify({ "pmf": zip(pmf.d.keys(), pmf.d.values()) })

def suiteupdate(request):
	return dict(request['pmf']), request['update']

@app.route("/")
def hello():
	return render_template("index.html")

@app.route("/api/pmf", methods=["GET", "POST"])
def pmf():
	if request.method == "GET":
		pmf = tb.Pmf()
		for i in range(1, 101):
			pmf.Set(i, 1)
		pmf.Normalize()

		return packaged(pmf)
	else:
		class Euro(tb.Suite):
			def Likelihood(self, data, hypo):
				x = hypo / 100.0
				if data == 'H':
					return x
				else:
					return 1-x

		pmf, update = suiteupdate(request.get_json())

		euro = Euro(tb.MakePmfFromDict(pmf))
		euro.Update(update)

		return json.jsonify({ "pmf": zip(euro.d.keys(), euro.d.values()) })

if __name__ == "__main__":
	app.run(debug=True)