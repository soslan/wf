function Container(args){
	var self = this;
	args = args?args:{};
	Element.call(this,args);
	this.addClass("container");
	this.contentType = new Value({
		//value: "blocks",
	});

	this.displayType = new Value({
		//value: "new-line",
	});

	this.hidden = new BooleanModel({
		value:false,
	});
	this.displayed = new BooleanModel({
		value:true,
	});
	this.displayed.adaptTo(this.hidden, function(args){
		return !args[0].get();
	});
	this.hidden.adaptTo(this.displayed, function(args){
		return !args[0].get();
	});

	//this.displayed.addFilter

	this.position = this.displayType;

	this.maximized = new BooleanModel(true);
	this.share = new Value();

	this.contentDirection = new Value();

	this.maximized.addEventListener('change',function(d){
		if(d.value){
			self.element.style.flex = self.share.get();
		}
		else{
			self.element.style.flex = '';
		}
	});

	this.hidden.onTrue(function(){
		self.addClass('hidden');
		self.dispatchEvent('hidden');
	});

	this.hidden.onFalse(function(){
		/*var displayType = self.displayType.get();
		if(displayType === 'unmaximized'){
			//self.parent.
		}
		else if(displayType === 'maximized'){
			if(typeof self.parent.activeMaximizedContainer !== 'undefined'){
				self.parent.activeMaximizedContainer.hide();
			}
			else if(typeof self.parent.activeContainer !== 'undefined'){
				self.parent.activeContainer.hide();
			}
			if(typeof self.parent.activeUnmaximizedContainers !== 'undefined'){
				for (i in self.parent.activeUnmaximizedContainers){
					self.parent.activeUnmaximizedContainers[i].hide();
				}
			}
			self.parent.activeMaximizedContainer = self;
			
		}*/
		self.dispatchEvent('before-displayed');
		self.removeClass('hidden');
		self.dispatchEvent('displayed');
	});

	this.contentDirection.addFilter('set', function(d){
		if(d.value == "horizontal" || d.value == "h"){
			d.value = "horizontal";
		}
		else{
			d.value = "vertical";
		}
		return d;
	});

	this.displayType.addFilter('set', function(d){
		if(Container.displayTypes.indexOf(d.value) == -1){
			d.cancel = true;
		}
		return d;
	});

	this.contentType.addFilter('set', function(d){
		if(d.value == "lines"){
			d.value = "lines";
		}
		else{
			d.value = "blocks";
		}
		return d;
	});

	this.contentDirection.addEventListener('change',function(){
		var direction = self.contentDirection.get();
		if(direction == "vertical"){
			self.element.classList.remove("content-direction-horizontal");
			self.addClass("content-direction-vertical");
		}
		else if(direction == "horizontal"){
			self.element.classList.remove("content-direction-vertical");
			self.addClass("content-direction-horizontal");
		}
	});

	if(args.flex){
		this.element.style.flex = args.flex;
	}

	if(args.hidden){
		this.hidden.true();
	}
	if(args.closeable){
		this.closeable = true;
	}

	//args.displayType = args.displayType || args.position;
	/*if(typeof args.contentType == "string"){
		if(args.contentType === "blocks"){
			this.contentType.set("blocks");
		}
		else if(args.contentType === "lines"){
			this.contentType.set("lines");
		}
	}
	if(typeof args.displayType == "string"){
		if(args.displayType === "inline"){
			this.displayType.set("inline");
		}
		else if(args.displayType === "new-line"){
			this.displayType.set("new-line");
		}
		else if(args.displayType === "none"){
			this.displayType.set("none");
		}
	}*/

	//this.contentType.addEventListener('change',onContentTypeOrPositionChange);
	//this.displayType.addEventListener('change',onContentTypeOrPositionChange);

	this.contentType.addEventListener('change',function(d){
		if(d.oldValue !== undefined){
			self.removeClass('content-type-' + d.oldValue);
		}
		self.addClass('content-type-'+d.value);
	});

	this.displayType.addEventListener('change',function(d){
		if(d.oldValue !== undefined){
			self.removeClass('display-type-' + d.oldValue);
		}
		self.addClass('display-type-'+d.value);
		if(d.oldValue === 'unmaximized'){
			if(d.value === 'unmaximized-pinned'){
				//var i = self.parent.activeUnmaximizedContainers.indexOf(self);
				//if(i != -1){
				//	self.parent.activeUnmaximizedContainers.splice(i,1);
				//}
				
			}
			else if(d.value === 'maximized'){
				var i = self.parent.activeUnmaximizedContainers.indexOf(self);
				self.parent.activeUnmaximizedContainers.splice(i,1);
				if(self.displayed.value){
					if(typeof self.parent.displayedMaximized !== 'undefined'){
						self.parent.displayedMaximized.hide();
					}
					self.parent.displayedMaximized = self;
				}

				self.$.css({
					'z-index':'',
					top:'',
					left:'',
				});
				self.notDraggable();
			}
		}
		else if(d.oldValue === 'unmaximized-pinned'){

		}
		else if(d.oldValue === 'maximized'){
			if(d.value === 'unmaximized' || d.value === 'unmaximized-pinned'){
				if(typeof self.parent.previousMaximized !== 'undefined'){
					self.parent.previousMaximized.show();
				}
				self.parent.activeUnmaximizedContainers.push(self);
				self.parent.displayedMaximized = self.parent.previousMaximized;
				self.parent.previousMaximized = undefined;
				self.draggable();
				self.$.css({
					//'z-inde'
					top:0,
					left:0,
				});
			}
		}
		else if(d.value === 'unmaximized' || d.value === 'unmaximized-pinned' || d.value === 'maximized'){
			//self.focusable();
			//self.addEventListener('focusin', function(){
				//self.top();
			//});
			self.e.addEventListener('mousedown', function(){
				self.parent.switchTo(self);
			}, true);
			if(d.value === 'unmaximized-pinned' || d.value === 'unmaximized'){
				self.draggable();
				self.$.css({
					//'z-inde'
					top:0,
					left:0,
				});
			}
			//self.draggable();
		}
	});
	//this.displayType.addEventListener('change',onContentTypeOrPositionChange);

	/*var onContentTypeOrPositionChange = function(){
		var c = self.contentType.get();
		var p = self.displayType.get();
		if(c === "blocks" && p === "inline"){
			self.element.style.display = 'inline-flex';
		}
		else if(c === "blocks" && p === "new-line"){
			self.element.style.display = 'flex';
		}
		else if(c === "lines" && p === "inline"){
			self.element.style.display = 'inline-block';
		}
		else if(c === "lines" && p === "new-line"){
			self.element.style.display = 'block';
		}
	};

	onContentTypeOrPositionChange();*/
	
	/*if(typeof args.direction === "string"){
		if(args.direction === "v"){
			this.contentDirection.set("vertical");
			this.addClass("content-direction-vertical");
			this.element.style.flexDirection = "column";
		}
		else if(args.direction === "h"){
			this.contentDirection.set("horizontal");
			this.addClass("content-direction-horizontal");
			this.element.style.flexDirection = "row";
		}
	}
	*/

	this.displayType.set({
		value:args.displayType || args.position || 'new-line',
	});

	this.contentType.set({
		value:args.contentType,
	});
	
	this.contentDirection.set({
		value:args.contentDirection,
	});

	if(typeof args.share === "number"){
		this.share.set({
			value:args.share,
		});
		if(args.maximized == undefined){
			this.maximized.set({
				value:true,
			});
		}
		else{
			this.maximized.set({
				value:args.maximized,
			});
		}
	}
	else{
		this.maximized.set({
			value:args.maximized,
		});
	}

	/*if(typeof args.share !== "undefined"){
		this.element.style.flex = args.share;
	}*/

	if(args.mode == "full"){
		this.addClass("container-full");
	}

	//this.container.appendChild(this.contentBlock);


}

