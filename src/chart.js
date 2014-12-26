function ChartCanvas(args){
	var self = this;
	args=args?args:{};
	args.share = args.share || 1;
	args.contentDirection = 'vertical';
	Container.call(this,args);
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

function ChartLine(args){
	var self = this;
	args = args || {};
	args.tagName = 'g';
	SVGElement.call(this,args);
	this.addClass('chart-line');

	this.limits = new Value();
	this.path = new SVGElement({
		tagName:'path',
		className:'line',
	});
	this.append(this.path);
}

ChartLine.prototype = Object.create(SVGElement.prototype);

ChartLine.prototype.applyTo = function(canvas){
	if(canvas instanceof ChartCanvas){
		canvas.svg.append(this);
		this.canvas = canvas;
	}
};

ChartLine.prototype.setData = function(data){
	if(data instanceof DataTableModel){
		this.data = data;
	}
}

ChartLine.prototype.getCanvasSize = function(){
	if(this.canvas instanceof ChartCanvas){
		return {
			width:this.canvas.$.width(),
			height:this.canvas.$.height(),
		}
	}
};

ChartLine.prototype.draw = function(){
	var self = this;
	var canvasSize = this.getCanvasSize();
	var limits = this.limits.get();
	var limits = {
		top:10,
		right:10,
		bottom:0,
		left:0,
	}
	var pxpu = { // Pixels per unit
		x:canvasSize.width / (limits.right - limits.left),
		y:canvasSize.height / (limits.top - limits.bottom),
	};

	var data = this.data.get();

	var path = "";

	var x,y;
	if(typeof this.x === 'string'){
		x = function(row){
			return row[self.x]
		};
	}
	else if(typeof this.x === 'function'){
		x = this.x;
	}
	else{
		x = function(row, i){
			return i;
		}
	}
	if(typeof this.y === 'string'){
		y = function(row){
			return row[self.y]
		};
	}
	else if(typeof this.y === 'function'){
		y = this.y;
	}
	else{
		y = function(row, i){
			return i;
		}
	}

	path += 'M ' + (( x(data[0],0) - limits.left ) * pxpu.x) + ' ' + (( y(data[0],0) - limits.bottom ) * pxpu.y);

	for (var i in data){
		var posX = ( x(data[i],i) - limits.left ) * pxpu.x;
		var posY = ( y(data[i],i) - limits.bottom ) * pxpu.y;
		if(typeof posX !== 'undefined' && typeof posY !== 'undefined'){
			path += ' L '+posX+' '+posY;
		}
		
	}
	this.path.setAttribute('d', path);

};

function DataTableChart(args){
	var self = this;
	args = args || {};
	args.tagName = 'g';
	SVGElement.call(this,args);
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
};

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
};

DataTableChart.prototype.getActiveKeys = function(){
	return ['x', 'y', 'r'];
}

DataTableChart.prototype.addChannel = function(ch){
	var channel = {};
	ch = ch || {};
	channel.keySettings = ch;
	this.channels.push(channel);
}

DataTableChart.prototype.processLimits = function(){

};

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
};

