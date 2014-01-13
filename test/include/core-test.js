function log(val,logC){
	var div=document.createElement('div');
	div.innerHTML = val;
	logC.insertBefore(div,logC.firstChild);
	setTimeout(function(){
		$(div).fadeOut('fast',function(){
			logC.removeChild(div);
		});
	},1000);


}

// WF TESTING 
$(document).ready(function(){
	//less.watch();
	var w = new Container({
		mode:"full",
		direction:"h",
	});
	var testC = new Container({
		direction:"v",
		flex:1,
	});

	var toolbar = new Block({
	});

	var framesC = new Container({
		direction:"v",
		flex:1,
	});

	var ti = new TextInputCore({});

	var logC = document.createElement('div');
	testC.container.appendChild(logC);

	document.body.appendChild(w.container);

	w
		.append(framesC)
		;
	toolbar
		.append(ti)
		;
		//.append(elem)

	framesC
		.append(toolbar)
		.append(testC)
		;
});