Container.prototype = Object.create(Element.prototype);

Container.displayTypes = ['inline', 'new-line', 'unmaximized', 'maximized', 'unmaximized-pinned'];

Container.prototype.hide = function(){
	this.hidden.true();
};

Container.prototype.show = function(){
	this.hidden.false();
};

Container.prototype.setDisplayType = function(displayType){
	this.displayType.setValue(displayType);
	this.dispatchEvent('display-type-changed');
};

Container.prototype.getDisplayType = function(){
	return this.displayType.get();
};

Container.prototype.getHandle = function(args){
	args = args || {};
	args.container = this;
	var handle = new ContainerHandle(args);
	return handle;
};

Container.prototype.top = function(){
	if(this.displayType.value === 'unmaximized'){
		this.e.style.zIndex = this.parent.topZIndex + 1;
		this.parent.topZIndex += 1;
		if(this.parent.topWindow instanceof Element){
			this.parent.topWindow.dispatchEvent('untopped');
		}
		this.parent.topWindow = this;
		this.dispatchEvent('topped');
	}
};

Container.prototype.onHidden = function(handler){
	this.addEventListener('hidden', handler);
};


Container.prototype.onDisplayed = function(handler){
	this.addEventListener('displayed', handler);
};


Container.prototype.onClosed = function(handler){
	this.addEventListener('closed', handler);
};

