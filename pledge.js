/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise() {
	this.state = "pending";
	this.handlerGroups = [];
	this.value;
}

$Promise.prototype.then = function(successcb, errorcb) {
	if (typeof successcb !== "function"){
		successcb = false;
	}
	if (typeof errorcb !== "function"){
		errorcb = false;
	}

	this.handlerGroups.push({
		successCb : successcb,
		errorCb : errorcb
	})


	if (this.state === 'resolved') {
		successcb(this.value);
	} else if (this.state === 'rejected') {
		if (typeof errorcb === 'function') {
			errorcb(this.value);
		}
	}
}

$Promise.prototype.catch = function(func) {
	this.then(null, func)
}

Deferral.prototype.resolve = function(data) {
	if (this.$promise.state === "pending") {
		this.$promise.value = data;
		this.$promise.state = 'resolved';
		var hl = this.$promise.handlerGroups;
		var self = this;
		// for (var i = 0; i < hl.length; i++) {
		while (hl.length){
			hl.shift().successCb(self.$promise.value);
		}
	}
}

Deferral.prototype.reject = function(reason) {
	if (this.$promise.state === "pending") {
		this.$promise.state = 'rejected';
		this.$promise.value = reason;
		var hl = this.$promise.handlerGroups;
		var self = this;

		while (hl.length>0) {
			hl.shift().errorCb(self.$promise.value);
		}
	}
}

function Deferral() {

}

function defer() {
	var newDeferral =  new Deferral();
	newDeferral.$promise = new $Promise();

	return newDeferral;

}




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
