// Core layer
var beforeFocusEvent = new Event('beforefocus');
var dragEvent = new Event('drag');
var afterDragEvent = new Event('afterdrag');
var afterDragNoMoveEvent = new Event('afterdragnomove');
var beforeDragEvent = new Event('beforedrag');

function Element(arg1, arg2){
	var self = this;
	var args;
	if (arg1 instanceof Node){
		args = arg2?arg2:{};
		this.element = arg1;
	}
	else if (typeof arg1 === "string"){
		args = arg2?arg2:{};
		this.element = document.querySelector(arg1);
		if (this.element === null){
			this.element = document.createElement(args.tagName || "div");
		}
	}
	else{
		args=arg1?arg1:{};
		this.element = document.createElement(args.tagName || "div");
	}
	
	this.e = this.element;
	this.element.wfElement = this;
	this.wfe = this;
	this.$element = $(this.element);
	this.$ = this.$element;

	this.container = this.element; // Temporary.
	this.eventListeners;
	this.addClass(args.className);
	if (args.content !== undefined){
		this.append(args.content);
	}
	
	if(args.appendTo instanceof Element){
		args.appendTo.append(self);
	}
	else if(args.appendTo instanceof Node){
		args.appendTo.appendChild(this.element);
	}
	if(args.focusable){
		this.focusable();
	}

}

Element.prototype.value = function(value){
	if(value){
		this.$.val(value);
	}
	else{
		return this.$.val();
	}
}

Element.prototype.setAttribute = function(key, value){
	if (typeof value === "string"){
		this.e.setAttribute(key, value);
	}
	else if(value instanceof Value){
		this.e.setAttribute(key, value.getAsString());
		value.onChange(function(){
			this.e.setAttribute(key, value.getAsString());
		});
	}
	
}

Element.prototype.getAttribute = function(key){
	return this.e.getAttribute(key);
}


Element.prototype.attr = function(key, value){
	if (value !== undefined){
		this.setAttribute(key, value);
	}
	else{
		return this.getAttribute(key);
	}
}

Element.prototype.style = function(args){
	if (typeof args !== "object"){
		return;
	}
	for (var i in args){
		this.e.style[i] = args[i];
	}
}

Element.prototype.append = function(element){
	if (element === undefined || element === null){
		return;
	}
	else if(element instanceof Node){
		this.element.appendChild(element);
	}
	else if(element instanceof Text){
		// var elem = document.createElement('span');
		// elem.appendChild(element);
		// this.element.appendChild(elem);
		this.element.appendChild(element);
	}
	else if(element instanceof Element ||
			(SVGElement !== undefined && element instanceof SVGElement)){
		this.element.appendChild(element.element);
		element.parent = this;
	}
	else if(false && element instanceof Array){
		for (var i in element){
			this.append(element[i]);
		}
	}
	else if(element instanceof Value){
		var elem = element.getAsNode();
		this.append(elem);
	}
	else if(typeof element === "string" || typeof element === "number" ){
		// var elem = document.createElement('span');
		// elem.appendChild(new Text(String(element)));
		var elem = new Text(String(element));
		this.element.appendChild(elem);
	}
}

// To be improved
Element.prototype.prepend = function(element){
	$(this.element).prepend(element.element);
	return this;
}

Element.prototype.hide = function(){
	this.addClass('hidden');
	this.dispatchEvent('hide');
}

Element.prototype.show = function(){
	this.removeClass('hidden');
	this.dispatchEvent('show');
}

Element.prototype.getHandle = function(args){
	args = args || {};
	args.container = this;
	var handle = new ContainerHandle(args);
	return handle;
};

Element.prototype.close = function(){
	//this.hide();
	//console.log("closing");
	this.element.parentNode.removeChild(this.element);
	this.dispatchEvent('closed');
}

Element.prototype.isAncestorOf = function(element){
	if(!(element instanceof Node)){
		return false;
	}
	var node = element.parentNode;
	while(node!=null){
		if(node == this.element){
			return true;
		}
		else{
			node = node.parentNode;
		}
	}
	return false;
};

Element.prototype.isParentOf = function(element){
	if(element instanceof Element){
		element = element.element;
	}
	else if(!(element instanceof Node)){
		return false;
	}
	if (this.element === element.parentNode){
		return true;
	}
	return false;
};

Element.prototype.positionWithinWindow = function(){
	var temp = this.e;
	var offset = [0,0];
	while (temp !== null){
		offset[0] += temp.offsetLeft;
		offset[1] += temp.offsetTop;
		temp = temp.offsetParent;
	}

	return offset;
}