function ContainerHandle(args){
	var self = this;
	args = args?args:{};
	Element.call(this,args);
	if(args.container === undefined){
		return;
	}
	this.focusable();
	this.container = args.container;
	this.addClass('container-handle');
	this.addClass(args.color);
	this.append(new Label({
		text:args.text || 'Container',
	}));
	if(this.container.maximized){
		this.addClass('container-handle-maximized');
	}

	this.container.on('activated', function(){
		self.addClass('active');
		self.removeClass('inactive');
	});
	this.container.on('deactivated', function(){
		self.addClass('inactive');
		self.removeClass('active');
	});
	this.container.on('closed',function(){
		self.close();
	});

	/*if(this.container.displayed.get()){
		self.addClass('active');
		self.removeClass('inactive');
	}*/

	this.addEventListener('focus', function(e){
		self.container.parent.switchTo(self.container);
	});

	/*this.$.on('touchstart mousedown', function(e){
		console.log(e.type);
		if(e.which === 1 || e.type === "touchstart"){
			if(self.container.parent.activeContainer == self.container){
				//if(container.displayType.value !== 'maximized'){
				//	//container
				//	container.parent.switchTo();
				//	container.hide();
				//}
			}
			else{
				self.container.parent.switchTo(self.container);
			}
		}
		
		e.preventDefault();
		//container.show();
	});*/

	if(args.closeable){
		var closeButton = new Button({
			icon:'times',
			className:'tab-close red quiet',
			action:function(e){
				//console.log("closeButton pressed");
				self.container.parent.remove(self.container);
			},
		});
		self.append(closeButton);
	}
	
}

ContainerHandle.prototype = Object.create(Element.prototype);


function ContainerStack(args){
	var self = this;
	args = args?args:{};
	Container.call(this,args);
	this.addClass('containers-stack');
	this.activeUnmaximizedContainers = [];
	this.containers = [];
	this.topZIndex = 200;
	this.activeContainer;
	this.activeMaximizedContainer = this.activeContainer;
}

ContainerStack.prototype = Object.create(Container.prototype);

