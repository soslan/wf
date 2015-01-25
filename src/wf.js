//document.oncontextmenu = function () { // Use document as opposed to window for IE8 compatibility
//   return false;
//};
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

// HTML Elements layer

//
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

function Block(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		className: "block-container"
	});

}

Block.prototype = Object.create(Element.prototype);

// Controls layer

function Control(args){
	var self = this;
	args = args?args:{};
	Element.call(this,args);
	this.addClass('control');
	this.addClass(args.className);
	this.focusingElement = this;

	this.label = new Label({
		text:args.label,
		icon:args.icon,
	});
	this.label.focusing(this);

	this.append(this.label);
}

Control.prototype = Object.create(Element.prototype);

function Button2(args){
	var self = this;
	args = args || {};
	Element.call(this, {
		className: args.className,
	});
	this.addClass("button");
	this.clickable();
	if(typeof args.action == "function"){
		this.setAction(args.action);
	}
	else{
		this.setAction(args.onClick);
	}
	this.label = new Label({
		text:args.text || args.label,
		icon:args.icon
	});

	this.append(this.label);
}

Button2.prototype = Object.create(Element.prototype);

function Button(args){
	var self = this;
	args = args || {};
	Element.call(this, {
		className: args.className,
	});
	this.addClass("clickable button");
	this.focusable();
	if(typeof args.action == "function"){
		this.setAction(args.action);
	}
	else if(typeof args.onClick == "function"){
		this.setAction(args.onClick);
	}
	if(args.icon !== undefined){
		this.appendIcon(args.icon);
	}
	else if(args.iconBefore !== undefined){
		this.append(args.iconBefore);
	}
	this.append(args.text || args.caption || args.label);
	if(args.iconAfter !== undefined){
		this.append(args.iconAfter);
	}
}

Button.prototype = Object.create(Element.prototype);

Button.prototype.appendIcon = function(arg){
	if (arg instanceof Icon){
		this.append(arg);
	}
	else if (arg !== undefined){
		var icon = new SVGIcon(arg)
		this.append(icon);
		return icon;
	}
}

function ToggleButton(args){
	var self = this;
	args = args?args:{};
	Button.call(this,args);

	if(args.value instanceof BooleanModel){
		this.value = args.value;
	}
	else{
		this.value = new BooleanModel({
			value:args.defaultValue == undefined ? args.defaultValue : false,
		});
	}

	this.value.addEventListener('on', function(){
		console.log("on");
		self.removeClass('inactive');
		self.addClass('active');
		if(args.onIcon != undefined){
			self.label.setIcon(args.onIcon);
		}
	});

	this.value.addEventListener('off', function(){
		console.log("off");
		self.removeClass('active');
		self.addClass('inactive');
		if(args.offIcon != undefined){
			self.label.setIcon(args.offIcon);
		}
	});

	/*this.addEventListener('mousedown touchstart',function(e){
		console.log(e.type);
		if(!self.value.get()){
			self.value.true();
			e.preventDefault();
			self.pressed = true;
			//e.stopPropagation();
		}
		else{
			self.pressed = false;
		}
		//self.value.flip();
		//e.preventDefault();
		e.stopPropagation();
	});
	this.addEventListener('mouseup touchend',function(e){
		console.log(e.type);
		if(self.pressed){
			self.pressed = false;
		}
		else{
			self.value.false();
		}
		//self.value.false();
		
		//self.value.flip();
		e.preventDefault();
		e.stopPropagation();
	});*/
	this.setAction(function(){
		self.value.flip();
	});;
}

ToggleButton.prototype = Object.create(Button.prototype);

ToggleButton.prototype.onOn = function(handler){
	this.value.onTrue(handler);
};

ToggleButton.prototype.onOff = function(handler){
	this.value.onFalse(handler);
};

