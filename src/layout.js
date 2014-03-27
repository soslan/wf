function LayoutElement(args){
	var self = this;
	args=args?args:{};
	Element.call(this);
	this.addClass('layout-element');

	if(typeof args.share !== "undefined"){
		this.element.style.flex = args.share;
	}
	if(typeof args.direction === "string"){
		if(args.direction === "v"){
			this.element.style.flexDirection = "column";
		}
		else if(args.direction === "h"){
			this.element.style.flexDirection = "row";
		}
	}
}

LayoutElement.prototype = Object.create(Element.prototype);