ContainerStack.prototype.append = function(container){
	var self = this;
	var displayType;
	if (container.displayType === undefined){
		container.displayType = new Value({
			value:'maximized'
		});
	}
	if(['maximized', 'unmaximized', 'unmaximized-pinned'].indexOf(container.displayType.get()) == -1){
		container.displayType.setValue('maximized');
		displayType = 'maximized';
	}
	else{
		displayType = container.displayType.get();
	}

	if(displayType === 'unmaximized' || displayType === 'unmaximized-pinned'){
		if(typeof this.activeUnmaximizedContainers === 'undefined'){
			this.activeUnmaximizedContainers = [];
			this.topZIndex = 200;
		}
		this.activeUnmaximizedContainers.push(container);

	}

	if(this.activeContainer == undefined){
		this.switchTo(container);
	}
	else{
		container.hide();
	}

	container.parent = this;
	if(typeof container.windowMode === 'undefined'){
		container.windowMode = 'extended';
	}
	if(container.windowMode === 'unmaximized'){

	}
	else{
		this.containers.push(container);
		if(this.containers.length == 1){
			this.switchTo(container);
		}
		else{
			container.hide();
		}
	}
	
	
	Container.prototype.append.call(this, container);
	/*container.on('closed',function(){
		var i = self.containers.indexOf(container);
		self.containers.splice(i,1);
		if(self.activeContainer == container){
			if(i == 0){
				if(self.containers.length > 0){
					self.switchTo(self.containers[0]);
				}
			}
			else{
				self.switchTo(self.containers[i-1]);
			}
		}
		container.removeEventListener
	});*/
	this.dispatchEvent('container-added', {
		container:container,
	});
};

ContainerStack.prototype.remove = function(container){
	var i = this.containers.indexOf(container);
	if(i != -1){
		if(this.activeContainer == container){
			if(i == 0){
				if(this.containers.length > 0){
					this.switchTo(this.containers[0]);
				}
			}
			else{
				this.switchTo(this.containers[i-1]);
			}
		}
		//this.element.removeChild(container.element);
		container.close();
		this.containers.splice(i, 1);
	}
};

ContainerStack.prototype.getHandleFor = function(container, handleArgs){
	var self = this;
	var handle = new Element(handleArgs);
	handle.addClass('container-handle white');
	if(container.title === undefined){
		container.title = "Tab";
	}

	handle.append(new Label({
		text:container.title,
	}));
	if(container.hidden.get()){
		handle.addClass('inactive');
	}
	else{
		handle.addClass('active');
	}
	/*container.hidden.onTrue(function(){
		handle.addClass('inactive');
		handle.removeClass('active');
	});
	container.hidden.onFalse(function(){
		handle.addClass('active');
		handle.removeClass('inactive');
	});*/
	container.on('activated', function(){
		handle.addClass('active');
		handle.removeClass('inactive');
	});
	container.on('deactivated', function(){
		handle.addClass('inactive');
		handle.removeClass('active');
	});
	container.on('closed',function(){
		handle.close();
	});
	container.displayType.onChange(function(d){
		if(d.value === 'maximized'){
			handle.addClass('tab');
		}
		else if(d.value === 'unmaximized-pinned'){
			handle.addClass('pinned');
		}
		if(d.oldValue === 'maximized'){
			handle.removeClass('tab');
		}
		else if(d.oldValue === 'unmaximized-pinned'){
			handle.removeClass('pinned');
		}
	});
	handle.on('contextmenu', function(e){
		//e.stopPropagation();
		e.preventDefault();
	});
	handle.on('mousedown', function(e){
		//e.stopPropagation();
		handle.savedPos = e.pageY;
		handle.pressed = true;
		handle.moved = false;
		e.preventDefault();
		handle.wasActive = container.parent.activeContainer == container;
		var onMouseMove = function(e){
			if(handle.pressed){
				handle.moved = true;
				var shift = e.pageY - handle.savedPos;
				var displayType = container.displayType.value;
				if(displayType === 'unmaximized'){
					if(shift >=5){
						container.displayType.setValue('maximized');
						console.log('Maximized');
						handle.savedPos = handle.savedPos + 5;
					}else if(shift <= -5){
						container.displayType.setValue('unmaximized-pinned');
						console.log('Pinned');
						handle.savedPos = handle.savedPos - 5;
					}
				}
				else if(displayType === 'unmaximized-pinned'){
					if(shift >= 5){
						container.displayType.setValue('unmaximized');
						console.log('Unpinned');
						handle.savedPos = handle.savedPos + 5;
					}
				}
				else if(displayType === 'maximized'){
					if(shift <= -5){
						container.displayType.setValue('unmaximized');
						console.log('Unmaximized');
						handle.savedPos = handle.savedPos - 5;
					}
				}
				e.preventDefault();
			}
		};
		var onMouseUp = function(e){
			handle.pressed = false;
			document.removeEventListener(onMouseMove);
			document.removeEventListener(onMouseUp);
			if(!handle.moved && handle.wasActive){
				if(container.parent.activeContainer == container){
					if(container.displayType.value !== 'maximized'){
						//container
						container.parent.switchTo();
						container.hide();
					}
				}
				else{
					//self.switchTo(container);
					container.hide();
				}
			}
		};
		document.addEventListener('mousemove',onMouseMove);
		document.addEventListener('mouseup',onMouseUp);
	});
	
	handle.$.on('mousedown', function(e){
		handle.moved = false;
		if(e.which === 1){
			if(container.parent.activeContainer == container){
				//if(container.displayType.value !== 'maximized'){
				//	//container
				//	container.parent.switchTo();
				//	container.hide();
				//}
			}
			else{
				self.switchTo(container);
			}
		}
		else if(e.which === 2){
			if(container.parent.activeContainer == container){
				if(container.displayType.value !== 'maximized'){
					//container
					container.parent.switchTo();
					container.hide();
				}
			}
			else{
				//self.switchTo(container);
				container.hide();
			}
		}
		
		
		//container.show();
	});
	container.on('topped', function(){
		handle.addClass('topped');
	});
	container.on('untopped', function(){
		handle.removeClass('topped');
	});
	if(container.closeable){
		handle.append(new Button({
			icon:'times',
			className:'tab-close red quiet',
			onClick:function(){
				self.remove(container);
			},
		}));
	}
	if(container.displayType.get() === 'maximized'){
		handle.addClass('tab');
	}
	else if(container.displayType.get() === 'unmaximized-pinned'){
		handle.addClass('pinned');
	}
	
	container.handle = handle;
	return handle;
};

