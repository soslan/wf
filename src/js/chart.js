function ChartCanvas(args){
	console.log("ChartCanvas");
	args=args?args:{};
	args.share = args.share || 1;
	args.contentDirection = 'vertical';
	Container.call(this, args);
	var self = this;
	this.addClass('chart');

	//this.channels = [];
	//this.data;

	/*if(args.data != undefined){
		this.bindTo(args.data);
	}
	else{
		this.bindTo(new DataTableModel());
	}*/

	//this.

	this.svg = new SVGElement();
	this.svg.setAttribute("width","100%");
	this.svg.setAttribute("height","100%");
	this.svg.e.style.flexGrow = 1;
	
	this.append(this.svg);
}

ChartCanvas.prototype = Object.create(Container.prototype);

function DataTableChart(args){
	args = args || {};
	args.tagName = 'g';
	SVGElement.call(this, args);
	var self = this;
	this.addClass('chart-line');

	this.limits = new Value();
	//this.append(this.path);
	this.channels = [];

	this.canvasLimits = {
		x:[0, undefined],
		y:[undefined, 0],
		r:[5, 50],
		cR:[0, 255],
		cG:[0,255],
		cB:[0,255],
		o:[0.2,1],
	};

	this.limits = {
		x:[undefined, undefined],
		y:[undefined, undefined],
		r:[undefined, undefined],
		cR:[undefined, undefined],
		cG:[undefined, undefined],
		cB:[undefined, undefined],
		o:[undefined, undefined],
	};

	//this.tempLimits = {};

	this.canvasDefaults = {
		x:undefined,
		y:undefined,
		r:5,
		cR:0,
		cG:0,
		cB:0,
		o:0.8,
	};

	this.defaultsB = this.canvasDefaults;
}

