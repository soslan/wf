
function Value(args){
	var self = this;
	args = args || {};
	if(args.value instanceof Value){
		this.adaptTo(args.value, function(args){
			return args[0].get();
		});
		this.setValue(args.value.get());
	}
	else{
		this.set({
			value:args.value,
		});
	}

}

Value.prototype.addEventListener = function(event, handler){
	if(typeof this.eventListeners == "undefined"){
		this.eventListeners = {};
	}
	if(typeof this.eventListeners[event] == "undefined"){
		this.eventListeners[event] = [];
	}
	this.eventListeners[event].push(handler);
	return this;
}

Value.prototype.on = Value.prototype.addEventListener;

Value.prototype.removeEventListener = function(event, handler){
	if(typeof this.eventListeners == "undefined"){
		return;
	}
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
	//f();
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

Value.prototype.getBroadcaster = function(args){
	if (typeof this.broadcasters === "undefined"){
		this.broadcasters = [];
	}
	var broadcaster = document.createTextNode(this.value !== undefined ? this.toString() : '');
	this.broadcasters.push(broadcaster);
	return broadcaster;
}

Value.prototype.addBroadcaster = Value.prototype.getBroadcaster;

Value.prototype.removeBroadcaster = function(element){
	if (this.broadcasters === undefined){
		return;
	}
	var i = this.broadcasters.indexOf(element);
	if (i > -1) {
    	this.broadcasters.splice(i, 1);
	}
	return this;
}

Value.prototype.broadcast = function(changes){
	if (this.broadcasters === undefined){
		return;
	}
	var self = this;
	for (var i in this.broadcasters){
		this.broadcasters[i].nodeValue = changes.value.toString();
	}
}

Value.prototype.dispatchEvent = function(event, e){
	if(typeof this.eventListeners == "undefined"){
		return this;
	}
	var self = this;
	if(typeof event == "string"){
		for (i in this.eventListeners[event]){
			this.eventListeners[event][i](e);
		}
	}
	return this;
}

Value.prototype.addFilter = function(filter, handler){
	if (this.filters === undefined){
		this.filters = {};
	}
	if(typeof this.filters[filter] == "undefined"){
		this.filters[filter] = [];
	}
	this.filters[filter].push(handler);
	return this;
}

Value.prototype.filter = Value.prototype.addFilter;

Value.prototype.removeFilter = function(filter, handler){
	if (this.filters === undefined){
		return
	}
	var i = this.filters[filter].indexOf(handler);
	if(i > -1){
		this.filters[filter].splice(i, 1);
	}
	return this;
}

Value.prototype.applyFilter = function(filter, data){
	if (this.filters === undefined){
		return data;
	}
	var self = this;
	if(typeof filter == "string"){
		for (i in this.filters[filter]){
			data = this.filters[filter][i](data) || data;
		}
	}
	return data;
}


Value.prototype.set = function(args){
	if(typeof args !== "object"){
		args = {
			value:args,
		}
	}
	else if(typeof args === "undefined"){
		args = {};
	}
	args.oldValue = this.value;
	args = this.applyFilter('set', args);
	if(args.cancel == true){
		return;
	}
	if(this.value !== args.value){
		this.value = args.value;
	}
	else{
		return;
	}
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
	if(insertedData.cancel == true === true){
		this.dispatchEvent('insert-cancel == truee{{d');
		this.dispatchEvent('change-cancel == truee{{d');
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

Value.prototype.valueOf = function(){
	return this.get();
};

Value.prototype.toString = function(){
	return String(this.get());
}

Value.prototype.getAsString = function(){
	return String(this.get());
}

Value.prototype.getAsNode = function(){
	return this.getBroadcaster();
}