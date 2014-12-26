$(document).ready(function(){
	var root = new Container({
		className:"root",
		contentDirection:'vertical',
	});

	document.body.appendChild(root.container);

	var stack = new Containers({
		share:1,
	});
	var tabs = new Toolbar({
		className:'blackblack',
	});

	
	var test1 = new Container({
		share:1,
		className:'white',
	});
	test1.title = 'Test1';
	var test1Tab = stack.getHandleFor(test1,{
		className:'white',
	});
	stack.append(test1);
	tabs.append(test1Tab);


	var toolbar1 = new Toolbar({
		appendTo:test1,
		//className:'slategray',
	});
	
	var stack1 = new Containers({
		appendTo:test1,
		share:1,
	});

	var panel1 = new Panel({
		share:1,
	});
	var panel2 = new Panel({
		share:1,
		className:'slategray',
	});

	var panel3 = new Panel({
		share:1,
		className:'red',
	});
	var panel4 = new Panel({
		share:1,
		className:'green',
	});
	panel2.title = "Panel 2";
	panel2.closeable = true;

	panel3.title = "Panel 3";
	panel3.closeable = true;
	stack1.append(panel1);
	stack1.append(panel2);
	stack1.append(panel3);
	stack1.append(panel4);
	stack1.withLoader();
	stack1.loader.setMessage('Loading...');

	var tab2 = panel2.getHandle({
		closeable:true,
	});
	toolbar1.append(tab2);
	tab2.addClass('slategray');

	var tab3 = stack1.getHandleFor(panel3);
	toolbar1.append(tab3);
	tab3.addClass('red');

	toolbar1.append(stack1.getHandleFor(panel4,{
		className:'green',
	}));

	/*toolbar1.append(new Button({
		icon:'play',
		text:'Start Loader',
		onClick:function(){
			stack1.startLoader();
		},
	}));*/
	toolbar1.append(new Button({
		icon:'plus',
		//text:'',
		onClick:function(){
			stack1.switchTo(panel1)
		},
	}));

	root.append(tabs);
	root.append(stack);

});

