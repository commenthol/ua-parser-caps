'use strict';

var DEBUG = (process.env['NODE_ENV'] === undefined || process.env['NODE_ENV'] === 'development') ;

function Timer(name) {
	if (! (this instanceof Timer)) {
		return new Timer(name);
	}
	this.name = name || "";
	this.start();
}

module.exports = Timer;

Timer.prototype = {
	start: function(){
		if (!DEBUG) return;
		this._start = new Date();
	},
	lap: function(silent){
		if (!DEBUG) return;
		this._lap = new Date();
		var diff = this._lap - this._start;

		if (!silent) {
			console.log(this.name, diff);
		}
		return diff;
	}
};