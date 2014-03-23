function TabView(args){
	var self = this;
	args=args?args:{};
	Element.call(this);
	this.addClass('tab-view');

	this.tabsContainer = new Element();
	this.framesContainer = new Element();

	this.addTab = function(newTabArgs){
		var tabElement = new Element();
		var frame = new Element();
	};
}

TabView.prototype = Object.create(Element.prototype);

function Tab(args){
	var self = this;
	args=args?args:{};
	this.tabLabel = new Value({
		value:"Tab Label",
	});

}