Element.prototype.addClass = function(className){
	var self = this;
	if(typeof className == "string"){
		var classList = className.split(' ');
		for(var i in classList){
			if (classList[i] !==""){
				this.element.classList.add(classList[i]);
			}
		}
	}
	else if (className instanceof Value){
		this.addClass(String(className.get()));
		className.onChange(function(d){
			self.removeClass(String(d.oldValue));
			self.addClass(String(d.value));
		});
	}
	return this;
}

Element.prototype.removeClass = function(className){
	var classList = className.split(' ');
	for(var i in classList){
		this.element.classList.remove(classList[i]);
	}
	return this;
}

Element.prototype.addEventListener = function(type, handler, useCapture){
	var useCapture = useCapture || false;
	if (typeof type == "string" && typeof handler == "function"){
		var events = type.split(" ");
		for (var i in events){
			this.element.addEventListener(events[i], handler, useCapture);
		}
	}
}

Element.prototype.removeEventListener = function(type, handler){
	this.e.removeEventListener(type, handler);
}

Element.prototype.dispatchEvent = function(eventKey, e){
	var self = this;
	var event = new CustomEvent(eventKey, {
		detail:e,
	});
	this.element.dispatchEvent(event);
	return this;
}

Element.prototype.on = Element.prototype.addEventListener;

Element.prototype.focusable = function(args){
	var self = this;
	var args = args || {};
	if (self.isFocusable){
		return;
	}
	this.element.setAttribute('tabindex',args.tabIndex || 1);
	this.addEventListener('focusout', function(e){
		if(!(self.element == e.relatedTarget) && !self.e.contains(e.relatedTarget)){
			self.dispatchEvent('focusaway', e);
		}
	});
	this.addEventListener('touchstart', function(e){
		//console.log("touchstart focusable"+e.type);
		self.focus();
		//e.preventDefault();
		e.stopPropagation();
	});
	if(args.onFocus){
		this.addEventListener('focus', function(e){
			args.onFocus({
				value:self.$element.val(),
			});
		});
	}

	if(args.onBlur){
		this.addEventListener('blur', function(e){
			args.onBlur({
				value:self.$element.val(),
			});
		});
	}
	this.isFocusable = true;
}

Element.prototype.focusing = function(focusingElement){
	var self = this;
	this.focusingElement = focusingElement;

	this.element.addEventListener('mousedown touchstart',function(e){
		self.focusingElement.focus(e);
		e.stopPropagation();
		e.preventDefault();
	});
}

Element.prototype.focus = function(handler){
	if(typeof handler == "function"){
		if(this.focusingElement && this.focusingElement != this){
			this.focusingElement.focus(handler);
		}
		else{
			this.addEventListener('DOMFocusIn',handler);
		}
	}
	else if(this.focusingElement && this.focusingElement != this){
		this.focusingElement.focus();
		return false;
	}
	else {
		this.element.dispatchEvent(beforeFocusEvent);
		//document.activeElement.blur();
		this.e.focus();
	}
}

// Experimental
Element.prototype.blur = function(handler){
	if(typeof handler == "function"){
		this.addEventListener('DOMFocusOut',handler);
	}
	else if(this.focusingElement !== undefined){
		if(this.focusingElement == this){
			this.element.dispatchEvent(beforeBlurEvent);
			this.e.blur();
		}
		else{
			this.focusingElement.blur();
			return false;
		}
	}
	else{
		this.e.blur();
	}
}

Element.prototype.maximize = function(args){
	this.addClass('maximized');
	this.maximized = true;
}

Element.prototype.beforeFocus = function(handler){
	if(typeof handler == "function"){
		this.addEventListener('beforefocus',handler);
	}
	else if(this.focusingElement){
		if(this.focusingElement == this){
			this.element.dispatchEvent(beforeFocusEvent);
		}
		else{
			this.focusingElement.focus();
		}
	}
}

Element.prototype.setFocusingElement = function(elem){
	this.focusingElement = elem.focusingElement || elem;
}

Element.prototype.tabIndex = function(tabIndex){
	if(tabIndex){
		this.element.setAttribute('tabindex',tabIndex);
	}
	else {
		return this.element.getAttribute('tabindex');
	}
}

