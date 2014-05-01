function SVGElement(args){
	var self = this;
	args=args?args:{};
	args.tagName = typeof args.tagName == "string" ? args.tagName : "svg";
	this.element = document.createElementNS("http://www.w3.org/2000/svg", args.tagName);
	this.$element = $(this.element);
	this.$ = this.$element;
	this.tagName = args.tagName;

	if(typeof args.className == "string"){
		this.addClass(args.className);
	}
}

SVGElement.prototype.append = function(element){
	this.element.appendChild(element.element);
	return this;
}

SVGElement.prototype.prepend = function(element){
	$(this.element).prepend(element.element);
	return this;
}


SVGElement.prototype.setAttribute = function(attr, val){
	this.element.setAttribute(attr, val);
};

SVGElement.prototype.addClass = function(className){
	if(typeof className == "string"){
		this.setAttribute('class',this.element.getAttribute('class') + ' ' + className);
		/*var classList = className.split(' ');
		for(var i in classList){
			this.element.classList.add(classList[i]);
		}*/
	}
	return this;
}

SVGElement.prototype.removeClass = function(className){
	var classList = className.split(' ');
	for(var i in classList){
		this.element.classList.remove(classList[i]);
	}
	return this;
}
