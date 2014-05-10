$(document).ready(function(){
	//less.watch();
	var w = new Element({
		className:"root",
	});

	var tabs = new TabView();
	var tab1 = tabs.addTab({
		label:"Tab",
	});
	var tab2 = tabs.addTab({
		label:"Tab2",
		closeable:true,
	});

	var testCont1 = new Container({
		share:1,
	});
	var testCont2 = new Container({
		share:1,
	});

	var testCont3 = new Container({
		share:1,
	});
	testCont1.element.style.backgroundColor = 'red';
	testCont2.element.style.backgroundColor = 'blue';
	testCont1.append(new Label({text:'Container 1'}));
	testCont2.append(new Label({text:'Container 2'}));

	testCont3.append(new Label({text:'Container 3'}));
	var testButton1 = new Button({
		icon:'arrow-left',
		onClick:function(){ stack.prev(); },
	});

	var testButton2 = new Button({
		icon:'arrow-right',
		onClick:function(){ stack.slide(stack.getNext()); },
	});
	var stack = new ContainersStack({
		share:1,
	});

	stack.append(testCont1);
	stack.append(testCont2);
	stack.append(testCont3);

	var addButton = new Button({
		icon:'plus',
		onClick:function(){
			stack.appendAndShow(new Container({
				share:1,
			}));
		},
	});

	var tabs1 = new Tabs({
		containers:stack,
	});

	tab2.documentElement.append(tabs1);
	tab2.documentElement.append(addButton);

	tab1.documentElement.append(new Button({
		label:"To horizontal layout",
		onClick:function(){
			tabs.contentDirection.set('horizontal')
		},
	})).append(new Button({
		label:"To vertical layout",
		onClick:function(){
			tabs.contentDirection.set('vertical')
		},
	}));

	var acc = new AccordionView({
		maximized:true,
		share:1,
	});
	var tab3 = acc.addItem({
		label:"Tab",
	});
	var tab4 = acc.addItem({
		label:"Tab2",
	});
	tab3.documentElement.append(new Button({
		onClick:function(){
			wind2.hide();
		},
		label:"Hide Window example",
	})).append(new Button({
		onClick:function(){
			wind2.show();
		},
		label:"Show Window example",
	}));

	var wind = new Panel({
		share:1,
	});

	var wind2 = new Window({
		maximized:true,
		share:1,
		hidden:true,
		title:"Window example",
		icon:"camera",
	});

	var toolbar2 = new Toolbar();

	var ti = new TextInput({
		label:"Text input ",
		icon: "user",
	});

	toolbar2.append(ti);
	toolbar2.append(testButton1);
	toolbar2.append(testButton2);

	tab1.tabTitle.setText(ti.value.addBroadcaster());

	wind.append(toolbar2);
	wind.append(stack);
	var side = new Container({
		maximized:true,
		contentType:'blocks',
		share:1,
	});
	var right = new Container({
		contentType:'blocks',
		direction:'v',
		maximized:true,
		share:2,
	});
	var u = new Container({
		contentType:'blocks',
		share:3,
		maximized:true,
	});
	var d = new Container({
		contentType:'blocks',
		share:4,
		maximized:true,
	});
	u.append(tabs);
	d.append(wind);
	d.append(wind2);
	side.append(acc);
	right.append(u)
		.append(d);
	w
		.append(side)
		.append(right)
		;
	document.body.appendChild(w.container);
});