Element.prototype.editable = function(args){
	var self = this;
	if(args.value){
		this.value = args.value;
	}
	else{
		this.value = new Value({
			value:"",
		});
	}
	this.element.value = this.value.get();
	
	this.value.addEventListener('change',function(e){
		self.element.value = e.value;
		if(document.activeElement == self.element){
			if(e.firstPart != undefined && e.selection != undefined){
				self.element.setSelectionRange(e.firstPart.length, e.firstPart.length + e.selection.length);
			}
		}
			
	});
	this.focusable(args);
	if(this.element.tagName != 'input' && this.element.tagName != 'textarea'){
		this.element.setAttribute('contenteditable','true');
	}
	else if(this.element.tagName == 'input'){
		this.element.setAttribute('type','text');
	}
	this.addEventListener('keypress',function(e){
		self.value.insert({
			value: self.element.value,
			selectionStart: self.element.selectionStart,
			selectionEnd: self.element.selectionEnd,
			replacement:String.fromCharCode(e.which),
			firstPart:self.element.value.substr(0,self.element.selectionStart),
			secondPart:self.element.value.substr(self.element.selectionEnd,self.element.value.length - self.element.selectionEnd),
			selection:self.element.value.substring(self.element.selectionEnd, self.element.selectionStart),
		});		
		e.preventDefault();
	});

	this.addEventListener('keydown',function(e){
		var firstPart, secondPart, selection;
		if(e.which == 8){
			if(self.element.selectionStart === self.element.selectionEnd){
				firstPart = self.element.value.substr(0,self.element.selectionStart - 1);
				selection = self.element.value.substr(self.element.selectionStart - 1, 1);
				secondPart = self.element.value.substr(self.element.selectionEnd,self.element.value.length - self.element.selectionEnd)
			}
			else{
				firstPart = self.element.value.substr(0,self.element.selectionStart);
				selection = self.element.value.substr(self.element.selectionStart, self.element.selectionEnd - self.element.selectionStart);
				secondPart = self.element.value.substr(self.element.selectionEnd,self.element.value.length - self.element.selectionEnd)
			
			}
			self.value.insert({
				value: String.fromCharCode(e.which),
				selectionStart: self.element.selectionStart,
				selectionEnd: self.element.selectionEnd,
				replacement:'',
				firstPart:firstPart,
				secondPart:secondPart,
				selection:selection,
			});
			e.preventDefault();
		}
	});
	this.isEditable = true;
}

Element.prototype.edit = function(changes){
	if(this.isEditable){
		if(changes.selectionEnd >= 0 ){
			this.element.value = changes.value;
			//this.element.selectionStart = changes.selectionStart + changes.delta.length;
			//this.element.selectionEnd = changes.selectionStart + changes.delta.length;
			if(document.activeElement == this.element)
				this.element.setSelectionRange(changes.selectionStart + changes.delta.length, changes.selectionStart + changes.delta.length);
			//this.element.setRangeText(changes.delta);
			//this.element.selectionStart = changes.selectionStart + changes.delta.length;
		}
		else{
			//this.$.val(changes.value);
		}
		
	}
}

// Clickable
Element.prototype.clickable = function(args){
	var self = this;
	args = args || {};
	this.focusable(args);
	this.addClass("clickable");
	if(typeof args.onClick == "function"){
		this.addAction(args.onClick);
	}
	this.isClickable = true;
}

Element.prototype.setAction = function(action){
	if (typeof action !== "function"){
		return;
	}
	if (typeof this.removeAction === "function"){
		this.removeAction();
	}
	if (this.isClickable === undefined){
		this.clickable();
	}
	var self = this;
	var onClick = function(e){
		//console.log("onClick");
		if(!self.disabled){
			action(e);
		}
		e.preventDefault();
		e.stopPropagation();
	};
	var onTouchStart = function(e){
		//e.preventDefault();
		//console.log("onTouchStart");
		//self.touched = true;

		var onTouchEnd = function(e){
			//console.log("onTouchEnd");
			
			action(e);
			//delete self.moved;
			self.removeEventListener('touchend', onTouchEnd);
			self.removeEventListener('touchmove', onTouchMove);
			self.removeEventListener('touchcancel', onTouchCancel);
			e.preventDefault();
			e.stopPropagation();

		};
		var onTouchMove = function(e){
			//console.log("onTouchMove");
			//self.moved = true;
			self.removeEventListener('touchend', onTouchEnd);
			self.removeEventListener('touchmove', onTouchMove);
			self.removeEventListener('touchcancel', onTouchCancel);

		};
		var onTouchCancel = function(e){
			self.removeEventListener('touchend', onTouchEnd);
			self.removeEventListener('touchmove', onTouchMove);
			self.removeEventListener('touchcancel', onTouchCancel);
		};
		if(!this.disabled){
			self.addEventListener('touchmove', onTouchMove);
			self.addEventListener('touchend', onTouchEnd);
			self.addEventListener('touchcancel', onTouchCancel);
		}
		
	};
	var onMouseDown = function(e){
		console.log('onmousedown');
		if(self.disabled){
			e.preventDefault();
			e.stopPropagation();
		}
		e.stopPropagation();
		e.preventDefault();
	};
	var onSpaceOrEnter = function(e){
		if(e.which == 13 || e.which == 32){
			action();
		}
	}
	this.addEventListener('mousedown', onMouseDown);
	this.addEventListener('click', onClick);
	this.addEventListener('touchstart', onTouchStart);
	this.addEventListener('keydown',onSpaceOrEnter);
	this.removeAction = function(){
		this.removeEventListener('click', onClick);
		this.removeEventListener('touchstart', onTouchStart);
		this.removeEventListener('mousedown', onMouseDown);
		this.removeEventListener('keydown', onSpaceOrEnter);
		delete this.removeAction;
	};
};