DataTableChart.prototype = Object.create(SVGElement.prototype);
DataTableChart.prototype.applyTo = function(canvas){
	if(canvas instanceof ChartCanvas){
		canvas.svg.append(this);
		this.canvas = canvas;
	}
}
DataTableChart.prototype.setData = function(data){
	if(data instanceof DataTableModel){
		this.data = data;
	}
}
DataTableChart.prototype.getCanvasSize = function(){
	if(this.canvas instanceof ChartCanvas){
		return {
			width:this.canvas.$.width(),
			height:this.canvas.$.height(),
		}
	}
}
DataTableChart.prototype.getActiveKeys = function(){
	return ['x', 'y', 'r'];
}
DataTableChart.prototype.addChannel = function(ch){
	var channel = {};
	ch = ch || {};
	channel.keySettings = ch;
	this.channels.push(channel);
}
DataTableChart.prototype.draw = function(){
	var self = this;
	var tempLimits = {};
	var rows = this.data.get();
	this.canvasLimits.x[1] = this.canvas.$.width();
	this.canvasLimits.y[0] = this.canvas.$.height();
	for(var i in this.channels){
		this.channels[i].rows = [];
	}
	for(var i in rows){
		var row = rows[i];
		for(var j in this.channels){
			var channel = this.channels[j];
			//channel.rows = [];
			var ok = true;
			for(var k in channel.keySettings){
				var key = channel.keySettings[k];
				if(row[key] !== undefined && row[key] !== null){
					
				}
				else{
					ok = false;
				}
			}
			if(ok){
				channel.rows.push(row);
			}
		}
	}
	for(var i in this.channels){
		var channel = this.channels[i];
		if(channel.limits === undefined){
			channel.limits = {};
		}
		for(var k in channel.keySettings){
			channel.limits[k] = [undefined, undefined];
		}
		for(var j in channel.rows){
			var row = channel.rows[j]
			var isVisible = true;
			// TODO determine if item is within common limits. row.reduce()
			if(isVisible){
				for(var k in channel.keySettings){
					var key = channel.keySettings[k];
					if(channel.limits[k][0] === undefined || channel.limits[k][0] > row[key] ){
						channel.limits[k][0] = row[key]
					}
					if(channel.limits[k][1] === undefined || channel.limits[k][1] < row[key] ){
						channel.limits[k][1] = row[key]
					}
				}
			}
			
		}
	}

	for(var i in this.channels){
		var channel = this.channels[i];
		for(var k in channel.keySettings){
			if(tempLimits[k] === undefined){
				tempLimits[k] = [channel.limits[k][0], channel.limits[k][1]];
			}
			else{
				if(tempLimits[k][0] > channel.limits[k][0]){
					tempLimits[k][0] = channel.limits[k][0];
				}
				if(tempLimits[k][1] < channel.limits[k][1]){
					tempLimits[k][1] = channel.limits[k][1];
				}
			} 
		}
	}

	for(var i in tempLimits){
		if(this.limits[i][0] !== undefined){
			tempLimits[i][0] = this.limits[i][0];
		}
		if(this.limits[i][1] !== undefined){
			tempLimits[i][1] = this.limits[i][1];
		}
	}

	var basis = {};
	for(var i in tempLimits){
		basis[i] = (this.canvasLimits[i][1] - this.canvasLimits[i][0]) / (tempLimits[i][1] - tempLimits[i][0]);
	}
	

	for(var i in this.channels){
		var channel = this.channels[i];
		
		for(var j in channel.rows){
			var row = channel.rows[j];
			var ks = channel.keySettings;
			var pointElement = new SVGElement({
				tagName:'circle',
			});
			//pointElement.setAttribute('cx', pointB.x);
			//pointElement.setAttribute('cy', pointB.y);
			//pointElement.setAttribute('r', pointB.r);
			if(ks.x === undefined){
				continue;
			}
			else{
				pointElement.setAttribute('cx', this.canvasLimits.x[0] + basis.x * (row[ks.x] - tempLimits.x[0]));
			}
			if(ks.y === undefined){
				continue;
			}
			else{
				pointElement.setAttribute('cy', this.canvasLimits.y[0] + basis.y * (row[ks.y] - tempLimits.y[0]));
			}
			if(ks.r === undefined){
				if(this.defaultsB.r === undefined){
					continue;
				}
				else{
					pointElement.setAttribute('r', this.defaultsB.r);
				}
			}
			else{
				pointElement.setAttribute('r', this.canvasLimits.r[0] + basis.r * (row[ks.r] - tempLimits.r[0]));
			}
			if(ks.o === undefined){
				if(this.defaultsB.o === undefined){
					continue;
				}
				else{
					pointElement.e.style.opacity = this.defaultsB.o;
				}
			}
			else{
				pointElement.e.style.opacity = this.canvasLimits.o[0] + basis.o * (row[ks.o] - tempLimits.o[0]);
			}
			var color = {};
			if(ks.cR === undefined){
				if(this.defaultsB.cR === undefined){
					continue;
				}
				else{
					color.r = this.defaultsB.cR;
				}
			}
			else{
				color.r = this.canvasLimits.cR[0] + basis.cR * (row[ks.cR] - tempLimits.cR[0]);
			}
			if(ks.cG === undefined){
				if(this.defaultsB.cG === undefined){
					continue;
				}
				else{
					color.g = this.defaultsB.cG;
				}
			}
			else{
				color.g = this.canvasLimits.cG[0] + basis.cG * (row[ks.cG] - tempLimits.cG[0]);
			}
			if(ks.cB === undefined){
				if(this.defaultsB.cB === undefined){
					continue;
				}
				else{
					color.b = this.defaultsB.cB;
				}
			}
			else{
				color.b = this.canvasLimits.cB[0] + basis.cB * (row[ks.cB] - tempLimits.cB[0]);
			}
			for(var i in color){
				color[i] = Math.round(color[i]);
			}
			pointElement.setAttribute('fill', 'rgb('+color.r+','+color.g+','+color.b+')');
			this.append(pointElement);
			
			
		}
	}
}

function ChartConfig(args){
	this.config = {};
	args = args || {};
	args.columns = args.columns || {};
	args.ranges = args.ranges || {};
	for(var i in args.columns){
		this.set(i, args.columns[i]);
	}
	for(var i in args.ranges){
		this.setRange(i, args.ranges[i]);
	}
}

