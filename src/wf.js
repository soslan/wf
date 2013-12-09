function Txt(args){
	var elem=document.createElement('span');
	args=args?args:{};

	elem.innerHTML=args.value?args.value:"Some text.";

	if(args.className){
		elem.classList.add(args.className);
	}

	this.setValue=function(value){
		elem.innerHTML=value;
	};

	this.getElement=function(){
		return elem;
	}

	//return elem;

};

function Button(args){
	args=args?args:{};
	var elem = document.createElement('span');
	elem.innerHTML=args.value?args.value:"Submit";

	elem.className="button";
	var timer;

	$(elem).click(function(){
		if(args.callback)
			args.callback();
	});

	this.setTimeOut=function(time){

		timer=setTimeout(function(){

			if(args.callback)
				args.callback();
			clearTimeout(timer);
		},time);
	};

	this.stopTimeOut=function(){
		clearTimeout(timer);
	}

	this.getElement=function(){
		return elem;
	}

	//return elem;
}

function Toggle(args){
	var self=this;
	args=args?args:{};
	var elem = document.createElement('span');
	var switcher = document.createElement('div');
	var state=args.state?args.state:0;

	elem.className="toggle";
	switcher.className="toggle-switcher";

	if(state==1){
		elem.classList.add("on");
		//switcher.classList.add("active");
		switcher.innerHTML="ON";
	}
	else{
		switcher.innerHTML="OFF";

	}

	$(elem).click(function(){
		if(args.onOn && state==0){
			state=1;
			elem.classList.add("on");
			$(switcher).animate({
				//float:'right'
				//right:0,
				left:'50%'
			},'fast');
			switcher.innerHTML="ON";
			args.onOn();

		}
		else if(args.onOff && state==1){
			state=0;
			elem.classList.remove("on");
			$(switcher).animate({
				//float:'left'
				left:0,
				//right:'50%'
			},'fast');
			switcher.innerHTML="OFF";
			args.onOff();
		}
			//args.onOn();
	});

	this.getElement=function(){
		return elem;
	}

	this.activate=function(){

	}

	elem.appendChild(switcher);

	//return elem;
}


function TextInput(args){
	args=args?args:{};
	var elem = document.createElement('input');

	elem.setAttribute("type","text");
	elem.className="input-text";
	if(args.class){
		elem.classList.add(args.class);
	}

	this.setValue=function(value){
		$(elem).val(value);
	}

	this.getValue=function(){
		return $(elem).val();
	};

	this.getElement=function(){
		return elem;
	}
}