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

ChartCanvas.prototype.getWidth = function(){
	return this.$.width();
}

ChartCanvas.prototype.getHeight = function(){
	return this.$.height();
}

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

function Chart(args){
	var args = args || {};
	this.ranges = {};
	this.dims = {};
	if(typeof args.dims === "object"){
		for (var i in args.dims){
			this.setDim(i, args.dims[i]);
		}
	}
	if(args.data != null){
		this.setData(args.data);
	}
	if(args.canvas != null){
		this.setCanvas(args.canvas);
	}
	if(typeof args.color === "string"){
		this.color = args.color;
	}
	else{
		this.color = Chart.getColor();
	}
}

Chart.colors = ['blue', 'red', 'green', 'black', 'indigo'];

Chart.colorIndex = 0;

Chart.getColor = function(){
	var out = this.colors[this.colorIndex];
	if(this.colorIndex + 1 === this.colors.length){
		this.colorIndex = 0;
	}
	else{
		this.colorIndex = this.colorIndex + 1;
	}
	return out;
}

Chart.prototype.relevantDims = [];

Chart.prototype.setCanvas = function(canvas){
	if(canvas instanceof ChartCanvas){
		// TODO clean-up
		this.canvas = canvas;
		this.container = new SVGElement({
			tagName:'g',
			className:'chart',
		});
		this.canvas.svg.append(this.container);
	}
}

Chart.prototype.setData = function(data){
	if(data instanceof DataTableModel){
		this.data = data;
	}
	else{
		throw "Error";
	}
}

Chart.prototype.hasDim = function(dim){
	return typeof dim === "string" && typeof col === "string";
}

Chart.prototype.setDim = function(dim, col){
	if(typeof dim === "string" && typeof col === "string"){
		this.dims[dim] = col;
	}
}

Chart.prototype.setRange = function(dim, range){
	if(typeof dim === "string" && range instanceof ChartRange){
		this.ranges[dim] = range;
	}
}

Chart.prototype.calculatePhysicalRanges = function(){
	if(!(this.canvas instanceof ChartCanvas)){
		throw("Error: Canvas is not set.")
	}
	this.calculatedPhysicalRanges = {
		x:[0, this.canvas.getWidth()],
		y:[this.canvas.getHeight(), 0],
	};
	return this.calculatedPhysicalRanges;
}

Chart.prototype.calculateBasis = function(){
	var physRanges = this.calculatePhysicalRanges();
	this.calculatedBasis = {};
	for(var dim in physRanges){
		if(this.ranges[dim] != null){
			var range = this.ranges[dim];
			var min = range.min;
			var max = range.max;
			this.calculatedBasis[dim] = (physRanges[dim].max - physRanges[dim].min) / (max -min);
		}		
	}
	return this.calculatedBasis;
}

Chart.prototype.calculateRanges = function(){
	var vl = this.virtualLimits;
	var data = this.data.get();
	var tempLimits = {};
	var channel;
	this.calculatedRanges = {};
	var calcRanges = this.calculatedRanges;
	var ranges = this.ranges;
	for(var dim in this.dims){
		if(calcRanges[dim] == null){
			calcRanges[dim] = {}
		}	
	}
	
	for (var i in data){
		var row = data[i];
		var isVisible = true;
		for(var dim in ranges){
			var key = this.dims[dim];
			var range = ranges[dim];
			if(row[key] == null){
				isVisible = false;
			}
			else if(range.min != null && row[key] < range.min){
				isVisible = false;
			}
			else if(range.max != null && row[key] > range.max){
				isVisible = false;
			}
		}


		// TODO determine if item is within common limits. row.reduce()
		if(isVisible){
			for (var dim in this.dims){
				var key = this.dims[dim];
				var range = calcRanges[dim];
				if(range.min == null || range.min > row[key] ){
					range.min = row[key];
				}
				if(range.max == null || range.max < row[key] ){
					range.max = row[key]
				}
			}
		}
	}
}

