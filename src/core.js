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
	this.$element = $(this.element);
	this.$ = this.$element;
	this.tagName = args.tagName;
	
	this.element.className = "element";

	this.container = this.element; // Temporary.

	if(typeof args.className == "string"){
		this.addClass(args.className);
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
	this.element.appendChild(element.element);
	return this;
}

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
	
	this.value.addEventListener('change',function(e){
		self.element.value = e.value;
		if(document.activeElement == self.element)
			self.element.setSelectionRange(e.selectionStart + e.delta.length, e.selectionStart + e.delta.length);
	});
	//this.value.addBroadcaster(this);
	this.focusable(args);
	if(this.element.tagName != 'input' && this.element.tagName != 'textarea'){
		this.element.setAttribute('contenteditable','true');
	}
	else if(this.element.tagName == 'input'){
		this.element.setAttribute('type','text');
	}
	this.addEventListener('keypress',function(e){
		if(e.which == 65){

		}

		self.value.insert(String.fromCharCode(e.which),self.element.selectionStart);
		e.preventDefault();
	});

	this.addEventListener('keydown',function(e){
		if(e.which == 8){
			if(e.selectionStart == e.selectionEnd){
				self.value.insert('', self.element.selectionStart - 1, self.element.selectionEnd);
			}
			else{
				self.value.insert('', self.element.selectionStart, self.element.selectionEnd);
			}
		}
	});

	/*if(args.onChange){
		this.addEventListener('input',function(e){
			args.onChange({
				//value: self.value()
			});
		});
	}*/
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
		className:"clickable",
	});
	this.clickable(args);
}

Clickable.prototype = Object.create(Element.prototype);

function Label(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		tagName:"span",
		className:"label fa",
	});

	if(typeof args.text == "string"){
		this.$.text(args.text);
	}
	if(typeof args.icon == "string"){
		this.setIcon(args.icon);
	}
}

Label.prototype = Object.create(Element.prototype);

Label.prototype.setIcon = function(iconTag){
	this.removeClass('fa-'+this.iconTag);
	this.addClass('fa-'+iconTag);
	this.iconTag = iconTag;
}

function Value(args){
	this.value = args.valeu || '';
	this.eventListeners = {};
	this.broadcasters = [];
}

Value.prototype.addEventListener = function(event, handler){
	if(typeof this.eventListeners[event] == "undefined"){
		this.eventListeners[event] = [];
	}
	this.eventListeners[event].push(handler);
	return this;
}

Value.prototype.removeEventListener = function(event, handler){
	var i = this.eventListeners[event].indexOf(handler);
	if(i > -1){
		this.eventListeners[event].splice(i, 1);
	}
	return this;
}

Value.prototype.addBroadcaster = function(element){
	this.broadcasters.push(element);
	return this;
}

Value.prototype.removeBroadcaster = function(element){
	var i = this.broadcasters.indexOf(element);
	if (i > -1) {
    	this.broadcasters.splice(i, 1);
	}
	return this;
}

Value.prototype.broadcast = function(changes){
	var self = this;
	var bootstrap = function(broadcasterIndex, max){
		setTimeout(function(){
			self.broadcasters[broadcasterIndex].edit(changes);
		},0);
		if(max>broadcasterIndex){
			bootstrap(broadcasterIndex * 1 + 1, max);
		}
	}
	bootstrap(0, this.broadcasters.length - 1);
}

Value.prototype.dispatchEvent = function(event,e){
	var self = this;
	if(typeof event == "string"){
		var bootstrap = function(handlerIndex, max){
			setTimeout(function(){
				self.eventListeners[event][handlerIndex](e);
			},0);
			if(max>handlerIndex){
				bootstrap(handlerIndex * 1 + 1, max);
			}
		}
		bootstrap(0, this.eventListeners[event].length - 1);
	}
	return this;
}

Value.prototype.set = function(newValue){
	this.value = newValue;
	var e = {
		selectionStart:0,
		selectionEnd:-1,
		delta:this.value,
		value:this.value,
	}
	this.dispatchEvent('change',e);
}

Value.prototype.get = function(newValue){
	return this.value;
}

Value.prototype.insert = function(value, selectionStart, selectionEnd){
	selectionEnd = selectionEnd || selectionStart;
	var firstPart = this.value.slice(0,selectionStart);
	var lastPart = this.value.slice(selectionEnd,this.value.length);
	this.value = firstPart + value + lastPart;
	var e = {
		selectionStart:selectionStart,
		selectionEnd:selectionEnd,
		delta:value,
		value:this.value,
	}
	//this.broadcast(e);
	this.dispatchEvent('change',e);
}

Value.prototype.deleteAt = function(value, selectionStart, selectionEnd){
	selectionEnd = selectionEnd || selectionStart;
	var firstPart = this.value.slice(0,selectionStart);
	var lastPart = this.value.slice(selectionStart,this.value.length);
	this.value = firstPart + value + lastPart;
	var e = {
		selectionStart:selectionStart,
		selectionEnd:selectionEnd,
		delta:value,
		value:this.value,
	}
	this.dispatchEvent('change',e);
}