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
	Value.call(this, {});

}

DataTableModel.prototype = Object.create(Value.prototype);