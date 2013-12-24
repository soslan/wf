function Base(args){
	args=args?args:{};
	args.tag = args.tag ? args.tag : "div";
	this.container = document.createElement(args.tag);

	this.container.className = "element-container";
	if(args.className){
		this.container.className += " " + args.className;
	}

	/*$(this.container).mousedown(function(e){
		e.stopPropagation();
		e.preventDefault();
		return false;
	})*/
}

Base.prototype.append = function(element){
	this.container.appendChild(element.container);
	return this;
}

Base.prototype.addClass = function(className){
	this.container.classList.add(className);
	return this;
}

Base.prototype.removeClass = function(className){
	this.container.classList.remove(className);
	return this;
}

function Container(args){
	var self = this;
	Base.call(this,{
		className:"container",
	});
	args=args?args:{};

	if(args.flex){
		this.container.style.flex = args.flex;
	}

	if(args.direction){
		if(args.direction == 'v'){
			this.container.style.flexDirection = 'column';
		}
	}

	//this.addClass("container");

	this.contentBlock = document.createElement('div');

	this.contentBlock.className = "container-content";

	if(args.mode == "full"){
		this.addClass("container-full");
	}

	this.container.appendChild(this.contentBlock);


}

Container.prototype = Object.create(Base.prototype);

Container.prototype.append = function(element){
	this.contentBlock.appendChild(element.container);
	return this;
}

Container.prototype.appendContainer = function(element){
	this.container.appendChild(element.container);
	return this;
}

function Button(args){
	Base.call(this,{
		tag:"span",
		className:"button inline",
	});
	args=args?args:{};

	//this.container.innerHTML=args.value?args.value:"Button";

	this.container.classList.add("button");
	var timer;

	$(this.container).click(function(e){
		e.stopPropagation();
		e.preventDefault();
		if(args.onClick){
			args.onClick();
		}
		return false;
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
		className:"toggle inline",
	});
	args = args?args:{};
	var self = this;
	this.switcher = document.createElement('span');
	this.value = args.value ? args.value : 0;

	this.switcher.className="toggle-switcher";

	if(this.value == 1){
		this.value = 1;
		this.addClass("on");
		this.removeClass("off");
		this.switcher.innerHTML = "ON";
	}
	else{
		this.value = 0;
		this.addClass("off");
		this.removeClass("on");
		this.switcher.innerHTML = "OFF";
	}

	$(this.container).click(function(){
		self.toggle();
		if(args.onToggle){
			args.onToggle({
				value:self.value,
			});
		}
	});

	this.container.appendChild(this.switcher);

	//return elem;
}

Toggle.prototype = Object.create(Base.prototype);

Toggle.prototype.on = function(){
	if(this.value == 0){
		this.value = 1;
		this.addClass("on");
		this.removeClass("off");
		this.switcher.innerHTML = "ON";
	}
	
}

Toggle.prototype.off = function(){
	if(this.value == 1){
		this.value = 0;
		this.addClass("off");
		this.removeClass("on");
		this.switcher.innerHTML = "OFF";
	}
	
}

Toggle.prototype.toggle = function(){
	if(this.value == 0){
		this.on();
	}
	else{
		this.off();
	}
	
}

function List(args){
	Base.call(this,{
		tag:"ul",
		className:"list",
	});
	args = args?args:{};
	var self = this;


}

List.prototype = Object.create(Base.prototype);

List.prototype.append = function(element){
	var li = document.createElement('li');
	li.appendChild(element.container);
}