ChartConfig.prototype.set = function(key, column, range){
	//if(range === undefined)
	if(this.config[key] === undefined){
		this.config[key] = {};
	}
	this.config[key].column = column;
	this.setRange(key, range);
}

ChartConfig.prototype.setRange = function(key, range){
	//if(range === undefined)
	if(this.config[key] === undefined){
		return;
		//throw "No such dimension";
	}
	if(range instanceof RangeModel){
		this.config[key].range = range;
	}
}

function ChartBase(args){
	var self;
	args = args || {};
	args.tagName = 'g';
	SVGElement.call(this, args);
	self = this;
	//SVGElement.call(this,args);
	this.addClass('chart');
	this.physicalLimits = {};
	this.virtualLimits = {};
	this.defaults = {};
	this.channels = [];
	this.mandatoryKeys = [];
	this.optionalKeys = [];
	this.allKeys = [];
	this.setData(args.data);
	this.applyTo(args.canvas);
}

ChartBase.prototype = Object.create(SVGElement.prototype);

ChartBase.defaultColors = ['blue', 'red', 'green', 'black', 'indigo'];

ChartBase.prototype.setData = function(data){
	if(data instanceof DataTableModel){
		this.data = data;
	}
};

ChartBase.prototype.applyTo = function(canvas){
	if(canvas instanceof ChartCanvas){
		canvas.svg.append(this);
		this.canvas = canvas;
	}
};

ChartBase.prototype.addChannel = function(ch){
	if(ch.color === undefined ){
		try{
			ch.color = ChartBase.defaultColors[this.channels.length];
		}
		catch(e){
			ch.color = 'black';
		}
		
	}
	this.channels.push(ch)
};

ChartBase.prototype.filterData = function(){
	var rows = this.data.get();
	for(var i in this.channels){
		this.channels[i].tmpData = [];
	}
	for(var i in rows){
		var row = rows[i];
		//console.log("Row is ", row);
		for(var j in this.channels){
			var channel = this.channels[j];
			var ok = true;
			for(var k in channel.keySettings){
				var key = channel.keySettings[k];
				if(row[key] !== undefined && row[key] !== null){
					
				}
				else{
					ok = false;
				}
			}
			if(ok){
				channel.tmpData.push(row);
			}
		}
	}
};

ChartBase.prototype.calculateLimits = function(){
	var vl = this.virtualLimits;
	var data = this.data.get();
	var tempLimits = {};
	var channel;
	for(var i in this.channels){
		var channel = this.channels[i];
		channel.tmpCount = 0;
		if(channel.tmpLimits === undefined){
			channel.tmpLimits = {};
		}
		for(var ki in this.allKeys){
			var k = this.allKeys[ki];
			if(typeof channel[k] === "string"){
				channel.tmpLimits[k] = [undefined, undefined];
			}
		}
	}
	
	for (var i in data){
		var row = data[i];
		for (var ch in this.channels){
			var channel = this.channels[ch];
			var isVisible = true;
			for(var ki in this.allKeys){
				var k = this.allKeys[ki];
				if(typeof channel[k] === "string"){
					var key = channel[k];
					if(row[key] === undefined){
						isVisible = false;
					}
					else if(this.virtualLimits[k][0] !== undefined && row[key] < this.virtualLimits[k][0]){
						isVisible = false;
					}
					else if(this.virtualLimits[k][1] !== undefined && row[key] > this.virtualLimits[k][1]){
						isVisible = false;
					}
				}
				
			}


			// TODO determine if item is within common limits. row.reduce()
			if(isVisible){
				channel.tmpCount += 1;
				for(var ki in this.allKeys){
					var k = this.allKeys[ki];

					if(typeof channel[k] === "string"){
						var key = channel[k];
						if(channel.tmpLimits[k][0] === undefined || channel.tmpLimits[k][0] > row[key] ){
							channel.tmpLimits[k][0] = row[key]
						}
						if(channel.tmpLimits[k][1] === undefined || channel.tmpLimits[k][1] < row[key] ){
							channel.tmpLimits[k][1] = row[key]
						}
					}
					
				}
			}
		}
	}

	for(var i in this.channels){
		var channel = this.channels[i];
		//console.log("COUNT", channel.tmpCount);
		for(var ki in this.allKeys){
			var k = this.allKeys[ki];
			if(typeof channel[k] === "string"){
				if(tempLimits[k] === undefined){
					tempLimits[k] = [channel.tmpLimits[k][0], channel.tmpLimits[k][1]];
				}
				else{
					if(tempLimits[k][0] > channel.tmpLimits[k][0]){
						tempLimits[k][0] = channel.tmpLimits[k][0];
					}
					if(tempLimits[k][1] < channel.tmpLimits[k][1]){
						tempLimits[k][1] = channel.tmpLimits[k][1];
					}
				} 
			}
			
		}
	}

	for(var i in tempLimits){
		if(this.virtualLimits[i][0] !== undefined){
			tempLimits[i][0] = this.virtualLimits[i][0];
		}
		if(this.virtualLimits[i][1] !== undefined){
			tempLimits[i][1] = this.virtualLimits[i][1];
		}
	}
	this.tmpLimits = tempLimits;
};