function Dropdown(args, dropdownArgs){
	var self = this;
	var args = args || {};
	Element.call(this,{});
	this.addClass('dropdown-container group');

	dropdownArgs = dropdownArgs || {};
	// this.pointer = new Element({
	// 	className:'dropdown-pointer',
	// 	appendTo:this,
	// });
	// this.pointerBack = new Element({
	// 	className:'dropdown-pointer-back',
	// 	appendTo:this,
	// });
	this.panelContainer = new Container({
		className:'dropdown-panel-container',
		appendTo:this,
	});
	this.panel = new Container(dropdownArgs);
	this.panel.addClass('dropdown');
	this.panelContainer.addEventListener('before-displayed', function(){
		self.panelContainer.e.style.visibility = 'hidden';
		self.panelContainer.e.style.left = '';
		self.panelContainer.removeClass('hidden');
		var width = self.panel.e.offsetWidth;
		var screenWidth = window.innerWidth;


		if (width >= screenWidth){
			var offset = self.panel.positionWithinWindow()[0];
			self.panel.e.style.left = (-offset)+"px";
			self.panel.e.style.right = (-offset + screenWidth - width) + "px";
		}
		else{
			var offset = self.panel.positionWithinWindow()[0];
			if (offset > screenWidth / 2){
				self.panel.e.style.left = Math.max(( -width + self.panel.e.offsetParent.offsetWidth), -offset) + "px";
			}
			else if(offset < 0){
				self.panel.e.style.left = (offset) + "px";
			}
		}
		self.panelContainer.e.style.visibility = 'visible';
		//alert(self.panel.e.offsetLeft);
		//self.hidden.false();
	});
	args.value = this.panelContainer.displayed;
	args.style = args.buttonStyle;
	this.button = new ToggleButton(args);
	this.panel.on('click', function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	this.panel.on('mousedown', function(e){
		e.stopPropagation();
		//e.preventDefault();
	});
	this.panelContainer.on('displayed', function(){
		self.panel.focus();
	});
	this.button.on('mousedown',function(e){
		e.preventDefault();
		e.stopPropagation();
	})
	this.panel.focusable();
	this.button.on('focusout', function(e){
		if(self.button.value && e.relatedTarget !== self.panel.e && !self.panel.isAncestorOf(e.relatedTarget)){
			self.button.value.false();
		}
	});
	this.panel.on('focusaway',function(e){
		if(e.detail.relatedTarget !== self.button.e){
			self.panelContainer.hide();
		}
		
	});
	this.panelContainer.hide();
	this.append(this.button);
	this.panelContainer.append(this.panel);
}

Dropdown.prototype = Object.create(Element.prototype);

function Toggle(args){
	var self = this;
	args=args?args:{};
	Control.call(this,{
		tagName:"span",
		label:args.label,
		icon:args.icon
	});
	this.addClass('control-toggle toggle');

	if(!args.value){
		this.value = 0;
	}
	else{
		this.value = 1;
	}
	this.toggleElement = new Element({
		className:"toggle-main"
	});
	this.switcher = new Element({
		className:"toggle-switcher"
	});

	this.toggleElement.focusing(this.switcher);
	this.switcher.focusable(args);
	this.switcher.draggable({
		mode:'h',
		minX:0,
		maxX:function(){
			return self.toggleElement.$.width() / 2;
		},
		afterNoMove:function(e){
			self.toggle();
		},
		afterDrag:function(e){
			var pos = self.switcher.$.position().left;
			var limit = self.toggleElement.$.width() / 4;
			if(self.value == 0){
				if(pos > limit){
					self.toggle();
				}
				else{
					self.switcher.$.animate({
						left:0,
					});
				}
			}
			else if(self.value == 1){
				if(pos < limit){
					self.toggle();
				}
				else{
					self.switcher.$.animate({
						left:'50%',
					});
				}
			}
		},
	});
	this.setFocusingElement(this.switcher);
	this.switcher.addClass("toggle-switcher");

	if(this.value == 1){
		this.value = 1;
		this.addClass("on");
		this.switcher.addClass("on");
	}
	else{
		this.value = 0;
		this.addClass("off");
		this.switcher.addClass("off");
	}

	if(args.onToggle){
		this.onToggle = args.onToggle;
	}
	else{
		this.onToggle = function(){};
	}

	this.toggleElement.$element.click(function(){
		self.toggle();
	});

	this.$element.keydown(function(e){
		if(e.which == 13 || e.which == 32){
			self.toggle();
		}
		else if(e.which == 39){
			if(!self.value){
				self.toggle();
			}
		}
		else if(e.which == 37){
			if(self.value){
				self.toggle();
			}
		}
	});

	this.toggleElement.element.appendChild(this.switcher.element);
	this.element.appendChild(this.toggleElement.element);

	//return elem;
}

Toggle.prototype = Object.create(Control.prototype);

Toggle.prototype.on = function(){
	if(this.value == 0){
		this.value = 1;
		this.switcher.$
			.stop()
			.animate({
				left:'50%',
			},'fast')
			.addClass("on")
			.removeClass("off");

		this.addClass("on");
		this.removeClass("off");
	}
	
}

Toggle.prototype.off = function(){
	if(this.value == 1){
		this.value = 0;
		this.switcher.$
			.stop()
			.animate({
				left:'0',
			},'fast')
			.addClass("off")
			.removeClass("on");
		this.addClass("off");
		this.removeClass("on");
	}
	
}

Toggle.prototype.toggle = function(){
	if(this.value == 0){
		this.on();
	}
	else{
		this.off();
	}
	this.onToggle({
		value:this.value,
	});
	
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
	var self = this;
	args=args?args:{};
	Control.call(this,{
		tagName:"span",
		label:args.label,
		icon:args.icon
	});
	this.addClass('slider');

	this.start = args.start ? args.start : 0;
	this.end = args.end ? args.end : 100;

	if(!args.value){
		this.value = 0;
	}
	else{
		if(args.value>this.end){
			this.value = this.end;
		}
		else if(args.value<this.start){
			this.value = this.start;
		}
		else{
			this.value = args.value;
		}
	}
	this.sliderContainer = new Element({
		tagName:"span",
		className:"slider-container"
	});

	this.sliderLine = new Element({
		tagName:"span",
		className:"slider-line"
	});

	this.sliderButton = new Element({
		tagName:"span",
		className:"slider-button"
	});

	this.sliderProgress = new Element({
		tagName:"span",
		className:"slider-progress"
	});

	if(args.tabIndex){
		this.sliderButton.element.setAttribute('tabindex',args.tabIndex);
	}
	else{
		this.sliderButton.element.setAttribute('tabindex','-1');
	}

	this.sliderButton.$element.keydown(function(e){
		if(e.which == 39){
			self.increaseBy((self.end - self.start) / 20);
		}
		else if(e.which == 37){
			self.increaseBy( - (self.end - self.start) / 20);
		}
	});

	this.label.$element.click(function(){
		self.sliderButton.$element.focus();
	});
	this.label.$element.mousedown(function(){
		return false;
	});

	this.progressValue = 0;

	var pressed = false;
	var initialMousePosition;
	var savedPosition;

	var savedMouseUp;
	var savedMouseMove;

	this.sliderButton.$element.mousedown(function(e){
		if(e.which == 1){
			self.sliderButton.$element.focus();
			self.sliderButton.element.classList.add('active');
			pressed = true;
			initialMousePosition = e.pageX;
			savedPosition = self.sliderButton.$element.position().left;

			$(document).bind('mouseup',function(e){
				if(e.which == 1){
					self.sliderButton.element.classList.remove('active');
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
					else if(newPosition >= self.sliderContainer.$element.width()-6){
						newPosition = self.sliderContainer.$element.width() - 6;
					}
					self.progressValue = 100 * (newPosition +5) / (self.sliderContainer.$element.width() - 1);
					self.sliderButton.$element.css({left:newPosition + "px"});
					self.sliderProgress.$element.css({width:newPosition + "px"});
					if(args.onChange){
						args.onChange({
							progress:self.progressValue,
							value:self.getValue(),
						});
					}
			
				}
				return false;
			});

		}
		return false;
	});

	if(args.onChange){
		this.onChange = args.onChange;
	}
	else{
		this.onChange = function(){};
	}

	if(args.onChanged){
		this.onChanged = args.onChanged;
	}
	else{
		this.onChanged = function(){};
	}

	this.sliderContainer.$element.mousedown(function(){
		return false;
	});

	this.sliderContainer.$element.click(function(e){
		self.sliderButton.$element.focus();
		var newPosition = e.pageX - self.sliderContainer.$element.offset().left;
		if(newPosition <0){
			newPosition = 0;
		}
		else if(newPosition >= self.sliderContainer.$element.width()){
			newPosition = self.sliderContainer.$element.width() - 6;
		}
		self.progressValue = 100 * (newPosition) / (self.sliderContainer.$element.width() - 1);
		self.setValueByProgress(self.progressValue/100);
		return false;
	});

	this.element.appendChild(this.label.element);
	this.element.appendChild(this.sliderContainer.element);
	this.sliderContainer.element.appendChild(this.sliderLine.element);
	this.sliderContainer.element.appendChild(this.sliderProgress.element);
	this.sliderContainer.element.appendChild(this.sliderButton.element);
}

Slider.prototype = Object.create(Control.prototype);

Slider.prototype.increaseBy=function(val){
	var newValue = this.value + val;
	if(newValue>this.end){
		newValue = this.end;
	}
	else if(newValue<this.start){
		newValue = this.start;
	}
	if(this.value !== newValue){
		this.setValue(newValue);
	}
}

Slider.prototype.setValue = function(val){
	this.value = val;
	var newProgress = val / (this.end - this.start);
	var newPosition = newProgress * (this.sliderContainer.$element.width() - 1);
	this.sliderButton.$element.stop().animate({left:newPosition - 5},'fast');
	this.sliderProgress.$element.stop().animate({width:newPosition - 5},'fast');
	this.onChange({
		progress:newProgress,
		value:val,
	});
	this.onChanged({
		progress:newProgress,
		value:val,
	});
}

Slider.prototype.setValueByProgress = function(progress){
	var newValue = progress * (this.end - this.start);
	if(newValue>this.end){
		newValue = this.end;
	}
	else if(newValue<this.start){
		newValue = this.start;
	}
	this.setValue(newValue);
}

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
	var self = this;
	args=args?args:{};
	Control.call(this,{
		label:args.label,
		icon:args.icon
	});
	this.addClass('control control-text-input');
	this.addClass('text-input');

	/*if(!args.value){
		this.value = '';
	}
	else{
		this.value = args.value;
	}*/

	this.input = new TextInputCore({
		value:args.value,
		onChange:args.onChange,
	});
	this.value = this.input.value;
	this.setFocusingElement(this.input);

	this.input.addClass("text-input-input");

	this.input.addEventListener('keydown',function(e){
		if(e.which == 13){
			if(args.onEnter){
				args.onEnter({
					value:self.input.$element.val(),
				});
			}
		}
	});

	this.append(this.input);
}

