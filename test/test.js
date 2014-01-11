function A(){
	//this.__proto__ = $(document.createElement('div'));
	
	$.extend(this,$(document.createElement('div')));
	//this.element = document.createElement('div');
	//$.call(this,document.createElement('div'));
	this.x=10;
	var a=20;
	this.g=function(){
		console.log(a);
	}

}

//A.prototype=$()

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

	var logC = document.createElement('div');
	testC.container.appendChild(logC);

	var b = new Button({
		onClick:function(){
			log("Button onClick",logC);
		},
		label:"Button",
		tabIndex:1,
	});


	var t = new Toggle({
		onToggle:function(args){
			log("Toggle onToggle value: "+args.value,logC);
		},
		label:"Toggle test"
	});

	var m = new Menu();

	var s = new Slider({
		onChange:function(args){
			log("Slider onChange value: "+args.value.toFixed(2),logC);
			//alert(args.progress);
		},
		onChanged:function(args){
			log("Slider onChanged value: "+args.value.toFixed(2),logC);
		},
		start:0,
		end:255,
	});

	var se = new Select({
		onChange:function(args){
			log("Select onChange value: "+args.value,logC);
		}
	});
	se.append('Option',true)
		.append('Very long option');

	var ti = new TextInput({
		onChange:function(args){
			log("TextInput onChange value: "+args.value,logC);
		}
	});

	var startButton = new Button({
		onClick:function(){
			log("Menu item clicked",logC);
		},
		label:"Start",
	});

	var b2 = new Button({
		onClick:function(){
			log("ButtonTest onClick",logC);
		},
		label:"Button",
	});

	m.append(startButton);

	var elem = new Element({
		onClick:function(){
			log("Element clicked",logC);
		}
	});

	elem.element.innerHTML = "Element";

	document.body.appendChild(w.container);

	w
		.append(m)
		.append(framesC)
		;
	toolbar
		.append(ti)
		.append(b)
		.append(b2)
		.append(se)
		.append(t)
		.append(s)
		//.append(elem)

	framesC
		.append(toolbar)
		.append(testC)
		;
});

