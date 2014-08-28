function BooleanModel(args){
	var self = this;
	args = args || {};

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

BooleanModel.prototype.onTrue = function(handler){
	this.addEventListener('on', handler);
}

BooleanModel.prototype.onFalse = function(handler){
	this.addEventListener('off', handler);
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