TextInput.prototype = Object.create(Control.prototype);

TextInput.prototype.addButton = function(args){
	var button = new Button(args);
	this.append(button);
	return button;
}

function Span(args){
	args=args?args:{};
	args.className = "span inline";
	Base.call(this,args);
	var self = this;

	if(args.value){
		this.container.innerHTML = args.value;
	}


}

/*
 Dont like it.
 Requires optimization.
 Dropdown list need to be abstracted.
*/

function CheckBox(args){
	var self = this;
	args = args || {};
	args.tagName = 'input';
	Element.call(this, args);
	this.attr('type', 'checkbox');
	this.addClass('checkbox');
}

CheckBox.prototype = Object.create(Element.prototype);

function Select(args){
	var self = this;
	args=args?args:{};
	Control.call(this,{
		label:args.label,
		icon:args.icon
	});
	this.addClass('control control-select');
	this.addClass('select');

	this.button = new Button({
		tabIndex:args.tabIndex,
		//label:"",
		icon:"caret-down",
	});
	this.button.addClass('select-button');
	this.focusingElement = this.button.focusingElement;
	this.selectContainer = new Element({
		tagName:"div",
		className:"select-container",
	});

	this.optionsContainer = new Element({
		tagName:"div",
		className:"select-options",
	});
	this.selectedSpan = new Element({
		tagName:"span",
		className:"select-current",
	});

	this.active = false;
	this.flag = 0;

	this.button.addEventListener('mousedown',function(){
		self.flag = 4;
	});

	this.button.$element.click(function(){
		if(self.active){
			self.fold();
			self.button.focus();
		}
		else{
			self.show();
			self.optionsContainer.$element.find('.select-option.focused').focus();
			self.flag = 3;
		}
		return false;
	});

	this.button.$element.keydown(function(e){
		if(e.which == 13 || e.which == 32){
			if(self.active){
				self.fold();
			}
			else{
				self.show();
				self.optionsContainer.$element.find('.select-option.focused').focus();
				self.flag = 3;
			}
			return false;
		}
		else if(e.which == 38){
			//self.optionUp();
		}
		else if(e.which == 40){
			self.show();
			self.optionsContainer.$element.find('.select-option.focused').focus();
			self.flag = 3;
			//self.optionDown();
		}
	});

	this.selectedSpan.$element.mousedown(function(){
		return false;
	});

	this.selectedSpan.$element.click(function(){
		if(self.active){
			self.fold();
			self.button.focus();
		}
		else{
			self.show();
			self.optionsContainer.$element.find('.select-option.focused').focus();
			self.flag = 3;
		}
		return false;
	})

	this.onChange = function(args2){
		if(args.onChange){
			args.onChange(args2);
		}
	}

	this.selectContainer.element.appendChild(this.selectedSpan.element);
	this.selectContainer.element.appendChild(this.optionsContainer.element);
	this.element.appendChild(this.label.element);
	this.element.appendChild(this.selectContainer.element);
	this.element.appendChild(this.button.element);
}

