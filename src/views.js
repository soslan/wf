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
		tab.tabElement = new Element();
		tab.documentElement = new Element();
		tab.label = new Value();

		tab.tabElement.addClass('tab-view-tab');
		tab.documentElement.addClass('tab-view-document');

		tab.tabElement.addEventListener('click',function(){
			tab.activate();
		});

		tab.label.addEventListener('change',function(data){
			tab.tabElement.element.innerHTML = data.value;
		});

		tab.label.set({
			value:newTabArgs.label || '',
		})

		self.tabsContainer.append(tab.tabElement);
		self.documentsContainer.append(tab.documentElement);

		tab.activate = function(){
			self.activeTab.tabElement.element.classList.remove('active');
			self.activeTab.documentElement.$.hide();
			self.activeTab = tab;
			tab.tabElement.element.classList.add('active');
			tab.documentElement.$.show();
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

		if(newTabArgs.activate == true){
			tab.activate();
		}

		if(typeof newTabArgs.ready == "function"){
			newTabArgs.ready(tab);
		}

		if(this.activeTab == undefined){
			this.activeTab = tab;
			tab.tabElement.element.classList.add('active');
			tab.documentElement.$.show();
		}

		if(newTabArgs.closeable == true){
			var closeElement = new Label({
				icon:'times',
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


