function TabView(args){
	var self = this;
	args=args?args:{};
	Element.call(this);
	this.addClass('tab-view');

	this.tabsContainer = new Element();
	this.documentsContainer = new Element();
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

TabView.prototype = Object.create(Element.prototype);