Select.prototype = Object.create(Control.prototype);

Select.prototype.show = function(){
	var self=this;
	self.active = true;
	this.button.label.setIcon('caret-up');
	this.optionsContainer.$element.stop()
		//.width($(self.container).outerWidth())
		//.slideDown('fast');
		.css({
			visibility:'visible'
		})
		.animate({
			opacity:1,
		},'fast');
	self.button.addClass('active');
};

Select.prototype.fold = function(){
	var self=this;
	self.active = false;
	this.button.label.setIcon('caret-down');
	this.optionsContainer.$element.stop()
		//.slideUp('fast');
		.animate({
			opacity:0,
		},'fast',function(){
			$(this).css({
				visibility:'hidden',
			});
		});
	self.button.removeClass('active');
};

Select.prototype.setSelectedValue = function(value){
	this.selectedSpan.container.innerHTML = value;
}

Select.prototype.addOption = function(value, select){
	var self = this;
	var optionContainer = document.createElement('div');
	optionContainer.className = "select-option";
	optionContainer.setAttribute('tabindex','-1');
	optionContainer.innerHTML = value;
	$(optionContainer).mousedown(function(){
		return false;
	});
	$(optionContainer).click(function(){
		if(self.selectedOptionElement)
			self.selectedOptionElement.classList.remove('focused');
		this.classList.add('focused');
		self.selectedOptionElement = this;
		self.fold();
		self.button.focus();
		self.setSelectedValue(this.innerHTML);
		self.onChange({
			value: this.innerHTML,
		});
	});

	$(optionContainer).blur(function(){
		if(self.flag==4){
			return false;
		}
		else{
			self.fold();
		}
	});
	$(optionContainer).keydown(function(e){
		if(e.which == 40){
			var next = self.optionsContainer.$element.find('.select-option.focused').next();
			if(next.length > 0){
				self.flag = 4;
				optionContainer.classList.remove('focused');
				next[0].classList.add('focused');
				next.focus();
				self.flag = 3;
			}
		}
		else if(e.which == 38){
			var prev = self.optionsContainer.$element.find('.select-option.focused').prev();
			if(prev.length > 0){
				self.flag = 4;
				optionContainer.classList.remove('focused');
				prev[0].classList.add('focused');
				prev.focus();
				self.flag = 3;
			}
			else{
				self.fold();
				self.button.focus();
			}
		}
		else if(e.which == 27 || e.which == 8){
			self.fold();
			self.button.focus();
		}
		else if(e.which == 13){
			if(self.selectedOptionElement)
				self.selectedOptionElement.classList.remove('focused');
			this.classList.add('focused');
			self.selectedOptionElement = this;
			self.fold();
			self.button.focus();
			//self.fold();
			self.setSelectedValue(this.innerHTML);
			self.onChange({
				value: this.innerHTML,
			});
		}
		return false;
	});
	if(select){
		if(self.selectedOptionElement)
			self.selectedOptionElement.classList.remove('focused');
		optionContainer.classList.add('focused');
		self.selectedOptionElement = optionContainer;
		self.setSelectedValue(value);
	}
	//optionContainer.setAttribute('value',value);
	this.optionsContainer.element.appendChild(optionContainer);
	return this;

};

