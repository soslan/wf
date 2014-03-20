
function Value(args){
	this.eventListeners = {};
	this.broadcasters = [];
	this.patterns = [];
	this.filters = {};
	this.eventLocked = {};
	this.pendingHandler ={};
	if(typeof args.value === "undefined"){
		args.value = "";
	}
	this.set({
		value:args.value,
	});

}

Value.prototype.addEventListener = function(event, handler){
	if(typeof this.eventListeners[event] == "undefined"){
		this.eventListeners[event] = [];
	}
	this.eventListeners[event].push(handler);
	return this;
}

Value.prototype.removeEventListener = function(event, handler){
	var i = this.eventListeners[event].indexOf(handler);
	if(i > -1){
		this.eventListeners[event].splice(i, 1);
	}
	return this;
}
/*
Value.prototype.addBroadcaster = function(element){
	this.broadcasters.push(element);
	return this;
}

Value.prototype.removeBroadcaster = function(element){
	var i = this.broadcasters.indexOf(element);
	if (i > -1) {
    	this.broadcasters.splice(i, 1);
	}
	return this;
}

Value.prototype.broadcast = function(changes){
	var self = this;
	var bootstrap = function(broadcasterIndex, max){
		setTimeout(function(){
			self.broadcasters[broadcasterIndex].edit(changes);
		},0);
		if(max>broadcasterIndex){
			bootstrap(broadcasterIndex * 1 + 1, max);
		}
	}
	bootstrap(0, this.broadcasters.length - 1);
}
*/
Value.prototype.dispatchEvent = function(event, e){
	var self = this;
	if(typeof event == "string"){
		for (i in this.eventListeners[event]){
			this.eventListeners[event][i](e);
		}
	}
	return this;
}

Value.prototype.applyFilter = function(filter, data){
	var self = this;
	if(typeof filter == "string"){
		for (i in this.eventListeners[filter]){
			data = this.filters[filter][i](data);
		}
	}
	return data;
}


Value.prototype.set = function(args){
	var args = args || {};
	if(typeof args.value === "undefined"){
		return this;
	}
	args = this.applyFilter('new-value', args);
	/*if(this.type == "number"){
		if(!isNaN(parseFloat(candidate)) && isFinite(candidate)){
			candidate = Number(candidate);
		}
		else if(Number(candidate) === 0){
			candidate = Number(candidate);
		}
		else{
			this.dispatchEvent('wrongvalue');
			return this;
		}
	}*/
	this.value = args.value;
	this.dispatchEvent('change',args);
}

Value.prototype.get = function(newValue){
	return this.value;
}

Value.prototype.insert = function(insertedData){
	var self = this;
	var selectionStart, selectionEnd, candidateValue, tempValue;
	insertedData = insertedData || {
		value:'',
		firstPart:'',
		secondPart:'',
		selection:'',
		replacement:'',
	};
	insertedData = this.applyFilter('insert', insertedData);
	if(insertedData.cancel === true){
		this.dispatchEvent('insert-canceled');
		this.dispatchEvent('change-canceled');
		return this;
	}
	if(typeof this.value !== "undefined")
		tempValue = this.value.toString();
	else
		tempValue = '';

	var setData = insertedData;

	setData.value = setData.firstPart + setData.replacement + setData.secondPart;
	setData.firstPart = setData.firstPart + setData.replacement;
	setData.selection = '';

	/*if(typeof insertedData.selectionStart !== "undefined"){ // TODO. isNumber function
		if(insertedData.selectionStart > this.value.length){
			insertedData.selectionStart = this.value.length;
		}
		else if(insertedData.selectionStart <0){
			insertedData.selectionStart = 0;
		}
	}
	else{
		insertedData.selectionStart = this.value.length;
	}
	if(typeof insertedData.selectionEnd === "undefined"){
		if(insertedData.selectionEnd > this.value.length){
			insertedData.selectionEnd = this.value.length;
		}
		else if(insertedData.selectionEnd <0){
			insertedData.selectionEnd = 0;
		}
	}
	else{
		insertedData.selectionEnd = this.value.length;
	}
	if(typeof insertedData.value !== "undefined"){
		if(typeof insertedData.value === "string"){
			var firstPart = tempValue.slice(0,insertedData.selectionStart);
			var lastPart = tempValue.slice(insertedData.selectionEnd,tempValue.length);
			candidateValue = firstPart + insertedData.value + lastPart;
			
		}
		
	}
	insertedData.value = candidateValue;*/
	this.set(setData);
}

Value.prototype.deleteAt = function(value, selectionStart, selectionEnd){
	selectionEnd = selectionEnd || selectionStart;
	var firstPart = this.value.slice(0,selectionStart);
	var lastPart = this.value.slice(selectionStart,this.value.length);
	this.value = firstPart + value + lastPart;
	var e = {
		selectionStart:selectionStart,
		selectionEnd:selectionEnd,
		delta:value,
		value:this.value,
	}
	this.dispatchEvent('change',e);
}

function NumberValue(args){
	var self = this;
	args = args || {};
	Value.call(this,{});
}