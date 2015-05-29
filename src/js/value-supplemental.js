function BooleanModel(){
	var args, self;
	args = args || {};
	if(typeof arguments[0] === "boolean"){
		args = typeof arguments[1] === "object" ? arguments[1] : {};
		args.value = arguments[0];
	}
	else if(typeof arguments[0] === "object"){
		args = arguments[0];
	}
	args.value = Boolean(args.value);
	Model.call(this, args);
	self = this;
	this.addFilter('set', function(d){
		if(!d.value){
			d.value = false;
		}
		else{
			d.value = true;
		}
		return d;
	});
	this.onChange(function(d){
		if(d.value){
			self.dispatchEvent('on');
			if(typeof args.onOn === "function"){
				args.onOn(d);
			}
		}
		else{
			self.dispatchEvent('off');
			if(typeof args.onOff === "function"){
				args.onOff(d);
			}
		}
	});
}

BooleanModel.prototype = Object.create(Model.prototype);

BooleanModel.prototype.flip = function(args){
	if(this.value){
		this.setValue(false, args);
	}
	else{
		this.setValue(true, args);
	}
}

BooleanModel.prototype.true = function(args){
	this.setValue(true, args);
}

BooleanModel.prototype.false = function(args){
	this.setValue(false, args);
}

BooleanModel.prototype.onTrue = function(handler, check){
	this.addEventListener('on', handler);
	if (check==true && this.value === true){
		handler();
	}
}

BooleanModel.prototype.onFalse = function(handler, check){
	this.addEventListener('off', handler);
	if (check==true && this.value === false){
		handler();
	}
}

BooleanModel.prototype.and = function(arg){
	var self = this;
	var newBool = new BooleanModel({
		value:this.value && arg.value,
	});
	this.onChange(function(d){
		newBool.setValue(d.value && arg.value);
	});

	arg.onChange(function(d){
		newBool.setValue(d.value && self.value);
	});

	return newBool;
}

BooleanModel.prototype.switchClass = function(elem, onTrue, onFalse){
	this.onTrue(function(){
		if (elem instanceof Element){
			elem.addClass(onTrue);
			elem.removeClass(onFalse);
		}
	}, 1);
	this.onFalse(function(){
		if (elem instanceof Element){
			elem.addClass(onFalse);
			elem.removeClass(onTrue);
		}
	}, 1);

};



function DataTableModel(args){
	var self = this;
	var args = args || {};
	var row;
	args.value = args.value || [];

	this.filter('newrow', function(row){
		if(typeof row !== "object"){
			row = {};
		}
		return row;
	});

	this.filter('set', function(data){
		var table = [];
		if(data.value instanceof Array){
			for (var i in data.value){
				var row = data.value[i];
				if(typeof row === "object"){
					row = self.applyFilter('newrow', row);
					table.push(row);
				}
				else{
					continue;
				}
			}
		}
		data.value = table;
		return data;
	});

	Model.call(this, args);
}

DataTableModel.prototype = Object.create(Model.prototype);

DataTableModel.prototype.extract = function(){
	var out = {
		rows:[],
		range:{},
	};
	for(var i in this.value){
		var row = this.value[i];
		Object.keys(row).forEach(function(key){
			if(out.range[key] === undefined){
				out.range[key] = [undefined, undefined];
				if(row[key] !== null){
					out.range[key] = [row[key], row[key]];
				}
			}
			else if(row[key] !== null){
				if(out.range[key][0] === undefined || out.range[key][0] > row[key]){
					out.range[key][0] = row[key];
				}
				if(out.range[key][1] === undefined || out.range[key][1] < row[key]){
					out.range[key][1] = row[key];
				}
			}

		});
		out.rows.push(row);
	}
	return out;
};


function DateModel(args){
	var self = this;
	if (typeof args == 'number'){
		self.value = Date(Number(args));
	}
	else if (typeof args == 'object') {
		self.value = args.value;
	}



}

DateModel.prototype = Object.create(Value.prototype);

DateModel.startClock = function(){
	DateModel.minClock = setInterval(function(){
		var now = new Date();
		for (var i in DateModel.HBroadcastedDatesMin){
			var item = DateModel.HBroadcastedDatesMin[i];
			var interval = now - item['date'];
			if (interval < 60 * 1000){
				item['node'].nodeValue = "just now";
			}
			else if (interval < 60 * 60 * 1000){
				item['node'].nodeValue = String(Math.round(interval / (60 * 1000))) + " min ago";
			}
			else if (interval < 24 * 60 * 60 * 1000){
				item['node'].nodeValue = String(Math.round(interval / (60 * 60 * 1000))) + " hrs ago";
			}
			else {
				item['node'].nodeValue = String(DateModel.monthAbbr[item.date.getMonth()]) + ' ' + String(item.date.getDate());
			}
		}
	}, 60000);
}

DateModel.stopClock = function(){
	stopInterval(DateModel.minClock);
	delete DateModel.minClock;
}

DateModel.HBroadcastedDatesMin = [];

DateModel.monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

DateModel.getHBroadcaster = function(date){
	//var item = {}
	if (date instanceof Date){
		var item = {
			date:date,
			node:new Text(),
		};

		var now = new Date();

		var interval = now - date;

		if (interval < 60 * 1000){
			item['node'].nodeValue = "just now";
		}
		else if (interval < 60 * 60 * 1000){
			item['node'].nodeValue = String(Math.round(interval / (60 * 1000))) + " min ago";
		}
		else if (interval < 24 * 60 * 60 * 1000){
			item['node'].nodeValue = String(Math.round(interval / (60 * 60 * 1000))) + " hrs ago";
		}
		else {
			item['node'].nodeValue = String(DateModel.monthAbbr[date.getMonth()]) + ' ' + String(date.getDate());
		}

		DateModel.HBroadcastedDatesMin.push(item);
		if (DateModel.minClock === undefined){
			DateModel.startClock();
		}

		return item['node'];
	}

	
}

DateModel.prototype.getHBroadcaster = function(){

}

function StringModel(args){
	var args;
	if (args == undefined){
		args = {};
	}
	else if (typeof args === "string"){
		args = {
			value:args,
		}
	}

	if(args.value === undefined){
		args.value = '';
	}
	 
	Model.call(this, {
		value:String(args.value),
	});
	this.filter('set', function(d){
		d.value = String(d.value);
		return d;
	});
}

StringModel.prototype = Object.create(Model.prototype);

function NumberModel(args){
	if (args == undefined){
		args = {};
	}
	else if (typeof args === "number"){
		args = {
			value:args,
		}
	}
	if (args.value === undefined || Number(args.value) == NaN){
		args.value = 0;
	}

	Model.call(this, {
		value: Number(args.value),
	});
	this.filter('set', function(d){
		d.value = Number(d.value);
		if(d.value == NaN){
			d.cancel = true;
		}
		return d;
	});
}

NumberModel.prototype = Object.create(Model.prototype);

function RangeModel(args){
	var self = this;
	this.filter('set', function(d){
		if(typeof d.value !== "object"){
			d.value = {};
		}
		return d;
	});
	Model.call(this, args);
}

RangeModel.prototype = Object.create(Model.prototype);

RangeModel.prototype.setMin = function(val){
	this.value.min = val;
}

RangeModel.prototype.setMax = function(val){
	this.value.max = val;
}

RangeModel.prototype.getMin = function(){
	return this.value.min;
}

RangeModel.prototype.getMax = function(){
	return this.value.max;
}

Object.defineProperty(RangeModel.prototype, 'min', {
	get: function(){
		return this.value.min;
	},
	set: function(val){
		this.value.min = val;
	}
});