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

	var side = new Container({
		contentType:'blocks',
		share:1,
	});
	var right = new Container({
		contentType:'blocks',
		direction:'v',
		share:2,
	});
	var u = new Container({
		contentType:'blocks',
		share:3,
	});
	var d = new Container({
		contentType:'blocks',
		share:4,
	});
	u.append(tabs);
	d.append(new Element());
	right.append(u)
		.append(d);
	w
		.append(side)
		.append(right)
		;
	document.body.appendChild(w.container);
});