ContainerStack.onContainerClosed = function(){};

ContainerStack.prototype.appendAndShow = function(container){
	this.append(container);
	this.switchTo(container);
};

ContainerStack.prototype.switchTo = function(container){
	if(container === this.activeContainer){
		return;
	}
	else if(typeof container === 'undefined'){
		if(typeof this.activeContainer !== 'undefined'){
			this.activeContainer.dispatchEvent('deactivated');
			this.activeContainer = undefined;
		}
		
	}
	else if(container instanceof Container){
		var displayType = container.displayType.get();
		this.previousContainer = this.activeContainer;
		if(displayType === 'maximized'){
			//this.previousMaximized
			if(typeof this.activeContainer !== 'undefined'){
				this.activeContainer.dispatchEvent('deactivated');
				for (var i in this.activeUnmaximizedContainers){
					if(this.activeUnmaximizedContainers[i].displayType.value !== 'unmaximized-pinned'){
						this.activeUnmaximizedContainers[i].hide();
					}
					
				}
				if(this.activeContainer.displayType.value !== 'unmaximized-pinned'){
					this.activeContainer.hide();
				}
				
			}
			if(this.displayedMaximized != container && this.displayedMaximized != undefined){
				this.previousMaximized = this.displayedMaximized;
				this.displayedMaximized.hide();
			}
			this.activeContainer = container;
			this.displayedMaximized = container;
			container.dispatchEvent('activated');
			container.show();
		}
		else if(displayType === 'unmaximized' || displayType === 'unmaximized-pinned'){
			if(typeof this.activeContainer !== 'undefined'){
				this.activeContainer.dispatchEvent('deactivated');
			}
			
			//this.activeContainer.hide();
			this.activeContainer = container;
			container.dispatchEvent('activated');
			container.e.style.zIndex = this.topZIndex + 1;
			this.topZIndex += 1;
			container.show();

		}else if(displayType ==='unmaximized-pinned'){

		}
	}



	/*var i = this.containers.indexOf(container);
	if(i != -1){
		if(this.activeContainer != undefined){
			//this.activeContainer.e.style.position = 'absolute';
			this.activeContainer.$.css({
				position:'absolute',
				top:0,
				bottom:0,
				right:0,
				left:0,
			});
			//this.activeContainer.hide();
		}
		container.show();
		if(this.activeContainer != undefined){
			this.activeContainer.hide();
			this.activeContainer.e.style.position = '';
		}
		this.activeContainer = container;
	}
	else{
		container.show();
	}*/
}

