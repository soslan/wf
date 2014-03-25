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

		return tab;
	};
}

TabView.prototype = Object.create(Element.prototype);
