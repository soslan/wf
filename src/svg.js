function SVGElement(args){
	var self = this;
	args=args?args:{};
	args.tagName = typeof args.tagName == "string" ? args.tagName : "svg";
	this.element = document.createElementNS("http://www.w3.org/2000/svg", args.tagName);
	this.e = this.element;
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

function SVGIcon(args){
	args = {
		icon:args,
	}
	SVGElement.call(this, {
		tagName:'svg',
	});
	this.addClass('icon');
	this.setAttribute("width", 48);
	this.setAttribute("height", 48);
	this.setAttribute("viewBox", "0 0 48 48");

	this.path = new SVGElement({
		tagName:'path',
	});
	if (SVGIcon.paths[args.icon] !== undefined){
		this.path.setAttribute("d", SVGIcon.paths[args.icon]);
	}
	this.append(this.path);
}

SVGIcon.prototype = Object.create(SVGElement.prototype);

// Some of these paths are from Googles Material Design Icon Set (https://github.com/google/material-design-icons).
SVGIcon.paths = {
	'apps': "M8 16h8V8H8v8zm12 24h8v-8h-8v8zM8 40h8v-8H8v8zm0-12h8v-8H8v8zm12 0h8v-8h-8v8zM32 8v8h8V8h-8zm-12 8h8V8h-8v8zm12 12h8v-8h-8v8zm0 12h8v-8h-8v8z",
	'close': "M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z",
	'more-h': "M12 20c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm24 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-12 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
	'more-v': "M24 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
	'folder': "M20 8H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4H24l-4-4z",
}