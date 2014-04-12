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
		label:"To horizontal layout",
	})).append(new Button({
		label:"To vertical layout",
	}));

	var wind = new Panel({
		share:1,
	});

	var wind2 = new Window({
		maximized:true,
		share:1,
		title:"Window example",
		icon:"camera",
	});

	var ti = new TextInput({
		label:"Text input ",
		icon: "user",
	});

	wind.append(ti);
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

