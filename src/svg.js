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

SVGIcon.prototype.set = function(icon){
	if (SVGIcon.paths[icon] !== undefined){
		this.path.setAttribute("d", SVGIcon.paths[icon]);
	}
};

// Some of these paths are from Googles Material Design Icon Set (https://github.com/google/material-design-icons).
SVGIcon.paths = {
	'apps': "M8 16h8V8H8v8zm12 24h8v-8h-8v8zM8 40h8v-8H8v8zm0-12h8v-8H8v8zm12 0h8v-8h-8v8zM32 8v8h8V8h-8zm-12 8h8V8h-8v8zm12 12h8v-8h-8v8zm0 12h8v-8h-8v8z",
	'close': "M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z",
	'more-h': "M12 20c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm24 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-12 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
	'more-v': "M24 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
	'folder': "M20 8H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4H24l-4-4z",
	'trash': "M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z",
	'done': "M18 32.34l-8.34-8.34-2.83 2.83 11.17 11.17 24-24-2.83-2.83z",
	'image': "M42 38v-28c0-2.21-1.79-4-4-4h-28c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4zm-25-11l5 6.01 7-9.01 9 12h-28l7-9z",
	'download': "M38 18h-8V6H18v12h-8l14 14 14-14zM10 36v4h28v-4H10z",
	'plus': "M38 26h-12v12h-4v-12h-12v-4h12v-12h4v12h12v4z",
	'play': "M16 10v28l22-14z",
	'stop': "M12 12h24v24H12z",
	'videocam': "M34 21v-7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2v-7l8 8V13l-8 8z",
	'phone': "M13.25 21.59c2.88 5.66 7.51 10.29 13.18 13.17l4.4-4.41c.55-.55 1.34-.71 2.03-.49C35.1 30.6 37.51 31 40 31c1.11 0 2 .89 2 2v7c0 1.11-.89 2-2 2C21.22 42 6 26.78 6 8c0-1.11.9-2 2-2h7c1.11 0 2 .89 2 2 0 2.49.4 4.9 1.14 7.14.22.69.06 1.48-.49 2.03l-4.4 4.42z",
	'mic': "M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z",
	'people': "M32 22c3.31 0 5.98-2.69 5.98-6s-2.67-6-5.98-6c-3.31 0-6 2.69-6 6s2.69 6 6 6zm-16 0c3.31 0 5.98-2.69 5.98-6s-2.67-6-5.98-6c-3.31 0-6 2.69-6 6s2.69 6 6 6zm0 4c-4.67 0-14 2.34-14 7v5h28v-5c0-4.66-9.33-7-14-7zm16 0c-.58 0-1.23.04-1.93.11C32.39 27.78 34 30.03 34 33v5h12v-5c0-4.66-9.33-7-14-7z",
	'fullscreen': "M14 28h-4v10h10v-4h-6v-6zm-4-8h4v-6h6v-4H10v10zm24 14h-6v4h10V28h-4v6zm-6-24v4h6v6h4V10H28z",
	'fullscreen-exit': "M10 32h6v6h4V28H10v4zm6-16h-6v4h10V10h-4v6zm12 22h4v-6h6v-4H28v10zm4-22v-6h-4v10h10v-4h-6z",
	'messenger': "M40 4H8C5.79 4 4 5.79 4 8v36l8-8h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4z",
	'forum': "M42 12h-4v18H12v4c0 1.1.9 2 2 2h22l8 8V14c0-1.1-.9-2-2-2zm-8 12V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v28l8-8h20c1.1 0 2-.9 2-2z",
}
