function Container(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		className:args.className,
	});
	this.addClass("container");
	this.contentType = new Value({
		value: "blocks",
	});

	this.displayType = new Value({
		value: "new-line",
	});

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