Chart.prototype.applyCalculatedRanges = function(){
	for (var dim in this.calculatedRanges){
		if(this.ranges[dim] == null){
			this.ranges[dim] = {};
		}
		var range = this.ranges[dim];
		var calcRange = this.calculatedRanges[dim];
		if(range.min == null){
			range.min = calcRange.min;
		}
		if(range.max == null){
			range.max = calcRange.max;
		}
	}
}


LineChart.prototype.draw = function(){
	this.calculateRanges();
	this.applyCalculatedRanges();
	this.calculateBasis();
	this.render();
}


function ChartGroup(args){
	this.charts = [];
}

ChartGroup.prototype.add = function(chart){
	for(var arg in arguments){
		if(arguments[arg] instanceof Chart){
			this.charts.push(arguments[arg]);
		}
	}
	return this;
}

ChartGroup.prototype.draw = function(){
	for(var i in this.charts){
		var chart = this.charts[i];
		chart.calculateRanges();
	}

	for(var i in this.charts){
		var chart = this.charts[i];
		chart.applyCalculatedRanges();
	}

	for(var i in this.charts){
		var chart = this.charts[i];
		chart.calculateBasis();
		chart.render();
	}
}

function ChartRange(args){
	var self = this;
	this.filter('set', function(d){
		if(typeof d.value !== "object"){
			d.value = {};
		}
		return d;
	});
	Model.call(this, args);
}

ChartRange.prototype = Object.create(Model.prototype);

ChartRange.prototype.setMin = function(val){
	this.value.min = val;
}

ChartRange.prototype.setMax = function(val){
	this.value.max = val;
}

ChartRange.prototype.getMin = function(){
	return this.value.min;
}

ChartRange.prototype.getMax = function(){
	return this.value.max;
}

Object.defineProperty(ChartRange.prototype, 'min', {
	get: function(){
		return Number(this.value.min);
	},
	set: function(val){
		this.value.min = val;
	}
});

Object.defineProperty(ChartRange.prototype, 'max', {
	get: function(){
		return Number(this.value.max);
	},
	set: function(val){
		this.value.max = val;
	}
});

function LineChart(args){
	Chart.call(this, args);
}

LineChart.prototype = Object.create(Chart.prototype);

LineChart.prototype.calculatePhysicalRanges = function(){
	if(!(this.canvas instanceof ChartCanvas)){
		throw("Error: Canvas is not set.")
	}
	this.calculatedPhysicalRanges = {
		x:{
			min: 0, 
			max: this.canvas.getWidth()
		},
		y:{
			min: this.canvas.getHeight(), 
			max: 0
		},
	};
	return this.calculatedPhysicalRanges;
}

LineChart.prototype.render = function(){
	var data = this.data.get();
	var tmp, x, y, path="";
	var pathInitialized = false;
	var ranges = this.ranges;
	var basis = this.calculatedBasis;
	var physRanges = this.calculatedPhysicalRanges;
	if(this.path == null){
		this.path = new SVGElement({
			tagName:'path',
			className:'line',
		});
		this.path.setAttribute('fill-opacity', '0');
		this.path.addClass("content-" + ( this.color || "blue" ) );
		//x = this.physicalLimits.x[0] + this.tmpBasis.x * (data[0])

		// this.bgpath = new SVGElement({
		// 	tagName:'path',
		// 	className:'line-bg',
		// });
		// this.bgpath.setAttribute('fill-opacity', '.5');
		// this.bgpath.addClass("content-" + ( this.color || "blue" ) );
		// //x = this.physicalLimits.x[0] + this.tmpBasis.x * (data[0])
		// this.container.append(this.bgpath);

		this.container.append(this.path);
	}

	//var bgpath = " M " + physRanges.x.min + " " + physRanges.y.min;

	if(true){
		for (var i in data){
			var row = data[i];
			var col;
			var val;
			var start;
			if(this.dims.x == null){
				continue;
			}
			else{
				val = row[this.dims['x']];
				start = this.ranges['x'].min;
				x = physRanges.x.min + basis.x * (val - start);
				//pointElement.setAttribute('cx', this.canvasLimits.x[0] + basis.x * (row[channel.x] - tempLimits.x[0]));
			}
			if(this.dims.y == null){
				continue;
			}
			else{
				val = row[this.dims['y']];
				start = this.ranges['y'].min;
				y = physRanges.y.min + basis.y * (val - start);
				//pointElement.setAttribute('cy', this.canvasLimits.y[0] + basis.y * (row[channel.y] - tempLimits.y[0]));
			}
			if(!pathInitialized){
				path += " M " + x + " " + y;
				pathInitialized = true;
			}
			path += " L " + x + " " + y;
			//bgpath += " L " + x + " " + y;
		}
	}

	//bgpath += " L " + physRanges.x.max + " " + physRanges.y.min;

	this.path.setAttribute("d", path);
	//this.bgpath.setAttribute("d", bgpath);
}