ContainerStack.prototype.fadeTo = function(args){
	if(args instanceof Element){
		args = {
			container:args,
		}
	}
	var container = args.container;
	var replacedContainer;
	var direction;
	if(this.containers.indexOf(container) == -1){
		return;
	}
	if(args.replacedContainer == undefined){
		replacedContainer = this.activeContainer;
	}
	else{
		replacedContainer = args.replacedContainer;
	}
	this.activeContainer = container;
	if(this.fading){
		return;
	}
	else{
		this.fading = true;
	}
	var self = this;

	replacedContainer.$.css({
		height:replacedContainer.$.height(),
		width:replacedContainer.$.width(),
		position:'absolute',
		opacity:1,
		'z-index':100,
		top:0,
		left:0,
	});
	container.$.css({
		//opacity:0,
	});
	container.show();

	var done1 = function(){
		replacedContainer.hide();
		replacedContainer.$.css({
			height:'',
			right:'',
			left:'',
			opacity:'',
			'z-index':'',
			width:'',
			position:'',
		});
		self.fading = false;

		if(self.activeContainer != container){
			self.fadeTo(self.activeContainer);
		}
	};

	var done2 = function(){
		replacedContainer.hide();
		/*container.$.css({
			opacity:'',
		});*/

		self.fading = false;
		//container.show();
		if(self.activeContainer != container){
			self.fadeTo(self.activeContainer);
		}
	};
	replacedContainer.$.animate({
		opacity:'0',
	}, 40,done1);
	/*container.$.animate({
		opacity:'1',
	}, 'fast',done2);*/
}


ContainerStack.prototype.slideTo = function(args, direction){
	if(args instanceof Element){
		args = {
			container:args,
			direction:direction,
		}
	}
	this.switchTo(args.container);
	return;
	var container = args.container;
	var replacedContainer;
	var direction;
	if(this.containers.indexOf(container) == -1){
		return;
	}
	if(args.replacedContainer == undefined){
		replacedContainer = this.activeContainer;
	}
	else{
		replacedContainer = args.replacedContainer;
	}
	if(args.direction == undefined){
		direction = 'left';
	}
	else{
		direction = args.direction;
	}
	this.activeContainer = container;
	if(this.sliding){
		return;
	}
	else{
		this.sliding = true;
	}
	var self = this;

	replacedContainer.$.css({
		height:replacedContainer.$.height(),
		width:replacedContainer.$.width(),
		position:'absolute',
		top:0,
		left:0,
	});
	this.$.css({
		overflow:'hidden',
	});
	if(direction == 'left'){
		container.$.css({
			left:'100%',
		});
	}
	else if(direction == 'right'){
		container.$.css({
			right:'100%',
		});
	}
	container.show();

	var done1 = function(){
		replacedContainer.$.css({
			height:'',
			right:'',
			left:'',
			//overflow:'',
			width:'',
			position:'',
		});
	};

	var done2 = function(){
		replacedContainer.hide();
		container.$.css({
			left:'',
			right:'',
		});

		self.sliding = false;
		container.show();
		if(self.activeContainer != container){
			self.slideTo(self.activeContainer, container);
		}
		self.$.css({
			overflow:'',
		});
	};

	if(direction == 'left'){
		replacedContainer.$.animate({
			right:'100%',
		}, 'fast',done1);
		container.$.animate({
			left:0,
		}, 'fast',done2);
	}
	else if(direction == 'right'){
		replacedContainer.$.animate({
			left:'100%',
		}, 'fast', done1);
		container.$.animate({
			right:0,
		}, 'fast', done2);
	}

	


}

