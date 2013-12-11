function Base(args){
	args=args?args:{};
	args.tag = args.tag ? args.tag : "div";
	this.container = document.createElement(args.tag);

	this.container.className = "element-container";
	if(args.className){
		this.container.className += " " + args.className;
	}
}

Base.prototype.append = function(element){
	this.container.appendChild(element.container);
	return this;
}

Base.prototype.addClass = function(className){
	this.container.classList.add(className);
	return this;
}

function Container(args){
	Base.call(this);
	args=args?args:{};

	this.addClass("container");

	if(args.mode == "full"){
		this.addClass("container-full");
	}
}

Container.prototype = Object.create(Base.prototype);

function Button(args){
	Base.call(this,{
		tag:"button",
		className:"button",
	});
	args=args?args:{};

	this.container.innerHTML=args.value?args.value:"Submit";

	this.container.classList.add("button");
	var timer;

	$(this.container).click(function(){
		if(args.callback)
			args.callback();
	});

	this.setTimeOut=function(time){

		timer=setTimeout(function(){

			if(args.callback)
				args.callback();
			clearTimeout(timer);
		},time);
	};

	this.stopTimeOut=function(){
		clearTimeout(timer);
	}

	//return elem;
}

Button.prototype = Object.create(Base.prototype);

function Toggle(args){
	Base.call(this,{
		tag:"span",
		className:"toggle",
	});
	args = args?args:{};
	var self = this;
	this.switcher = document.createElement('span');
	this.value = args.value ? args.value : 0;

	this.switcher.className="toggle-switcher";

	if(this.value == 1){
		this.value = 1;
		this.addClass("on");
		this.switcher.innerHTML = "ON";
	}
	else{
		this.value = 0;
		this.addClass("off");
		this.switcher.innerHTML = "OFF";
	}

	$(this.container).click(function(){
		self.toggle();
	});

	this.container.appendChild(this.switcher);

	//return elem;
}

Toggle.prototype = Object.create(Base.prototype);

Toggle.prototype.on = function(){
	if(this.value == 0){
		this.value = 1;
		this.addClass("on");
		this.switcher.innerHTML = "ON";
	}
	
}

Toggle.prototype.off = function(){
	if(this.value == 1){
		this.value = 0;
		this.addClass("off");
		this.switcher.innerHTML = "OFF";
	}
	
}

Toggle.prototype.toggle = function(){
	if(this.value == 0){
		this.value = 1;
		this.addClass("on");
		this.switcher.innerHTML = "ON";
	}
	else{
		this.value = 0;
		this.addClass("off");
		this.switcher.innerHTML = "OFF";
	}
	
}


function Txt(args){
	var elem=document.createElement('span');
	args=args?args:{};

	elem.innerHTML=args.value?args.value:"Some text.";

	if(args.className){
		elem.classList.add(args.className);
	}

	this.setValue=function(value){
		elem.innerHTML=value;
	};

	this.getElement=function(){
		return elem;
	}

	//return elem;

};


function TextInput(args){
	args=args?args:{};
	var elem = document.createElement('input');

	elem.setAttribute("type","text");
	elem.className="input-text";
	if(args.class){
		elem.classList.add(args.class);
	}

	this.setValue=function(value){
		$(elem).val(value);
	}

	this.getValue=function(){
		return $(elem).val();
	};

	this.getElement=function(){
		return elem;
	}
}
