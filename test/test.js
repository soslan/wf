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
	var b = new Button();
	var t = new Toggle();

	document.body.appendChild(w.container);

	w
		.append(b)
		.append(t);
});

