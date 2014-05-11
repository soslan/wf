function Container(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		appendTo:args.appendTo,
		className:args.className,
	});
	this.addClass("container");
	this.contentType = new Value({
		value: "blocks",
	});

	this.displayType = new Value({
		value: "new-line",
	});

	this.hidden = new BooleanModel({
		value:false,
	})

	this.position = this.displayType;

	this.maximized = new Value();
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
	});

	this.hidden.onFalse(function(){
		self.removeClass('hidden');
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
		if(d.value == "inline"){
			d.value = "inline";
		}
		else if(d.value == "none"){
			d.value = "none";
		}
		else{
			d.value = "new-line";
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
		value:args.displayType || args.position,
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

Container.prototype.hide = function(){
	this.hidden.true();
};

Container.prototype.show = function(){
	this.hidden.false();
};

Container.prototype.close = function(){
	this.hide();
	this.element.parentNode.removeChild(this.element);
	this.dispatchEvent('closed');
}

function ContainersStack(args){
	var self = this;
	args = args?args:{};
	Container.call(this,args);
	this.addClass('containers-stack');

	this.containers = [];
	this.activeContainer;
}

ContainersStack.prototype = Object.create(Container.prototype);

ContainersStack.prototype.append = function(container){
	var self = this;
	this.containers.push(container);
	if(this.containers.length == 1){
		this.show(container);
	}
	else{
		container.hide();
	}
	Container.prototype.append.call(this, container);
	container.on('closed',function(){
		var i = self.containers.indexOf(container);
		self.containers.splice(i,1);
		if(self.activeContainer == container){
			if(i == 0){
				if(self.containers.length > 0){
					self.show(self.containers[0]);
				}
			}
			else{
				self.show(self.containers[i-1]);
			}
		}
	});
	this.dispatchEvent('container-added', {
		container:container,
	});
};

ContainersStack.prototype.appendAndShow = function(container){
	this.append(container);
	this.show(container);
};

ContainersStack.prototype.show = function(container){
	var i = this.containers.indexOf(container);
	if(i != -1){
		if(this.activeContainer != undefined){
			this.activeContainer.hide();
		}
		container.show();
		this.activeContainer = container;
	}
}

ContainersStack.prototype.slide = function(container, replacedContainer){
	if(this.containers.indexOf(container) == -1){
		return;
	}
	if(replacedContainer == undefined){
		replacedContainer = this.activeContainer;
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
	});
	container.$.css({
		left:'100%',
	});
	container.show();

	replacedContainer.$.animate({
		right:'100%',
	}, 'fast',function(){
		replacedContainer.$.css({
			height:'',
			right:'',
			width:'',
			position:'',
		});
		replacedContainer.hide();
	});
	container.$.animate({
		left:0,
	}, 'fast',function(){
		container.$.css({
			left:'',
		});

		self.sliding = false;
		container.show();
		if(self.activeContainer != container){
			self.slide(self.activeContainer, container);
		}
	});


}

ContainersStack.prototype.getNext = function(){
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

ContainersStack.prototype.next = function(){
	if(this.containers.length > 1){
		var i = this.containers.indexOf(this.activeContainer);
		if(i+1 == this.containers.length){
			this.show(this.containers[0]);
		}
		else{
			this.show(this.containers[i+1]);
		}
	}
	
}

ContainersStack.prototype.prev = function(){
	if(this.containers.length > 1){
		var i = this.containers.indexOf(this.activeContainer);
		if(i == 0){
			this.show(this.containers[this.containers.length - 1]);
		}
		else{
			this.show(this.containers[i-1]);
		}
	}
	
}

function Tabs(args){
	var self = this;
	args=args?args:{};
	Container.call(this,{
		contentDirection:args.direction,
		contentType:'lines',
	});
	this.addClass('tabs');

	if(args.containers instanceof ContainersStack){
		this.containers = args.containers;
	}
	else{
		this.containers = new ContainersStack({
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
	tab.append(new Label({
		text:container.title,
	}));
	if(container.closeable){
		tab.append(new Button({
			icon:'times',
			className:'tab-close red quiet',
			onClick:function(){
				if(typeof container.close == 'function'){
					container.close();
				}
			},
		}));
	}
	tab.addEventListener('click',function(){
		self.containers.show(container);
	});
	this.append(tab);
}

/*Tabs.prototype.append = function(container, args){
	var args = args || {};

	this.tabs.push(container);

	container.tab = new Toolbar();
}*/



function Toolbar(args){
	var self = this;
	args = args?args:{};
	args.contentDirection = args.contentDirection || "horizontal";
	Container.call(this,{
		className:args.className,
		contentDirection:args.contentDirection || "horizontal",
	});

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

	this.moreButton = new Button({
		icon:"ellipsis-v",
		className:"toolbar-more",
		onClick:function(){
			var temp = self.moreContainer.displayType.get();
			if(temp == "none"){
				self.moreContainer.displayType.set({
					value:"new-line",
				});
			}
			else{
				self.moreContainer.displayType.set({
					value:"none",
				});
			}
		},
	});
	this.moreButton.addClass("hidden");

	this.moreContainer = new Container({
		className:"dropdown toolbar-more-container",
		contentDirection:"vertical",
		displayType:"none",
	});

	this.moreButton.append(this.moreContainer);

	this.right.append(this.moreButton);

	this.element.appendChild(this.left.element);
	this.element.appendChild(this.center.element);
	this.element.appendChild(this.right.element);
}

Toolbar.prototype = Object.create(Container.prototype);

Toolbar.prototype.append = function(element,align){
	if(align === "right"){
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
	this.moreButton.removeClass("hidden");
}

function Panel(args){
	var self = this;
	args = args?args:{};
	Container.call(this,{
		className:args.className,
		share:args.share,
		maximized:args.maximized,
	});

	this.addClass('panel');
}

Panel.prototype = Object.create(Container.prototype);

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