function Icon(arg1){
	var self = this;
	var args;
	if (typeof arg1 === "string"){
		args = {};
		args.icon = arg1;
	}
	else if (typeof arg1 === "object"){
		args = arg1;
	}
	else{
		args = {};
	}

	args.tagName = 'i';
	args.className = 'fa icon';
	Element.call(this, args);
	this.set(args.icon);
}

Icon.prototype = Object.create(Element.prototype);

Icon.prototype.set = function(arg1){
	if (typeof arg1 === "string"){
		this.removeClass('fa-' + this.icon);
		this.icon = arg1;
		this.addClass('fa-' + arg1);
	}
}

function SegmentedControl(args){
	args=args?args:{};
	args.className = "segmented-control inline";
	Base.call(this,args);
	var self = this;

	this.segmentsContainer = document.createElement('span');
	this.segmentsContainer.className = 'segmented-control-segments';
}

SegmentedControl.prototype.append = function(args){
	var button = document.createElement('span');
	button.className='segmented-control-button';

	if(args.label){
		button.innerHTML = args.label;
	}
	if(args.onClick){
		$(button).click(function(e){
			if(e.which == 1){
				args.onClick();
			}
		});
	}
}

function Menu(args){
	var self = this;
	args = args?args:{};
	Element.call(this,{
		className:'menu'
	});


}

