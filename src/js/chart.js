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
	if(this.relevantDims.indexOf(dim) === -1){
		console.log("Dimension "+dim+" is not relevant.");
		return;
	}
	if(typeof dim === "string" && typeof col === "string"){
		this.dims[dim] = col;
		if(this.ranges[dim] == null){
			this.setRange(dim, new ChartRange());
		}
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
		if(range.min == null || range.min == Number.NEGATIVE_INFINITY){
			range.min = calcRange.min;
		}
		if(range.max == null || range.max == Number.POSITIVE_INFINITY){
			range.max = calcRange.max;
		}
	}
}


Chart.prototype.draw = function(){
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
	args = args || {};
	this.filter('set', function(d){
		if(typeof d.value !== "object"){
			d.value = {};
		}
		return d;
	});
	Model.call(this, args);
	this.min = args.min;
	this.max = args.max;
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
		if(isNaN(Number(val))){
			this.value.min = Number.NEGATIVE_INFINITY;
		}
		else{
			this.value.min = Number(val);
		}	
	}
});

Object.defineProperty(ChartRange.prototype, 'max', {
	get: function(){
		return Number(this.value.max);
	},
	set: function(val){
		if(isNaN(Number(val))){
			this.value.max = Number.POSITIVE_INFINITY;
		}
		else{
			this.value.max = Number(val);
		}	
	}
});

function LineChart(args){
	Chart.call(this, args);
}

LineChart.prototype = Object.create(Chart.prototype);

LineChart.prototype.relevantDims = ['x', 'y'];

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

BubbleChart.prototype.relevantDims = ['x', 'y', 'a', 'o'];

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
	cr.a = {
		min:Math.max( ( 0.0001 * area ) / Math.PI, 2),
		max:Math.max( ( 0.002 * area ) / Math.PI, 5)
	}
	cr.a['default'] = cr.a.min;
	cr.o = {
		min: 0.2,
		max: 0.8,
		'default': 0.5,
	};
	return this.calculatedPhysicalRanges;
}

BubbleChart.prototype.render = function(){
	var data = this.data.get();
	var tmp, x, y, a, o, path="";
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
			var titleElement = new SVGElement({
				tagName:'title',
			});
			pointElement.append(titleElement);
			var title = "";
			pointElement.addClass("content-"+this.color);
			pointElement.setAttribute('title', "TEST");
			//pointElement.setAttribute('stroke-');
			if(this.dims.x == null){
				continue;
			}
			else{
				val = row[this.dims['x']];
				start = this.ranges['x'].min;
				x = physRanges.x.min + basis.x * (val - start);
				pointElement.setAttribute('cx', x);
				title += this.dims['x'] + ": " + val + "\n";
			}
			if(this.dims.y == null){
				continue;
			}
			else{
				val = row[this.dims['y']];
				start = this.ranges['y'].min;
				y = physRanges.y.min + basis.y * (val - start);
				pointElement.setAttribute('cy', y);
				title += this.dims['y'] + ": " + val + "\n";
			}
			// Area
			if(this.dims.a == null){
				a = Math.pow(physRanges.a['default'], 0.5);
				pointElement.setAttribute('r', a);
			}
			else{
				val = row[this.dims['a']];
				start = this.ranges['a'].min;
				a = physRanges.a.min + basis.a * (val - start);
				a = Math.pow(a, 0.5);
				pointElement.setAttribute('r', a);
				title += this.dims['a'] + ": " + val + "\n";
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
				title += this.dims['o'] + ": " + val + "\n";
			}
			titleElement.e.innerHTML = title;
			this.container.append(pointElement);
		}
	}
}
