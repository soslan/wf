$(document).ready(function(){
	//less.watch();
	var w = new Element({
		className:"root",
	});

	var t = new TabView();
	var tab1 = t.addTab({
		label:"Tab",
	});
	var tab2 = t.addTab({
		label:"Tab2",
	});

	tab1.documentElement.append(new Button({label:'Button'}));
	document.body.appendChild(w.container);

	w
		.append(t)
		;
});