ChartBase.prototype.calculateBasis = function(){
	var basis = {};
	for(var i in this.tmpLimits){
		basis[i] = (this.physicalLimits[i][1] - this.physicalLimits[i][0]) / (this.tmpLimits[i][1] - this.tmpLimits[i][0]);
	}
	this.tmpBasis = basis;
};

function ChartLine(args){
	ChartBase.call(this, args);
	this.physicalLimits = {
		x:[0, undefined],
		y:[undefined, 0],
	}
	this.virtualLimits = {
		x:[undefined, undefined],
		y:[undefined, undefined],
		r:[undefined, undefined],
	}

	this.defaults = {
		x:undefined,
		y:undefined
	}

	this.allKeys = ['x', 'y'];
}

ChartLine.prototype = Object.create(ChartBase.prototype);

ChartLine.prototype.draw = function(){
	var data = this.data.get();
	var tmp, x, y;
	var pathInitialized = false;
	this.physicalLimits.x[1] = this.canvas.$.width();
	this.physicalLimits.y[0] = this.canvas.$.height();
	this.calculateLimits();
	this.calculateBasis();
	
	for(var i in this.channels){
		var channel = this.channels[i];
		if(channel.tmpPath === undefined){
			channel.tmpPath = new SVGElement({
				tagName:'path',
				className:'line',
			});
			channel.tmpPath.setAttribute('fill-opacity', '0');
			channel.tmpPath.addClass("content-" + channel.color);
			//x = this.physicalLimits.x[0] + this.tmpBasis.x * (data[0])
			this.append(channel.tmpPath);
		}
		channel.tmpPathString = "";
		channel.tmpPathInitialized = false;
	}
	if(isNaN(this.tmpBasis.x)){
		;
	}
	else if(isNaN(this.tmpBasis.y)){
		;
	}
	else{
		for (var i in data){
			var row = data[i];
			for (var j in this.channels){
				var channel = this.channels[j];
				if(channel.x === undefined){
					continue;
				}
				else{
					x = this.physicalLimits.x[0] + this.tmpBasis.x * (row[channel.x] - this.tmpLimits.x[0]);
					//pointElement.setAttribute('cx', this.canvasLimits.x[0] + basis.x * (row[channel.x] - tempLimits.x[0]));
				}
				if(channel.y === undefined){
					continue;
				}
				else{
					y = this.physicalLimits.y[0] + this.tmpBasis.y * (row[channel.y] - this.tmpLimits.y[0]);
					//pointElement.setAttribute('cy', this.canvasLimits.y[0] + basis.y * (row[channel.y] - tempLimits.y[0]));
				}
				if(!channel.tmpPathInitialized){
					channel.tmpPathString = "M " + x + " " + y;
					channel.tmpPathInitialized = true;
				}
				channel.tmpPathString += " L " + x + " " + y;
			}
		}
	}
	
	for(var i in this.channels){
		var channel = this.channels[i];
		channel.tmpPath.setAttribute("d", channel.tmpPathString);
	}
};