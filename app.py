from flask import Flask, request, render_template, json
import thinkbayes2 as tb
from random import random

app = Flask(__name__)
print(__name__)

"""
I want a way to package up pmfs and send them.
Right now it's an object:

{"pmf": [[outcome, prob], [outcome, prob], ...]}

This works fine.
"""
 
class Bandit(tb.Suite):
    # init a bandit with a pmf and a probability of success
    def __init__(self, pmf=None, p=None, label=None):
        self.p = p if p else random()
        if not pmf: pmf = tb.MakePmfFromList(list(range(101)))
        tb.Suite.__init__(self, pmf, label=label)

    def setlabel(self, label):
        self.label = label

    def Likelihood(self, data, hypo):
        if data == 1:
            like = hypo/100.0
        else:
            like = 1-hypo/100.0

        return like 

    def pull(self):
        return random() < self.p

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
	return sorted(pmf.d.items())

def packagedpmf(pmf):
	return json.jsonify({ "pmf": packaged(pmf) })

def banditpackage(bandits):
	return json.jsonify({
		"pmfs": [ packaged(bandit) for bandit in bandits ],
		"probs": [ bandit.p for bandit in bandits ]
	})

def suiteupdate(request):
	return dict(request['pmf']), request['update']

def banditupdate(request):
	return dict(request['pmf']), request['update']['update'], request['update']['data']

def pmffromresponse(res):
	return tb.MakePmfFromItems(res)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/dice")
def dices():
	return render_template("dice.html")

@app.route("/bandit")
def banditses():
	return render_template("bandit.html")

@app.route("/api/suite/euro", methods=["GET", "POST"])
def euro():
	if request.method == "GET":
		pmf = tb.MakePmfFromList(list(range(1, 101)))

		return packagedpmf(pmf)
	else:
		pmf, update = suiteupdate(request.get_json())

		euro = Euro(pmffromresponse(pmf))
		euro.Update(update)

		return packagedpmf(euro)

@app.route("/api/suite/dice", methods=["GET", "POST"])
def dice():
	if request.method == "GET":
		pmf = tb.MakePmfFromList([4, 6, 8, 12, 20])

		package = packagedpmf(pmf)
		return package
	else:
		pmf, update = suiteupdate(request.get_json())
		update = int(update)

		dice = Dice(pmffromresponse(pmf))
		dice.Update(update)

		return packagedpmf(dice)

# the bandit example
# the frontend holds the state for all the bandits
# 	so it needs to receive a bunch at once
# 	for now, this just means 10

@app.route("/api/suite/bandit", methods=["GET", "POST"])
def bandit():
	if request.method == "GET":
		bandits = [Bandit(label='Slot ' + str(i)) for i in range(10)]

		package = banditpackage(bandits)
		print "BANDITS========================"
		print package
		print "STIDNAB========================"
		return package
	else:
		print "POST-----------------"
		print request.get_json()
		print "TSOP================="

		pmf, update, prob = banditupdate(request.get_json())

		bandit = Bandit(pmf, prob)
		for i in range(50):
			bandit.Update(bandit.pull())

		return packagedpmf(bandit)

if __name__ == "__main__":
	app.run(debug=True)