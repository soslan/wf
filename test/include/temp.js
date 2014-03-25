$(document).ready(function(){
	//less.watch();
	var w = new Element({
		className:"root",
	});

	var t = new TabView();
	t.addTab({
		label:"Tab",
	});
	document.body.appendChild(w.container);

	w
		.append(t)
		;
});