ContainerStack.prototype.getNext = function(){
	if(this.containers.length > 1){
		var i = this.containers.indexOf(this.activeContainer);
		if(i+1 == this.containers.length){
			return this.containers[0];
		}
		else{
			return this.containers[i+1];
		}
	}
	else{
		return undefined;
	}
}

ContainerStack.prototype.next = function(){
	if(this.containers.length > 1){
		var i = this.containers.indexOf(this.activeContainer);
		if(i+1 == this.containers.length){
			this.switchTo(this.containers[0]);
		}
		else{
			this.switchTo(this.containers[i+1]);
		}
	}
	
}

ContainerStack.prototype.prev = function(){
	if(this.containers.length > 1){
		var i = this.containers.indexOf(this.activeContainer);
		if(i == 0){
			this.switchTo(this.containers[this.containers.length - 1]);
		}
		else{
			this.switchTo(this.containers[i-1]);
		}
	}
	
}

ContainerStack.prototype.withLoader = function(){
	this.loader = new Loader();
	this.append(this.loader);
};

ContainerStack.prototype.startLoader = function(){
	//this.switchTo(this.loader);
	//this.locked = true;
	if(this.loader == undefined){
		this.withLoader();
	}
	this.switchTo(this.loader);
};

ContainerStack.prototype.stopLoader = function(){
	this.switchTo(this.main);
};

function Tabs(args){
	var self = this;
	args=args?args:{};
	Container.call(this,{
		contentDirection:args.direction,
		contentType:'lines',
	});
	this.addClass('tabs');

	if(args.containers instanceof ContainerStack){
		this.containers = args.containers;
	}
	else{
		this.containers = new ContainerStack({
			share:1,
		});
	}
	this.containers.addClass('tabs-containers');

	this.containers.on('container-added', function(e){
		self.addContainerTab(e.detail.container);
	});

	for (var i in this.containers.containers){
		var cont = this.containers.containers[i];
		this.addContainerTab(cont);

	}

}

Tabs.prototype = Object.create(Container.prototype);

Tabs.prototype.addContainerTab = function(container){
	var self = this;
	var tab = new Container({
		contentDirection:'horizontal',
		displayType:'inline',
		className:'tab',
	});
	container.tab = tab;
	if(container.hidden.get()){
		tab.addClass('inactive');
	}
	else{
		tab.addClass('active');
	}
	container.hidden.onTrue(function(){
		tab.addClass('inactive');
		tab.removeClass('active');
	});
	container.hidden.onFalse(function(){
		tab.addClass('active');
		tab.removeClass('inactive')
	});
	container.on('closed',function(){
		tab.close();
	});
	if(container.title == undefined){
		container.title = new Value({
			value:'Tab',
		});
	}
	else{
		tab.append(new Label({
			text:container.title,
		}));
	}
	if(container.closeable){
		tab.append(new Button({
			icon:'times',
			className:'tab-close red quiet',
			onClick:function(){
				self.containers.remove(container);
			},
		}));
	}
	tab.addEventListener('click',function(){
		self.containers.switchTo(container);
	});
	this.append(tab);
}

/*Tabs.prototype.append = function(container, args){
	var args = args || {};

	this.tabs.push(container);

	container.tab = new Toolbar();
}*/

function Panel(args){
	var self = this;
	args = args?args:{};
	Container.call(this,args);

	this.addClass('panel');
}

Panel.prototype = Object.create(Container.prototype);

function Loader(args){
	var self = this;
	args = args?args:{};
	args.share = 1;
	//args.contentType = 'lines';
	Panel.call(this,args);

	var cont = new Element({
		className:'loader-inner',
		appendTo:self,
	});
	this.message = new Element({
		className:'loader-message',
		appendTo:cont,
	});
	var spinner = new Element({
		className:'spinner',
		//appendTo:cont,
	});
	spinner.e.innerHTML = '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';

	this.addClass('loader');
}

Loader.prototype = Object.create(Panel.prototype);

Loader.prototype.setMessage = function(message){
	if(typeof message === 'string'){
		this.message.e.innerHTML = message;
	}
};

