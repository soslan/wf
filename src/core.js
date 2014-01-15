// Core layer
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
	var classList = className.split(' ');
	for(var i in classList){
		this.element.classList.add(classList[i]);
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

Element.prototype.addEventListener = function(type, handler){
	if(typeof handler == "function"){
		this.element.addEventListener(type, handler);
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
	this.focusable(args);
	if(this.element.tagName != 'input' && this.element.tagName != 'textarea'){
		this.element.setAttribute('contenteditable','true');
	}
	else if(this.element.tagName == 'input'){
		this.element.setAttribute('type','text');
	}
	if(args.onChange){
		this.addEventListener('input',function(e){
			args.onChange({
				value: self.value()
			});
		});
	}
	this.isEditable = true;
}

Element.prototype.clickable = function(args){
	var self = this;
	this.focusable(args);
	if(args.onClick){
		this.addEventListener('click',function(e){
			args.onClick({
				value: self.value()
			});
		});
	}
	this.isClickable = true;
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