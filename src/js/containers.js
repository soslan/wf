function Containers(args){
	var self = this;
	args = args?args:{};
	Container.call(this,args);
	this.addClass('containers');
	this.activeUnmaximizedContainers = [];
	this.containers = [];
	this.topZIndex = 200;
	this.activeContainer;
	this.activeMaximizedContainer = this.activeContainer;
}

Containers.prototype = Object.create(Container.prototype);

Containers.prototype.append = function(container){
	var self = this;
	var displayType;
	if (!(container instanceof Container)){
		return;
	}
	if (1 || container.displayType === undefined){
		container.setDisplayType('maximized');
	}
	/*if(['maximized', 'unmaximized', 'unmaximized-pinned'].indexOf(container.displayType.get()) == -1){
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
	}*/
	this.containers.push(container);
	container.e.style.visibility = "none";

	Container.prototype.append.call(this, container);
	if(this.activeContainer == undefined){
		//container.e.style.visibility = "";
		this.switchTo(container);
	}
	else{
		container.hide();
	}
	container.e.style.visibility = "";
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

Containers.prototype.remove = function(container){
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

Containers.prototype.getHandleFor = function(container, handleArgs){
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

Containers.onContainerClosed = function(){};

Containers.prototype.appendAndShow = function(container){
	this.append(container);
	this.switchTo(container);
};

Containers.prototype.switchTo = function(container, transition){
	transition = transition || 'fade';
	if(container === this.activeContainer){
		return;
	}
	else if(typeof container === 'undefined'){
		if(typeof this.activeContainer !== 'undefined'){
			this.activeContainer.hide();
			this.activeContainer.dispatchEvent('deactivated');
			this.activeContainer = undefined;
		}
		return;
		
	}
	/*
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
	*/

	if(this.e.contains(container.e)){
		var previousActive = this.activeContainer;
		
		this.activeContainer = container;
		container.e.style.zIndex = this.topZIndex + 1;
		this.topZIndex += 1;
		container.e.style.opacity = 0;
		container.show();
		container.$.animate({
			opacity:1,
		}, 40, function(){
			container.dispatchEvent('activated');
			if(previousActive instanceof Container){
				previousActive.dispatchEvent('deactivated');
				previousActive.hide();
			}
		});
		/*container.show();
		container.dispatchEvent('activated');
		if(previousActive instanceof Container){
			previousActive.dispatchEvent('deactivated');
			previousActive.hide();
		}*/
		
		
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

Containers.prototype.fadeTo = function(args){
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


Containers.prototype.slideTo = function(args, direction){
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

Containers.prototype.getNext = function(){
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

Containers.prototype.next = function(){
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

Containers.prototype.prev = function(){
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

Containers.prototype.withLoader = function(){
	this.loader = new Loader();
	this.append(this.loader);
};

Containers.prototype.startLoader = function(){
	//this.switchTo(this.loader);
	//this.locked = true;
	if(this.loader == undefined){
		this.withLoader();
	}
	this.switchTo(this.loader);
};

Containers.prototype.stopLoader = function(){
	this.switchTo(this.main);
};
