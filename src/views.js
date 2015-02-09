function TabView(args, tabsArgs, bodyArgs){
	var self = this;
	args=args?args:{};
	tabsArgs = tabsArgs || {};
	bodyArgs = bodyArgs || {};
	Container.call(this,{
		contentDirection:args.direction,
		contentType:'blocks',
	});
	this.addClass('tab-view');

	this.tabs = new Toolbar(tabsArgs);

	bodyArgs.share = 1;
	//bodyArgs.contentType

	this.bodies = new Windows(bodyArgs);
	//this.tabs = [];
	this.activeTab;

	this.tabs.addClass('tab-view-tabs');
	this.bodies.addClass('tab-view-bodies');


	Container.prototype.append.call(this, this.tabs);
	Container.prototype.append.call(this, this.bodies);

}

TabView.prototype = Object.create(Container.prototype);

TabView.prototype.append = function(container, handleArgs){
	this.bodies.append(container);
	if(handleArgs === undefined){
		handleArgs = {};
	}
	else if (typeof handleArgs === "string"){
		handleArgs = {
			text:handleArgs,
		};
	}
	this.tabs.append(container.getHandle(handleArgs));
}


function AccordionView(args){
	var self = this;
	args=args?args:{};
	Container.call(this,{
		contentDirection:args.direction,
		contentType:'blocks',
		share:args.share,
	});
	this.addClass('accordion-view');

	this.items = [];
	this.activeItem;

	this.addItem = function(newTabArgs){
		newTabArgs = newTabArgs || {};
		var item = {};
		this.items.push(item);
		item.tabElement = new Container();
		item.documentElement = new Container({
			share:1,
		});
		item.label = new Value();

		item.tabElement.addClass('accordion-view-tab');
		item.documentElement.addClass('accordion-view-document');

		item.tabElement.addEventListener('click',function(){
			item.toggle();
		});

		item.label.addEventListener('change',function(data){
			item.tabElement.element.innerHTML = data.value;
		});

		item.label.set({
			value:newTabArgs.label || '',
		})

		self.append(item.tabElement);
		self.append(item.documentElement);

		item.toggle = function(){
			if(self.activeItem == item){
				item.hide();
			}
			else{
				item.show();
			}
		}

		item.hide = function(){
			self.activeItem = undefined;
			item.tabElement.element.classList.remove('active');
			item.documentElement.$.hide();
		}

		item.show = function(){
			if(self.activeItem !== undefined){
				self.activeItem.hide();
			}
			self.activeItem = item;
			item.tabElement.element.classList.add('active');
			item.documentElement.$.show();
		}

		if(newTabArgs.activate == true){
			item.show();
		}

		if(typeof newTabArgs.ready == "function"){
			newTabArgs.ready(item);
		}

		return item;
	};
}

AccordionView.prototype = Object.create(Container.prototype);

/*AccordionView.prototype.append = function(newWindow){
	this.windows.push(newWindow);
}*/


function Windows(args){
	var self = this;
	args = args?args:{};
	Container.call(this,args);
	this.addClass('windows');
	this.windows = [];
	this.topZIndex = 200;
	this.active;
	this.history = [];
}

Windows.prototype = Object.create(Container.prototype);

Windows.prototype.append = function(container){
	var self = this;
	var displayType;
	container.hide();
	if (container.maximized === undefined){
		container.maximize();
	}
	container.e.style.visibility = "none";
	container.focusable();
	Container.prototype.append.call(this, container);
	if(this.activeContainer == undefined){
		//container.e.style.visibility = "";
		this.switchTo(container);
	}
	else{
		container.hide();
	}
	container.e.style.visibility = "";
	this.dispatchEvent('container-added', {
		container:container,
	});
};

Windows.prototype.remove = function(arg1){
	if(this.isParentOf(arg1)){
		if(arg1.maximized && arg1 === this.activeContainer){
			var prev = this.history.pop();
			while(prev === arg1 || !this.isParentOf(prev)){
				prev = this.history.pop();
			}
			this.switchTo(prev,function(){
				arg1.close();
			});
		}
		else{
			arg1.close();
		}
	}
}

Windows.prototype.appendAndShow = function(container){
	this.append(container);
	this.switchTo(container);
};

Windows.prototype.switchTo = function(wind, done){
	if (wind === this.activeContainer){
		return;
	}
	if (this.isParentOf(wind)){
		if (wind.maximized){
			var previousActive = this.activeContainer;
		
			this.activeContainer = wind;
			wind.e.style.zIndex = this.topZIndex + 1;
			this.topZIndex += 1;
			wind.e.style.opacity = 0;
			wind.show();
			wind.focus();
			this.history.push(wind);
			wind.$.animate({
				opacity:1,
			}, 40, function(){
				wind.dispatchEvent('activated');
				if(previousActive !== undefined){
					if (typeof done == "function"){
						done();
					}
					previousActive.dispatchEvent('deactivated');
					previousActive.hide();
				}
			});
		}
	}
}
