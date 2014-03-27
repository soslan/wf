function Container(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		className:"container"
	});
	this.contentType = new Value({
		value: "lines",
	});

	this.position = new Value({
		value: "new-line",
	});

	if(args.flex){
		this.element.style.flex = args.flex;
	}

	if(typeof args.contentType == "string"){
		if(args.contentType === "blocks"){
			this.contentType.set("blocks");
		}
		else if(args.contentType === "lines"){
			this.contentType.set("lines");
		}
	}

	if(typeof args.position == "string"){
		if(args.position === "inline"){
			this.position.set("inline");
		}
		else if(args.position === "new-line"){
			this.position.set("new-line");
		}
	}

	this.contentType.addEventListener('change',onContentTypeOrPositionChange);
	this.position.addEventListener('change',onContentTypeOrPositionChange);

	var onContentTypeOrPositionChange = function(){
		var c = self.contentType;
		var p = self.position;
		if(c === "blocks" && p === "inline"){
			self.element.style.display = inlineFlex;
		}
		else if(c === "blocks" && p === "new-line"){
			self.element.style.display = flex;
		}
		else if(c === "lines" && p === "inline"){
			self.element.style.display = inlineBlock;
		}
		else if(c === "lines" && p === "new-line"){
			self.element.style.display = inlineFlex;
		}
	};

	onContentTypeOrPositionChange();
	
	if(typeof args.direction === "string"){
		if(args.direction === "v"){
			this.element.style.flexDirection = "column";
		}
		else if(args.direction === "h"){
			this.element.style.flexDirection = "row";
		}
	}

	if(typeof args.share !== "undefined"){
		this.element.style.flex = args.share;
	}

	if(args.mode == "full"){
		this.addClass("container-full");
	}

	//this.container.appendChild(this.contentBlock);


}

Container.prototype = Object.create(Element.prototype);