function Slider(args){
	Base.call(this,{
		className:"slider inline",
	});
	args = args?args:{};
	var self = this;

	var sliderButton = document.createElement('span');
	var progress = document.createElement('span');

	sliderButton.className = "slider-button";
	progress.className = "slider-progress";
	this.progressValue = 0;

	this.start = args.start ? args.start : 0;
	this.end = args.end ? args.end : 100;

	var pressed = false;
	var initialMousePosition;
	var savedPosition;

	var savedMouseUp;
	var savedMouseMove;

	$(sliderButton).click(function(e){
		e.stopPropagation();
		return false;
	})
	$(sliderButton).mousedown(function(e){
		e.stopPropagation();
		e.preventDefault();
		if(e.which == 1){
			sliderButton.classList.add('active');
			pressed = true;
			initialMousePosition = e.pageX;
			savedPosition = $(sliderButton).position().left;

			$(document).bind('mouseup',function(e){
				e.stopPropagation();
				if(e.which == 1){
					sliderButton.classList.remove('active');
					pressed = false;

					if(args.onChanged){
						args.onChanged({
							progress:self.progressValue,
							value:self.getValue(),
						});
					}
					$(document).unbind('mouseup');
					$(document).unbind('mousemove');
				}

				
				return false;
			});

			$(document).bind('mousemove',function(e){
				if(pressed){
					var shift = e.pageX - initialMousePosition;
					var newPosition = savedPosition + shift;
					if(newPosition < -5){
						newPosition = -5;
					}
					else if(newPosition >= $(self.container).width()-6){
						newPosition = $(self.container).width() - 6;
					}
					self.progressValue = 100 * (newPosition +5) / ($(self.container).width() - 1);
					$(sliderButton).css({left:newPosition + "px"});
					$(progress).css({width:newPosition+"px"});
					if(args.onChange){
						args.onChange({
							progress:self.progressValue,
							value:self.getValue(),
						});
					}
			
				}

			});

		}
		e.stopPropagation();
		return false;
	});

	

	$(this.container).click(function(e){
		var newPosition = e.pageX - $(this).offset().left;
		if(newPosition <0){
			newPosition = 0;
		}
		else if(newPosition >= $(self.container).width()){
			newPosition = $(self.container).width() - 6;
		}
		self.progressValue = 100 * (newPosition) / ($(self.container).width() - 1);
		$(sliderButton).animate({left:newPosition - 5},'fast');
		$(progress).animate({width:newPosition - 5},'fast');
		if(args.onChange){
			args.onChange({
				progress:self.progressValue,
				value:self.getValue(),
			});
		}

		if(args.onChanged){
			args.onChanged({
				progress:self.progressValue,
				value:self.getValue(),
			});
		}
		
		return false;
	});



	this.container.appendChild(progress);
	this.container.appendChild(sliderButton);
}

Slider.prototype = Object.create(Base.prototype);

Slider.prototype.getProgress = function(){
	return $(sliderButton).position;
}

Slider.prototype.getValue = function(){
	return this.start + (this.progressValue * 1.0 * (this.end - this.start) / 100)
}

Slider.prototype.setPosition = function(newPosition){

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
	Base.call(this,{
		className:"text-input inline",
	});
	args = args?args:{};
	var self = this;

	this.inputElement = document.createElement('input');
	this.inputElement.setAttribute('type','text');

	this.container.appendChild(this.inputElement);

	if(args.onChange){
		$(this.inputElement)[0].oninput = function () {
			args.onChange({
				value:self.inputElement.value,
			});
		};
	}	
}

TextInput.prototype = Object.create(Base.prototype);

function Span(args){
	Base.call(this,{
		className:"span",
	});
	args = args?args:{};
	var self = this;

	if(args.value){
		this.container.innerHTML = args.value;
	}


}

function Select(args){
	Base.call(this,{
		className:"inline",
	});
	args = args?args:{};
	var self = this;

	this.active = false;

	this.button = new Button({
		onClick:function(){
			if(self.active){
				self.fold();
			}
			else{
				self.show();
			}
			
		},
	});
	this.selectedSpan = new Span({value:""});
	this.button.append(this.selectedSpan);
	this.optionsContainer = document.createElement('div');

	this.optionsContainer.className = "select-options";

	this.selectedOptionElement;



	this.container.appendChild(this.button.container);
	this.container.appendChild(this.optionsContainer);



}

Select.prototype = Object.create(Base.prototype);

Select.prototype.show = function(){
	var self=this;
	self.active = true;
	$(this.optionsContainer).slideDown(function(){
		self.button.addClass('active');
	});
};

Select.prototype.fold = function(){
	var self=this;
	self.active = false;
	$(this.optionsContainer).slideUp(function(){
		self.button.removeClass('active');
	});
};

Select.prototype.setSelectedValue = function(value){
	this.selectedSpan.container.innerHTML = value;
}

Select.prototype.append = function(value, select){
	var self = this;
	var optionContainer = document.createElement('div');
	optionContainer.className = "select-option";
	optionContainer.innerHTML = value;
	$(optionContainer).click(function(){
		if(self.selectedOptionElement)
			self.selectedOptionElement.classList.remove('selected');
		this.classList.add('selected');
		self.selectedOptionElement = this;
		self.setSelectedValue(this.innerHTML);
	});
	if(select){
		if(self.selectedOptionElement)
			self.selectedOptionElement.classList.remove('selected');
		optionContainer.classList.add('selected');
		self.selectedOptionElement = optionContainer;
		self.setSelectedValue(value);
	}
	//optionContainer.setAttribute('value',value);
	this.optionsContainer.appendChild(optionContainer);
	return this;

};
