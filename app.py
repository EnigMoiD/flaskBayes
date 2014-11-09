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

class Cookie(tb.Suite):
	def Likelihood(self, data, hypo):
		like = hypo[data] / hypo.Total()
		if like:
			hypo[data] -= 1
		return like

class Dice(tb.Suite):
	def Likelihood(self, data, hypo):
		if data > hypo:
			return 0

		return 1.0/hypo

class Euro(tb.Suite):
	def Likelihood(self, data, hypo):
		x = hypo / 100.0
		for datum in data:
			if datum == 'H':
				return x
			else:
				return 1-x

def packaged(pmf):
	return json.jsonify({ "pmf": {'x': pmf.d.keys(), 'y': pmf.d.values()} })

def suiteupdate(request):
	return dict(request['pmf']), request['update']

def pmfFromResponse(res):
	return tb.MakePmfFromDict(dict(zip(res['x'], res['y'])))

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/dice")
def dices():
	return render_template("dice.html")

@app.route("/api/suite/euro", methods=["GET", "POST"])
def euro():
	if request.method == "GET":
		pmf = tb.MakePmfFromList(list(range(1, 101)))

		return packaged(pmf)
	else:
		pmf, update = suiteupdate(request.get_json())

		euro = Euro(pmfFromResponse(pmf))
		euro.Update(update)

		return packaged(euro)

@app.route("/api/suite/dice", methods=["GET", "POST"])
def dice():
	if request.method == "GET":
		pmf = tb.MakePmfFromList([4, 6, 8, 12, 20])

		return packaged(pmf)
	else:
		pmf, update = suiteupdate(request.get_json())
		update = int(update)

		dice = Dice(pmfFromResponse(pmf))
		dice.Update(update)

		return packaged(dice)

if __name__ == "__main__":
	app.run(debug=True)