Menu.prototype = Object.create(Element.prototype);

Menu.prototype.append = function(obj){
	this.element.appendChild(obj.element);
}

function Frames(args){
	Base.call(this,{
		className:"frames",
	});
	args = args?args:{};
	var self = this;



}

function text(text){
	return new Text(text || '');
}

function span(text, className, appendTo){
	var out = new Element({
		tagName:'span',
	});
	if(typeof className === 'string'){
		out.addClass(className);
	}
	out.append(text);
	
	return out;
}

function e(tag, className, appendTo){
	if (arguments.length == 0){
		return new Element();
	}
	else if(arguments.length == 1){
		if (typeof tag == "string"){
			return new Element({
				tagName:tag,
			})
		}
	}
	else if(arguments.length == 2){
		if (typeof tag == "string"){
			if (typeof className == "string"){
				return new Element({
					tagName:tag,
					className:className,
				});
			}
			else if(className instanceof Element){
				return new Element({
					tagName:tag,
					appendTo:className,
				});
			}
			
		}
	}
	else{
		if (typeof tag == "string"){
			return new Element({
				tagName:tag,
				className:className,
				appendTo:appendTo,
			})
		}
	}
}

function lines(className, appendTo){
	if (arguments.length == 1){
		if (typeof className === "string"){
			return new Element({
				className:'lines '+className,
			});
		}
		else if (className instanceof Element){
			return new Element({
				appendTo:className,
			});
		}
	}
	else if (arguments.length == 2){
		new Element({
			className:'lines '+className,
			appendTo:appendTo,
		});
	}
	else if (arguments.length == 0){
		return new Element({
			className:'lines',
		});
	}
}

function Rows(args){
	Element.call(this, args);
	this.addClass('rows');
}

Rows.prototype = Object.create(Element.prototype);

function Columns(args){
	Element.call(this, args);
	this.addClass('columns');
}

Columns.prototype = Object.create(Element.prototype);

function Lines(args){
	Element.call(this, args);
	this.addClass('lines');
}

Lines.prototype = Object.create(Element.prototype);

function StandardWindow(args){
	var self = this;
	args = args || {};
	Container.call(this, {
		className:'standard-window',
	});
	this.addClass(args.className);

	this.toolbar = new Toolbar({
		className:'standard-window-toolbar'
	});
	this.body = new Container({
		share:1,
		className:'standard-window-body'
	});
	this.body.addClass(args.bodyStyle);
	this.toolbar.addClass(args.toolbarStyle);
	Container.prototype.append.call(this, this.toolbar);
	Container.prototype.append.call(this, this.body);
}

StandardWindow.prototype = Object.create(Container.prototype);

StandardWindow.prototype.append = function(arg1){
	this.body.append(arg1);
}