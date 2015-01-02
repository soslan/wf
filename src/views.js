function TabView(args, tabsArgs, bodiesArgs){
	var self = this;
	args=args?args:{};
	tabsArgs = tabsArgs || {};
	bodiesArgs = bodiesArgs || {};
	Container.call(this,{
		contentDirection:args.direction,
		contentType:'blocks',
	});
	this.addClass('tab-view');

	this.tabs = new Toolbar(tabsArgs);

	bodiesArgs.share = 1;
	//bodiesArgs.contentType

	this.bodies = new Containers(bodiesArgs);
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
	//this.activeMaximizedContainer;
}

Windows.prototype = Object.create(Container.prototype);

Windows.prototype.append = function(container){
	var self = this;
	var displayType;
	if (!(container instanceof Container)){
		return;
	}
	if (1 || container.displayType === undefined){
		container.setDisplayType('maximized');
	}
	/*if(['maximized', 'unmaximized', 'unmaximized-pinned'].indexOf(container.displayType.get()) == -1){
		container.displayType.setValue('maximized');
		displayType = 'maximized';
	}
	else{
		displayType = container.displayType.get();
	}

	if(displayType === 'unmaximized' || displayType === 'unmaximized-pinned'){
		if(typeof this.activeUnmaximizedContainers === 'undefined'){
			this.activeUnmaximizedContainers = [];
			this.topZIndex = 200;
		}
		this.activeUnmaximizedContainers.push(container);

	}

	if(this.activeContainer == undefined){
		this.switchTo(container);
	}
	else{
		container.hide();
	}

	container.parent = this;
	if(typeof container.windowMode === 'undefined'){
		container.windowMode = 'extended';
	}
	if(container.windowMode === 'unmaximized'){

	}
	else{
		this.containers.push(container);
		if(this.containers.length == 1){
			this.switchTo(container);
		}
		else{
			container.hide();
		}
	}*/
	this.containers.push(container);
	container.e.style.visibility = "none";

	Container.prototype.append.call(this, container);
	if(this.activeContainer == undefined){
		//container.e.style.visibility = "";
		this.switchTo(container);
	}
	else{
		container.hide();
	}
	container.e.style.visibility = "";
	/*container.on('closed',function(){
		var i = self.containers.indexOf(container);
		self.containers.splice(i,1);
		if(self.activeContainer == container){
			if(i == 0){
				if(self.containers.length > 0){
					self.switchTo(self.containers[0]);
				}
			}
			else{
				self.switchTo(self.containers[i-1]);
			}
		}
		container.removeEventListener
	});*/
	this.dispatchEvent('container-added', {
		container:container,
	});
};