Element.prototype.click = function(handler){
	if(typeof handler == "function"){
		this.addEventListener('click',handler);
	}
}

Element.prototype.disable = function(){
	this.addClass('disabled');
	this.disabled = true;
};

Element.prototype.activate = function(){
	this.removeClass('disabled');
	delete this.disabled;
}

Element.prototype.draggable = function(args){
	var self = this;
	var args = args || {};
	var dragged = false;
	var minX, maxX, minY, maxY;
	var position = [0,0];
	var newPositionY = 0;
	var newPositionX = 0;
	this.draggingMode = args.mode || 'hv';
	if(this.draggingMode == 'h'){
		this.vDraggable = false;
		this.hDraggable = true;
	}
	else if(this.draggingMode == 'v'){
		this.vDraggable = true;
		this.hDraggable = false;
	}
	else{
		this.vDraggable = true;
		this.hDraggable = true;
	}
	this.documentOnMove = function(e){
		var shift = [0,0];
		dragged = true;
		if(self.vDraggable){
			shift[1] = e.pageY - self.latestMouseDownPosition[1];
		}
		if(self.hDraggable){
			shift[0] = e.pageX - self.latestMouseDownPosition[0];
		}
		newPositionX = position[0] + shift[0];
		newPositionY = position[1] + shift[1];
		if(newPositionX<minX){
			newPositionX = minX;
		}
		else if(newPositionX>maxX){
			newPositionX = maxX;
		}
		if(newPositionY<minY){
			newPositionY = minY;
		}
		else if(newPositionY>maxY){
			newPositionY = maxY;
		}

		//self.$.css({
			//'-webkit-transform': ,
			//left:newPositionX,
			//top:newPositionY,
		//});
		self.e.style.webkitTransform = 'translate('+newPositionX+'px, '+newPositionY+'px)';
		//console.log('translate('+newPositionX+', '+newPositionY+')');
		e.stopPropagation();
		e.preventDefault();
	}

	this.documentOnMouseUp = function(e){
		position = [newPositionX, newPositionY];
		document.removeEventListener('mousemove', self.documentOnMove);
		document.removeEventListener('mouseup', self.documentOnMouseUp);
		if(dragged){
			self.element.dispatchEvent(afterDragEvent);
		}
		else{
			self.element.dispatchEvent(afterDragNoMoveEvent);
		}
		dragged = false;
	}
	if(typeof args.afterDrag == "function"){
		this.addEventListener('afterdrag',args.afterDrag);
	}


	if(typeof args.afterNoMove == "function"){
		this.addEventListener('afterdragnomove',args.afterNoMove);
	}

	this.onMouseDown = function(e){
		if(e.which === 1){
			dragged = false;
			if(typeof args.minX == "function"){
				minX = args.minX();
			}
			else{
				minX = args.minX;
			}
			if(typeof args.maxX == "function"){
				maxX = args.maxX();
			}
			else{
				maxX = args.maxX;
			}
			if(typeof args.minY == "function"){
				minY = args.minY();
			}
			else{
				minY = args.minY;
			}
			if(typeof args.maxY == "function"){
				maxY = args.maxY();
			}
			else{
				maxY = args.maxY;
			}
			self.latestMouseDownPosition = [e.pageX, e.pageY];
			//self.latestElementPositionOnMD = self.$.position();
			document.addEventListener('mousemove',self.documentOnMove);
			document.addEventListener('mouseup',self.documentOnMouseUp);
			e.preventDefault();
			e.stopPropagation();
		}
	};
	

	this.addEventListener('mousedown',this.onMouseDown);

	this.addEventListener('click',function(e){
		e.stopPropagation();
		e.preventDefault();
	});
}

