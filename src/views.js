function TabView(args){
	var self = this;
	args=args?args:{};
	Container.call(this,{
		contentDirection:args.direction,
		contentType:'blocks',
	});
	this.addClass('tab-view');

	this.tabsContainer = new Container({
		contentDirection:"horizontal",
	});

	this.documentsContainer = new Container({
		share:1,
		contentType:"blocks",
	});
	this.tabs = [];
	this.activeTab;

	this.tabsContainer.addClass('tab-view-tabs');
	this.documentsContainer.addClass('tab-view-documents');

	this.append(this.tabsContainer)
		.append(this.documentsContainer);

	this.addTab = function(newTabArgs){
		newTabArgs = newTabArgs || {};
		var tab = {};
		this.tabs.push(tab);
		tab.tabElement = new Toolbar();
		tab.tabTitle = new Label();
		tab.documentElement = new Container({
			share:1,
		});
		tab.label = new Value();

		tab.onActivate = newTabArgs.onActivate;
		tab.onDeactivate = newTabArgs.onDeactivate;

		tab.tabElement.addClass('tab-view-tab');
		tab.documentElement.addClass('tab-view-document hidden');

		tab.tabElement.addEventListener('click',function(){
			tab.activate();
		});

		tab.label.addEventListener('change',function(data){
			tab.tabTitle.setText(data.value);
		});

		tab.label.set({
			value:newTabArgs.label || '',
		});

		tab.tabElement.append(tab.tabTitle);

		self.tabsContainer.append(tab.tabElement);
		self.documentsContainer.append(tab.documentElement);

		tab.activate = function(){
			if(typeof self.activeTab !== "undefined"){
				self.activeTab.tabElement.element.classList.remove('active');
				self.activeTab.documentElement.addClass('hidden');
				if(typeof self.activeTab.onDeactivate == "function"){
					self.activeTab.onDeactivate();
				}
			}
			self.activeTab = tab;
			tab.tabElement.element.classList.add('active');
			tab.documentElement.removeClass('hidden');
			if(typeof tab.onActivate == "function"){
				tab.onActivate();
			}
		}

		tab.close = function(){
			var currentIndex = self.tabs.indexOf(tab);
			self.tabsContainer.element.removeChild(tab.tabElement.element);
			self.documentsContainer.element.removeChild(tab.documentElement.element);
			if(tab == self.activeTab){
				if(currentIndex + 1 == self.tabs.length){
					if(self.tabs.length == 1){
						self.activeTab = null;
					}
					else{
						self.tabs[currentIndex - 1].activate();
					}
				}
				else{
						self.tabs[currentIndex + 1].activate();
				}
			}
			self.tabs.splice(currentIndex, 1);
			delete tab;
		}

		if(newTabArgs.closeable == true){
			var closeElement = new Button({
				icon:'times',
				className:"quiet red",
			});
			tab.tabElement.append(closeElement);
			closeElement.clickable({
				onClick:function(e){
					tab.close();
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}

		if(newTabArgs.activate == true || this.activeTab == undefined){
			if(typeof self.activeTab !== "undefined"){
				self.activeTab.tabElement.element.classList.remove('active');
				self.activeTab.documentElement.addClass('hidden');
				if(typeof self.activeTab.onDeactivate == "function"){
					self.activeTab.onDeactivate();
				}
			}
			self.activeTab = tab;
			tab.tabElement.element.classList.add('active');
			tab.documentElement.removeClass('hidden');
			if(typeof newTabArgs.ready == "function"){
				newTabArgs.ready(tab);
			}
			/*if(typeof tab.onActivate == "function"){
				tab.onActivate();
			}*/

		}
		else{
			if(typeof newTabArgs.ready == "function"){
				newTabArgs.ready(tab);
			}
		}

		

		return tab;
	};
}

TabView.prototype = Object.create(Container.prototype);


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


