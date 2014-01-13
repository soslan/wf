// Core layer
function Element(args){
	var self = this;
	args=args?args:{};
	args.tagName = args.tagName ? args.tagName : "div";
	this.element = document.createElement(args.tagName);
	this.$element = $(this.element);
	this.tagName = args.tagName;
	
	this.element.className = "element";

	this.container = this.element; // Temporary.

	if(args.className){
		this.element.className += " " + args.className;
	}
	if(args.onClick){
		$(this.element).click(args.onClick);
	}
	if(args.onMouseDown){
		$(this.element).mousedown(args.onMouseDown);
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
	this.element.classList.add(className);
	return this;
}

Element.prototype.removeClass = function(className){
	this.element.classList.remove(className);
	return this;
}

// Text input

function TextInputCore(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		tagName:"input",
		className:"text-input",
	});

	this.element.setAttribute('type','text');
}

TextInputCore.prototype = Object.create(Element.prototype);