Element.prototype.notDraggable = function(){
	this.removeEventListener('mousedown',this.onMouseDown);
	this.e.style.webkitTransform = '';
	document.removeEventListener('mouseup',this.documentOnMouseUp);
	document.removeEventListener('mousemove',this.documentOnMove);
};

// Prototype
Element.prototype.valueCarrier = function(args){
	var self = this;
	this.valueCarrier = true;
}

Element.prototype.display = {
	get: function(){ return "YES" }
}

Object.defineProperty(Element.prototype, "display", {
	//get: function(){ return "YES" },
	set: function(val){
		var self = this;
		if (typeof val === "string"){
			this.e.style.display = val;
		}
		else if(val instanceof Value){
			if (val.value === true){
				this.e.style.display = '';
			}
			else if (val.value === false){
				this.e.style.display = 'none';
			}
			else{
				this.e.style.display = val.getAsString();
			}
			val.onChange(function(d){
				if (d.value === true){
					self.e.style.display = '';
				}
				else if (d.value === false){
					self.e.style.display = 'none';
				}
				else{
					self.e.style.display = val.getAsString();
				}
				
			});
		}
		else if(typeof val === "boolean"){
			if(val){
				this.e.style.display = '';
			}
			else{
				this.e.style.display = 'none';
			}
		}
	}
})

function TextElement(args){
	var text = "";
	if(typeof args == "string"){
		text = args;
		args = {};
	}
	else if(typeof args == "object"){
		text = args.text || args.value || "";
	}
	else{
		args = {};
	}
	this.element = document.createTextNode();
}

// Text input
// To be renamed to TextInput
function TextInputCore(args){
	var self = this;
	args = args?args:{};
	args.tagName = "input";
	Element.call(this,args);
	this.addClass("text-input");
	this.setAttribute('type', 'text');
}

TextInputCore.prototype = Object.create(Element.prototype);

TextInputCore.prototype.getValue = function(){
	return this.e.value;
}

TextInputCore.prototype.setValue = function(value){
	if(typeof value === "string"){
		this.e.value = value;
	}
}

function Clickable(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		//tagName:typeof args.tagName == "string"?args.tagName:"button",
		className:args.className,
	});

	this.addClass("clickable");
	this.clickable(args);
}

Clickable.prototype = Object.create(Element.prototype);

function Label(args){
	var self = this;
	args = args?args:{};
	args.tagName = 'span';
	Element.call(this,args);
	this.icon = new Element({
		tagName:"span",
		className:"fa label-icon",
	});
	this.addClass('label');
	this.text = new Element({
		tagName:"span",
		className:"label-text",
	});

	this.setText(args.text);
	if(typeof args.icon == "string"){
		this.setIcon(args.icon);
	}
	else{
		this.addClass("noicon");
		//this.icon.addClass("hidden");
	}

	//if(typeof args.text)

	this.append(this.icon);
	this.append(this.text);
}

Label.prototype = Object.create(Element.prototype);

Label.prototype.setIcon = function(iconTag){
	this.removeClass("noicon");
	this.icon.removeClass('fa-'+this.iconTag);
	this.icon.addClass('fa-'+iconTag);
	this.iconTag = iconTag;
}

Label.prototype.setText = function(text){
	if(typeof text == "string"){
		if (text == ""){
			this.text.element.innerHTML = text;
			this.addClass("notext");
		}
		else{
			this.removeClass("notext");
			this.text.element.innerHTML = text;
		}
	}
	else if(text instanceof Text){
		this.removeClass("notext");
		this.text.element.innerHTML = '';
		this.text.element.appendChild(text);

	}
	else if(text instanceof Value){
		this.removeClass("notext");
		this.text.element.innerHTML = '';
		this.text.element.appendChild(text.addBroadcaster());

	}
	else if(text == undefined){
		this.addClass('notext');
		this.text.element.innerHTML = '';
	}
	return this;
}

Label.prototype.removeIcon = function(){
	this.addClass("noicon");
}

Label.prototype.removeText = function(){
	this.addClass("notext");
}

