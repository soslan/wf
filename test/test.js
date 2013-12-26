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

////////////////////////////////////////// WF TESTING 
$(document).ready(function(){
	//less.watch();
	var w = new Container({
		mode:"full",
		direction:"v",
	});
	var testC = new Container({
		direction:"v",
		flex:1,
	});

	var logC = document.createElement('div');
	testC.contentBlock.appendChild(logC);

	var b = new Button({
		onClick:function(){
			log("Button onClick",logC);
		},
		value:"Button",
	});


	var t = new Toggle({
		onToggle:function(args){
			log("Toggle onToggle value: "+args.value,logC);
		}
	});

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

	document.body.appendChild(w.container);

	w
		.append(ti)
		.append(b)
		.append(se)
		.append(t)
		.append(s)
		.appendContainer(testC)
		;
});

