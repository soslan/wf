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

	var ti = new TextInputCore({
		onFocus:function(args){
			log("TextInputCore onFocus. Value: " + args.value,logC);
		},
		onBlur:function(args){
			log("TextInputCore onBlur. Value: " + args.value,logC);
		},
		onChange:function(args){
			log("TextInputCore onChange. Value: " + args.value,logC);
		}
	});

	var b = new ButtonCore({
		tagName:"button",
		onFocus:function(){
			log("Button onFocus.", logC);
		},
		onBlur:function(args){
			log("TextInputCore onBlur",logC);
		},
		onClick:function(){
			log("Button onClick", logC);
		}
	});
	var l = new Label({
		text:" Label ",
		icon:"search"
	});

	var logC = document.createElement('div');
	testC.container.appendChild(logC);

	document.body.appendChild(w.container);

	w
		.append(framesC)
		;
	toolbar
		.append(ti)
		.append(l)
		.append(b)
		;
		//.append(elem)

	framesC
		.append(toolbar)
		.append(testC)
		;
});

