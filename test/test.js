function A(){
	this.x=10;
	var a=20;
	this.g=function(){
		console.log(a);
	}

}

A.prototype={

}

function B(){
	A.call(this);

	this.f=function(){
		console.log(a);
	}

}

B.prototype.set=function(){
	this.x=3;
	//return this.x;
}

////////////////////////////////////////// WF TESTING 
$(document).ready(function(){
	//less.watch();
	var w = new Container({
		mode:"full",
	});
	var testC = new Container({
		direction:"v",
		flex:1,
	});
	var b = new Button();
	var t = new Toggle();

	var s = new Slider({
		onChange:function(args){
			console.log(args.value);
			//alert(args.progress);
		},
		start:0,
		end:255,
	});

	document.body.appendChild(w.container);

	w
		.append(b)
		.append(t)
		.append(s)
		.appendContainer(testC)
		;
});

