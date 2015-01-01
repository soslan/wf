function BooleanModel(args){
	var self = this;
	args = args || {};
	args.value = Boolean(args.value);

	Value.call(this, args);

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
		}
		else{
			self.dispatchEvent('off');
		}
	});

	
}

BooleanModel.prototype = Object.create(Value.prototype);

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

BooleanModel.prototype.switchClass = function(elem, onTrue){
	this.onTrue(function(){
		if (elem instanceof Element){
			elem.addClass(onTrue);
		}
	}, 1);
	this.onFalse(function(){
		if (elem instanceof Element){
			elem.removeClass(onTrue);
		}
	}, 1);

};



function DataTableModel(args){
	var self = this;
	args = args || {};
	args.value = args.value || [];
	Value.call(this, args);

}

DataTableModel.prototype = Object.create(Value.prototype);

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
			var date = DateModel.HBroadcastedDatesMin[i];
			var interval = now - date['date'];
			if (interval < 60 * 1000){
				date['node'].nodeValue = "just now";
			}
			else if (interval < 60 * 60 * 1000){
				date['node'].nodeValue = String(Math.round(interval / (60 * 1000))) + " min ago";
			}
			else {
				date['node'].nodeValue = String(Math.round(interval / (60 * 1000))) + " min ago";
			}
		}
	}, 60000);
}

DateModel.stopClock = function(){
	stopInterval(DateModel.minClock);
	delete DateModel.minClock;
}

DateModel.HBroadcastedDatesMin = [];

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
		else {
			item['node'].nodeValue = String(Math.round(interval / (60 * 1000))) + " min ago";
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
	 
	Value.call(this, {
		value:String(args.value),
	});
	this.filter('set', function(d){
		d.value = String(d.value);
		return d;
	})

}

StringModel.prototype = Object.create(Value.prototype);

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

	Value.call(this, {
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

NumberModel.prototype = Object.create(Value.prototype);