function Toolbar(args){
	var self = this;
	args = args?args:{};
	args.contentDirection = args.contentDirection || "horizontal";
	Panel.call(this,args);

	this.addClass("toolbar");

	this.left = new Container({
		contentDirection:args.contentDirection,
	});
	this.center = new Container({
		contentDirection:args.contentDirection,
	});
	this.right = new Container({
		contentDirection:args.contentDirection,
	});

	this.moreButton = new Dropdown({
		appendTo:this.right,
		icon:'ellipsis-v'
	});
	this.moreButton.$.hide();

	this.moreContainer = this.moreButton.panel;

	this.right.append(this.moreButton);

	this.element.appendChild(this.left.element);
	this.element.appendChild(this.center.element);
	this.element.appendChild(this.right.element);
}

Toolbar.prototype = Object.create(Panel.prototype);

Toolbar.prototype.append = function(element,align){
	if(element === undefined){
		return;
	}
	else if(align === "right"){
		this.right.append(element);
	}
	else if(align === "center"){
		this.center.append(element);
	}
	else{
		this.left.append(element);
	}
	return this;
}

Toolbar.prototype.addToMore = function(element){
	this.moreContainer.append(element);
	this.moreButton.$.show();
}

function Window(args){
	var self = this;
	args = args?args:{};
	Container.call(this,{
		className:args.className,
		share:args.share,
		maximized:args.maximized,
		hidden:args.hidden,
	});

	this.rolledUp = new Value();

	this.addClass('window');

	this.content = new Container({
		className:"window-content",
		share:1,
	});
	this.body = new Container({
		className:"window-body",
		share:1,
		contentDirection:"horizontal",
		maximized:true,
	});
	//this.verticalScrollContainer = new Container();
	//this.horizontalScrollContainer = new Container();
	this.titleBar = new Toolbar({
		className:"window-titlebar",
		contentDirection:"horizontal",
	});

	this.titleValue = new Value({
		value:args.title,
	});

	this.hideShowButton = new Button({
		//icon:'minus',
		onClick:function(){
			self.rolledUp.set({
				value:!self.rolledUp.get(),
			});
		},
	});

	this.rolledUp.addEventListener('set',function(d){
		if(d.value){
			d.value = true;
		}
		else{
			d.value = false;
		}
	});

	this.rolledUp.addEventListener('change',function(d){
		if(d.value){
			self.maximized.savedValue = self.maximized.get();
			self.maximized.set({
				value:false,
			})
			self.body.$.hide();
			self.hideShowButton.label.setIcon("plus");
		}
		else{
			self.maximized.set({
				value:self.maximized.savedValue == undefined?self.maximized.get():self.maximized.savedValue,
				//value:args
			});
			self.body.$.show();
			self.hideShowButton.label.setIcon("minus");
		}
	});

	this.rolledUp.set({
		value:args.rolledUp,
	});

	this.title = new Label({
		text:self.titleValue.get(),
		icon:args.icon,
	});

	this.titleBar.append(self.title);
	this.titleBar.append(self.hideShowButton,"right");

	if(args.closeable){
		this.closeable();
	}


	this.body.append(this.content)
		//.append(this.verticalScrollContainer);

	this.element.appendChild(this.titleBar.element);
	this.element.appendChild(this.body.element);
	//this.element.appendChild(this.horizontalScrollContainer.element);
}

Window.prototype = Object.create(Container.prototype);

Window.prototype.append = function(element){
	this.content.append(element);
	return this;
}

Window.prototype.closeable = function(){
	var self = this;
	this.closeButton = new Button({
		icon:'times',
		onClick:function(){
			self.element.parentNode.removeChild(self.element);
		}
	});
	this.titleBar.append(this.closeButton,"right");
}


function MessageBox(args){
	var self = this;
	args = args || {};
	//args.className = 'messagebox';
	Panel.call(this, args);
	this.addClass('messagebox');
	this.message = new Element({
	});
	this.append(this.message);
}

MessageBox.prototype = Object.create(Panel.prototype);


MessageBox.prototype.setMessage = function(message){
	this.message.e.innerHTML = message;
}
