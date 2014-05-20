
function Value(args){
	var self = this;
	args = args || {};
	this.eventListeners = {};
	this.broadcasters = [];
	this.patterns = [];
	this.filters = {};
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

Value.prototype.adaptTo = function(){
	var self = this;
	if(arguments.length < 2){
		return;
	}
	var func = arguments[arguments.length - 1];
	if(typeof func != 'function'){
		return;
	}
	var args = [];
	/*for(var i = 0; i < arguments.length - 1; i++){
		args.push(arguments[i]);
	}*/
	var f = function(){
		self.setValue(func.call(self, args));
	};
	for(var i = 0; i < arguments.length - 1; i++){
		args.push(arguments[i]);
		if(arguments[i] instanceof Value){
			arguments[i].onChange(f);
		}
	}
};

Value.prototype.listenTo = function(){
	if(arguments.length < 2){
		return;
	}
	var func = arguments[arguments.length - 1];
	if(typeof func != 'function'){
		return;
	}
	var f = function(){
		func.call(this, args);
	};
	for(var i = 0; i < arguments.length - 1; i++){
		if(arguments[i] instanceof Value){
			arguments[i].onChange(f);
		}
	}
};

Value.prototype.onChange = function(handler){
	return this.addEventListener('change', handler);
}

Value.prototype.setValue = function(value, args){
	var args = args || {};
	args.value = value;
	this.set(args);
}

Value.prototype.addBroadcaster = function(args){
	var broadcaster = document.createTextNode(this.value ? this.value.toString() : '');
	this.broadcasters.push(broadcaster);
	return broadcaster;
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
	for (var i in this.broadcasters){
		this.broadcasters[i].nodeValue = changes.value.toString();
	}
}

Value.prototype.dispatchEvent = function(event, e){
	var self = this;
	if(typeof event == "string"){
		for (i in this.eventListeners[event]){
			this.eventListeners[event][i](e);
		}
	}
	return this;
}

Value.prototype.addFilter = function(filter, handler){
	if(typeof this.filters[filter] == "undefined"){
		this.filters[filter] = [];
	}
	this.filters[filter].push(handler);
	return this;
}

Value.prototype.removeFilter = function(filter, handler){
	var i = this.filters[filter].indexOf(handler);
	if(i > -1){
		this.filters[filter].splice(i, 1);
	}
	return this;
}

Value.prototype.applyFilter = function(filter, data){
	var self = this;
	if(typeof filter == "string"){
		for (i in this.filters[filter]){
			data = this.filters[filter][i](data) || data;
		}
	}
	return data;
}


Value.prototype.set = function(args){
	if(typeof args === "string"){
		args = {
			value:args,
		}
	}
	else if(typeof args === "undefined"){
		args = {};
	}
	args.oldValue = this.value;
	args = this.applyFilter('set', args);
	
	this.value = args.value;
	this.dispatchEvent('change',args);
	this.broadcast(args);
}

Value.prototype.get = function(args){
	args = args || {};
	args.value = this.value;
	args.originalValue = this.value;
	args = this.applyFilter('get',args);
	return args.value;
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

	var setData = insertedData;

	setData.value = setData.firstPart + setData.replacement + setData.secondPart;
	setData.firstPart = setData.firstPart + setData.replacement;
	setData.selection = '';
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
