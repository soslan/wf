// Core layer
var beforeFocusEvent = new Event('beforefocus');
var dragEvent = new Event('drag');
var afterDragEvent = new Event('afterdrag');
var afterDragNoMoveEvent = new Event('afterdragnomove');
var beforeDragEvent = new Event('beforedrag');

function Element(args){
	var self = this;
	args=args?args:{};
	args.tagName = typeof args.tagName == "string" ? args.tagName : "div";
	this.element = document.createElement(args.tagName);
	this.e = this.element;
	this.element.wfElement = this;
	this.$element = $(this.element);
	this.$ = this.$element;

	this.container = this.element; // Temporary.
	this.eventListeners;


	if(typeof args.className == "string"){
		this.addClass(args.className);
	}
	if(args.appendTo instanceof Element){
		args.appendTo.append(self);
		this.parent = args.appendTo;
	}
	else if(args.appendTo instanceof Node){
		args.appendTo.appendChild(this.element);
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

Element.prototype.append = function(element){
	if(element instanceof Node ){
		this.element.appendChild(element);
	}
	else{
		this.element.appendChild(element.element);
		element.parent = this;
	}
	return this;
}

// To be improved
Element.prototype.prepend = function(element){
	$(this.element).prepend(element.element);
	return this;
}

Element.prototype.addClass = function(className){
	if(typeof className == "string"){
		var classList = className.split(' ');
		for(var i in classList){
			this.element.classList.add(classList[i]);
		}
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
	if(typeof handler == "function"){
		this.element.addEventListener(type, handler, useCapture);
	}
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
	this.element.setAttribute('tabindex',args.tabIndex || 1);
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

	this.element.addEventListener('mousedown',function(e){
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
		this.$.focus();
	}
}

// Experimental
Element.prototype.blur = function(handler){
	if(typeof handler == "function"){
		this.addEventListener('DOMFocusOut',handler);
	}
	else if(this.focusingElement){
		if(this.focusingElement == this){
			this.element.dispatchEvent(beforeBlurEvent);
			this.$.blur();
		}
		else{
			this.focusingElement.blur();
			return false;
		}
	}
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
		if(document.activeElement == self.element)
			self.element.setSelectionRange(e.firstPart.length, e.firstPart.length + e.selection.length);
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
	this.focusable(args);
	if(typeof args.onClick == "function"){
		this.addEventListener('click',args.onClick);
	}
	this.isClickable = true;
}

Element.prototype.click = function(handler){
	if(typeof handler == "function"){
		this.addEventListener('click',handler);
	}
}

Element.prototype.draggable = function(args){
	var self = this;
	var args = args || {};
	var dragged = false;
	var minX, maxX, minY, maxY;
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
		var newPositionX = self.latestElementPositionOnMD.left + shift[0];
		var newPositionY = self.latestElementPositionOnMD.top + shift[1];
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

		self.$.css({
			left:newPositionX,
			top:newPositionY,
		});
		e.stopPropagation();
		e.preventDefault();
	}

	this.documentOnMouseUp = function(e){
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
	

	this.addEventListener('mousedown',function(e){
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
		self.latestElementPositionOnMD = self.$.position();
		document.addEventListener('mousemove',self.documentOnMove);
		document.addEventListener('mouseup',self.documentOnMouseUp);
	});

	this.addEventListener('click',function(e){
		e.stopPropagation();
		e.preventDefault();
	});
}

// Prototype
Element.prototype.valueCarrier = function(args){
	var self = this;
	this.valueCarrier = true;
}

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
	Element.call(this,{
		tagName:"input",
		className:"text-input",
	});

	this.editable(args);
}

TextInputCore.prototype = Object.create(Element.prototype);

function Clickable(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		tagName:typeof args.tagName == "string"?args.tagName:"button",
		className:args.className,
	});

	this.addClass("clickable");
	this.clickable(args);
}

Clickable.prototype = Object.create(Element.prototype);

function Label(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		tagName:"span",
		className:"label",
	});
	this.icon = new Element({
		tagName:"span",
		className:"fa label-icon",
	});
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

	this.append(this.icon)
		.append(this.text);
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
		this.removeClass("notext");
		this.text.element.innerHTML = text;
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