function BubbleChart(args){
	Chart.call(this, args);
}

BubbleChart.prototype = Object.create(Chart.prototype);

BubbleChart.prototype.calculatePhysicalRanges = function(){
	var area, cr;
	if(!(this.canvas instanceof ChartCanvas)){
		throw("Error: Canvas is not set.")
	}
	this.calculatedPhysicalRanges = {
		x:{
			min: 0, 
			max: this.canvas.getWidth()
		},
		y:{
			min: this.canvas.getHeight(), 
			max: 0
		},
	};
	cr = this.calculatedPhysicalRanges;
	area = Math.abs((cr.x.max - cr.x.min) * (cr.y.max - cr.y.min));
	cr.r = {
		min:Math.max(Math.pow(( (0.0001 * area) / Math.PI ) , 0.5),2),
		max:Math.max(Math.pow(( (0.01 * area) / Math.PI ) , 0.5),5)
	}
	cr.r['default'] = cr.r.min;
	cr.o = {
		min: 0.2,
		max: 0.8,
		'default': 0.5,
	};
	return this.calculatedPhysicalRanges;
}

BubbleChart.prototype.render = function(){
	var data = this.data.get();
	var tmp, x, y, r, path="";
	var pathInitialized = false;
	var ranges = this.ranges;
	var basis = this.calculatedBasis;
	var physRanges = this.calculatedPhysicalRanges;

	while(this.container.e.firstChild){
		this.container.e.removeChild(this.container.e.firstChild);
	}

	if(true){
		for (var i in data){
			var row = data[i];
			var col;
			var val;
			var start;
			var pointElement = new SVGElement({
				tagName:'circle',
				className: 'bubble'
			});
			pointElement.addClass("content-"+this.color);
			//pointElement.setAttribute('stroke-');
			if(this.dims.x == null){
				continue;
			}
			else{
				val = row[this.dims['x']];
				start = this.ranges['x'].min;
				x = physRanges.x.min + basis.x * (val - start);
				pointElement.setAttribute('cx', x);
			}
			if(this.dims.y == null){
				continue;
			}
			else{
				val = row[this.dims['y']];
				start = this.ranges['y'].min;
				y = physRanges.y.min + basis.y * (val - start);
				pointElement.setAttribute('cy', y);
			}
			// Radius
			if(this.dims.r == null){
				pointElement.setAttribute('r', physRanges.r['default']);
			}
			else{
				val = row[this.dims['r']];
				start = this.ranges['r'].min;
				r = physRanges.r.min + basis.r * (val - start);
				pointElement.setAttribute('r', r);
			}
			// Opacity
			if(this.dims.o == null){
				pointElement.setAttribute('fill-opacity', physRanges.o['default'] );
			}
			else{
				val = row[this.dims['o']];
				start = this.ranges['o'].min;
				o = physRanges.o.min + basis.o * (val - start);
				pointElement.setAttribute('fill-opacity', o);
			}
			this.container.append(pointElement);
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

ChartConfig.prototype.getColumn = function(dimension){
	return this.config[dimension].column;
}

ChartConfig.prototype.getRange = function(dimension){
	return this.config[dimension].range;
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
	else{
		this.config[key].range = new RangeModel();
	}
}

ChartConfig.prototype.forEachDimension = function(callback){
	for (var i in this.config){
		if(typeof callback === "function"){
			callback(i, this.config[i]);
		}
	}
}

ChartConfig.prototype.hasDimension = function(dimension){
	if(typeof this.config[dimension] === "object"){
		return true;
	}
	else{
		return false;
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

ChartBase.prototype.setCanvas = function(canvas){
	if(canvas instanceof ChartCanvas){
		canvas.svg.append(this);
		this.canvas = canvas;
	}
};

ChartBase.prototype.applyTo = ChartBase.prototype.setCanvas;

ChartBase.prototype.addChannel = function(ch){
	if(ch instanceof ChartConfig){
		if(ch.color === undefined ){
			try{
				ch.color = ChartBase.defaultColors[this.channels.length];
			}
			catch(e){
				ch.color = 'black';
			}
			
		}
		this.channels.push(ch);
	}
	
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
		channel.tmpLimits = {};

		for(var ki in this.allKeys){
			var k = this.allKeys[ki];
			if(channel.hasDimension(k)){
				channel.tmpLimits[k] = [undefined, undefined];
				channel.getRange(k).tmp = [undefined, undefined];
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
				if(channel.hasDimension(k)){
					var key = channel.getColumn(k);
					var range = channel.getRange(k);
					var min = range.getMin();
					var max = range.getMax();
					if(row[key] === undefined){
						isVisible = false;
					}
					else if(min !== undefined && row[key] < min){
						isVisible = false;
					}
					else if(max !== undefined && row[key] > max){
						isVisible = false;
					}
				}
				
			}


			// TODO determine if item is within common limits. row.reduce()
			if(isVisible){
				channel.tmpCount += 1;
				for(var ki in this.allKeys){
					var k = this.allKeys[ki];

					if(channel.hasDimension(k)){
						var key = channel.getColumn(k);
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
			if(channel.hasDimension(k)){
				var range = channel.getRange(k);
				var min = range.tmp[0];
				var max = range.tmp[1];
				if(min === undefined || min > channel.tmpLimits[k][0]){
					range.tmp[0] = channel.tmpLimits[k][0];
				}
				if(max === undefined || max < channel.tmpLimits[k][1]){
					range.tmp[1] = channel.tmpLimits[k][1];
				}
			}
			
		}
	}

	for(var i in this.channels){
		var channel = this.channels[i];
		//console.log("COUNT", channel.tmpCount);
		for(var ki in this.allKeys){
			var k = this.allKeys[ki];
			if(channel.hasDimension(k)){
				var range = channel.getRange(k);
				var min = range.getMin();
				var max = range.getMax();
				if(min !== undefined){
					range.tmp[0] = min;
				}
				if(max !== undefined){
					range.tmp[1] = max;
				}
			}
		}
	}
};

ChartBase.prototype.calculateBasis = function(){
	for(var i in this.channels){
		var channel = this.channels[i];
		channel.tmpBasis = {};
		for(var ki in this.allKeys){
			var k = this.allKeys[ki];
			if(channel.hasDimension(k)){
				var range = channel.getRange(k);
				var min = range.tmp[0];
				var max = range.tmp[1];
				channel.tmpBasis[k] = (this.physicalLimits[k][1] - this.physicalLimits[k][0]) / (max -min);
			}
		}
	}
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
	if(true){
		for (var i in data){
			var row = data[i];
			var col;
			var val;
			var start;
			for (var j in this.channels){
				var channel = this.channels[j];
				if(!channel.hasDimension('y')){
					continue;
				}
				else{
					val = row[channel.getColumn('x')];
					start = channel.getRange('x').tmp[0];
					x = this.physicalLimits.x[0] + channel.tmpBasis.x * (val - start);
					//pointElement.setAttribute('cx', this.canvasLimits.x[0] + basis.x * (row[channel.x] - tempLimits.x[0]));
				}
				if(!channel.hasDimension('y')){
					continue;
				}
				else{
					val = row[channel.getColumn('y')];
					start = channel.getRange('y').tmp[0];
					y = this.physicalLimits.y[0] + channel.tmpBasis.y * (val - start);
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