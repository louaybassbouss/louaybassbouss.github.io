/*
This script provide 2 type of synchronization, such as Master-Slave and Client-Client. 
Create date: 10, 11, 2014
Designed by: Yi Fan
*/

var ses;
var div_name;
var package_integration= new Object();
var package_info= new Object();
var global=this;

//namespace for sync
(function(ns){
	//namespace for Master-Slave model
	ns.Master = function(msg){
		ses=msg;
		console.log(ses);
	}
   
	ns.Master.prototype.init = function(msg){
		ses.postMessage("foo");
		if(msg=="body"){
			mirror_body = document.getElementsByTagName("body")["0"].innerHTML;
			observer(msg);
		}else if(msg=="head"){
			mirror_body = document.getElementsByTagName("head")["0"].innerHTML;
			observer(msg);
		}else if(msg=="title"){
			mirror_body = document.getElementsByTagName("title")["0"].innerHTML;
			observer(msg);
		}else{
			mirror_body = document.getElementById(msg).innerHTML;
			observer(msg);
		}
		mirror_body=sanitize(mirror_body);
		id="33";
		if(mirror_body.length > 512){
			pack_separate(mirror_body, id)
		}else{
			pack_transmittion(mirror_body, id)
		}
	}
  
	ns.Master.prototype.destroy = function(){
		sync.Master=null;
		sync=null;
		package_info=null;
		package_integration=null;
		delete sync;
	}

	ns.Slave = function(msg){
		ses=msg;
		console.log(ses);
	}

	ns.Slave.prototype.init = function(msg){
		/*var div_id=document.createElement("DIV");
		div_id.setAttribute("id",msg);
		div_id.style.cssFloat = "left";
		document.body.appendChild(div_id);*/
		div_name=msg;
	}
	
	ns.Slave.prototype.handleMessage = function(msg){
		if(typeof(msg)=="string"){
			msg=msg.split(",");
		}
		if(msg.length>2){	
			pack_operation_and_integration(msg); 
		}
	}
	ns.Slave.prototype.destroy = function(){
		sync.Slave=null;
		sync=null;
		package_info=null;
		package_integration=null;
		div_name="";
		delete sync;

	}
	//namespace for Client-Client model
	ns.Peer = function(msg){
		ses=msg;
		console.log(ses);
		console.log(typeof(ses.postMessage));
	}

	ns.Peer.prototype.init = function(msg){
		if(msg=="body"){
			target=document.body;
		}
		else if(msg=="head"){
			target=document.head;
		}
		else if(msg=="title"){
			target=document.getElementsByTagName("title")
		}
		else{
			target= document.getElementById(msg);
		}
		target.addEventListener('click', send_events_execute, false);
		target.addEventListener('blur', send_events_execute, true);
		target.addEventListener('change', send_events_execute, false);
		target.addEventListener('focus', send_events_execute, true);
		target.addEventListener('dblclick', send_events_execute, false);
		target.addEventListener('keydown', send_events_execute, false);
		target.addEventListener('keypress', send_events_execute, false);
		target.addEventListener('keyup', send_events_execute, false);
		target.addEventListener('mousedown', send_events_execute, false);
		target.addEventListener('mouseover', send_events_execute, false);
		target.addEventListener('mouseup', send_events_execute, false);
		target.addEventListener('mouseout', send_events_execute, false);
		//document.addEventListener('mousemove', send_events_execute, false);
		target.addEventListener('reset', send_events_execute, false);
		target.addEventListener('select', send_events_execute, false);
		target.addEventListener('submit', send_events_execute, false);
	}
	ns.Peer.prototype.handleMessage = function(msg){
		if(typeof(msg)=="string"){
			msg=msg.split(",");
		}
		do_sync(msg);
	}
	ns.Peer.prototype.destroy = function(){
		sync.Slave=null;
		sync=null;
		package_info=null;
		package_integration=null;
		div_name="";
		delete sync;
	}
})(window.sync = window.sync || {});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//function for Master-Slave model.
function sanitize(msg) 
{
	var index_1 = 0 , index1 = 0 , index2=0, index_2 = 0, startnr_1=[], endnr_1=[],msg_out=[], count_1=0, count_2=0;	
	str1="<script"
	str2="/script>";
	totallength=msg.length;	
    for(var i = 0; i < totallength && index1 != -1 ; i++ )
    {
		index1 = msg.indexOf(str2, index_1);	   				
		if(index1 != -1)
		{
			startnr_1.push(index1+8);
			//console.log(startnr_1);
			count_1++;
		}		
		index_1 = index1 + 1;
	}	
	for(var i = 0; i < totallength && index2 != -1 ; i++ )
    {
		index2 = msg.indexOf(str1, index_2);	   		 
		if(index2 != -1)
		{
			endnr_1.push(index2);
			//console.log(endnr_1);
			count_2++;
		}
       index_2 = index2 + 1;
	} 
	if(count_1==count_2)
	{   
		var startnr=0;
		for(var i=0; i<startnr_1.length; i++)
		{			
			msg_out=msg_out + msg.substring(startnr,endnr_1[i]);			
			//console.log(endnr_1[i]); 
			startnr=startnr_1[i];
			//console.log(startnr);
		}   
		if(totallength!=startnr_1[count_1])
		{		
			msg_out=msg_out + msg.substring(startnr,totallength);		
		}
	}
	return msg_out.replace(/"/g, '\'');
}

function pack_operation_and_integration(msg){
	//console.log(msg);
	if(msg.length > 5){
		info_part = new Array();
		for(var i=4; i<msg.length; i++)
		{
			info_part.push(msg[i]);
		}
		info_part_string = info_part.join(",");
	}
	else{
		info_part_string=msg[4];
	}
	d_id=1; 
	if(!global.package_integration[d_id]){
		global.package_integration[d_id]=new Array();
		console.log("ja");
	}
	t1=Number(msg[2]);
	if(msg[1]==1){
		ms=document.getElementById(div_name);
		console.log(ms);
		ms.innerHTML =="";
		ms.innerHTML = info_part_string;
		replacebutton(div_name);
	}
	else{
		if(msg[1]==msg[2] && package_integration[d_id][msg[3]].length==msg[2]){
			console.log(package_integration[d_id]);
			console.log(package_integration[d_id][msg[3]].length);
			ci="";
			for(var i=1; i<package_integration[d_id][msg[3]].length; i++){
				console.log(package_integration[d_id][msg[3]][i]);
				ci+=package_integration[d_id][msg[3]][i];
				console.log(ci);				
			}
			ci+=info_part_string;
			ms=document.getElementById(div_name);
			ms.innerHTML = ci;
			replacebutton(div_name);
			package_integration[d_id]={};			
			delete package_integration[d_id];			

		}
		else
		{
			if(global.package_integration[d_id][msg[3]])
			{
				package_integration[d_id][msg[3]][t1]=info_part_string;

			}
			else
			{
				global.package_integration[d_id][msg[3]]= new Array();
				console.log(package_integration)
				package_integration[d_id][msg[3]][t1]=info_part_string;
			}
			console.log(package_integration[d_id][msg[3]].length);
		}
	}
}

function replacebutton(msg){
	var divmirror=document.getElementById(msg);	
	if(divmirror.getElementsByTagName("input") || divmirror.getElementsByTagName("button"))
	{
		btnslength_input=divmirror.getElementsByTagName("input").length;
		btnslength_button=divmirror.getElementsByTagName("button").length;
		for(var i=0; i < btnslength_input; i++)
		{	
			divmirror.getElementsByTagName("input")[i].onclick=function (){refunction_button(this,msg)};			
		}
		for(var i=0; i < btnslength_button; i++)
		{	
			divmirror.getElementsByTagName("button")[i].onclick=function (){refunction_button(this, msg)};			
		}
	}
	traverseNodes(divmirror, msg);	
}

function traverseNodes(node, msg_id)
{  
	//console.log(msg_id);
	if(node.nodeType == 1){  
		//console.log(node);  
		for(var i=0;i<node.attributes.length;i++){  
			var attr = node.attributes.item(i);   
			if(attr.specified){ 
				if(attr.nodeName=="onclick" || attr.nodeName=="onblur" || attr.nodeName=="onchange"|| attr.nodeName== "onreset"|| attr.nodeName== "onfocus" || attr.nodeName=="ondblclick" || attr.nodeName=="onkeydown" || attr.nodeName=="onkeypress"|| attr.nodeName=="onkeyup" || attr.nodeName=="onmousedown" || attr.nodeName=="onmouseover" || attr.nodeName=="onmouseup" || attr.nodeName=="onselect" || attr.nodeName=="onsubmit")
				{
					//console.log(attr);
					//console.log(node);
					switch(attr.nodeName){
						case "onclick":
							node.onclick=function (){refunction_button(this,msg_id)};
							break;
						case "onblur":
							node.onblur=function (){refunction_button(this,msg_id)};
							break;
						case "onchange":
							node.onchange=function (){refunction_button(this,msg_id)};
							break;
						case "onreset":
							node.onreset=function (){refunction_button(this,msg_id)};
							break;
						case "onfocus":
							node.onfocus=function (){refunction_button(this,msg_id)};
							break;
						case "ondblclick":
							node.ondblclick=function (){refunction_button(this,msg_id)};
							break;
						case "onkeydown":
							node.onkeydown=function (){refunction_button(this,msg_id)};
							break;
						case "onkeypress":
							node.onkeypress=function (){refunction_button(this,msg_id)};
							break;
						case "onkeyup":
							node.onkeyup=function (){refunction_button(this,msg_id)};
							break;
						case "onmousedown":
							node.onmousedown=function (){refunction_button(this,msg_id)};
							break;
						case "onmouseover":
							node.onmouseover=function (){refunction_button(this,msg_id)};
							break;
						case "onmouseout":
							node.onmouseout=function (){refunction_button(this,msg_id)};
							break;
						case "onmouseup":
							node.onmouseup=function (){refunction_button(this,msg_id)};
							break;
						case "onselect":
							node.onselect=function (){refunction_button(this,msg_id)};
							break;
						case "onsubmit":
							node.onsubmit=function (){refunction_button(this,msg_id)};
							break;
					}
					node.dataset.onevent=attr.nodeName;
				}
			}  
		}   
		if(node.hasChildNodes){  
			var sonnodes = node.childNodes;  
			for (var i = 0; i < sonnodes.length; i++) {   
				var sonnode = sonnodes.item(i);  
				traverseNodes(sonnode, msg_id);  
			}  
		}  
	}
}

function observer(msg){
	if(msg=="body"){
		var target=document.body;
	}
	else if(msg=="head"){
		var target=document.head;
	}
	else if(msg=="title"){
		var target=document.getElementsByTagName("title")
	}
	else{
		var target= document.getElementById(msg);
	}
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	var observer = new MutationObserver(function(mutations){

		mutations.forEach(function(mutation) 
		{
			//console.log(mutation);
		});

		info_pack(msg);
	});
	var config = {
		characterData: true,
		characterDataOldValue: true,
		childList: true,
		subtree: true, 
		attributes: true
	};
	observer.observe(target, config);
}

function info_pack(msg)
{
	if(msg=="body"){
		mirror_body = document.getElementsByTagName("body")["0"].innerHTML;
	}
	else if(msg=="head"){
		mirror_body = document.getElementsByTagName("head")["0"].innerHTML;
	}
	else if(msg=="title"){
		mirror_body = document.getElementsByTagName("title")["0"].innerHTML;
	}
	else{
		mirror_body = document.getElementById(msg).innerHTML;
	}
	mirror_body=sanitize(mirror_body);
	x_id=1;
	if(mirror_body.length > 512)
	{
		pack_separate(mirror_body, x_id)
	}
	else
	{
		pack_transmittion(mirror_body, x_id)
	}
}

function pack_transmittion(msg, id, module)
{
	transmitinfo=new Array(id, 1, 1, msg);
	//console.log(transmitinfo);
	console.log(typeof(transmitinfo));
	ses.postMessage(transmitinfo);
}

function pack_separate(msg, id){
	console.log(msg.length);
	row_item=parseInt(msg.length/512)+1;
	//console.log(row_item);
	index=0;
	endpoint=512;
	transmitinfo= new Array;
	packet_id=create_id();
	//package_info[packet_id]= new Array();
	for(i=1; i<=row_item; i++)
	{
		if(i==row_item)
		{
			transmitinfo=new Array(id, row_item, i, packet_id, msg.substring(index));
		}
		else
		{
			transmitinfo=new Array(id, row_item, i, packet_id, msg.substring(index,endpoint));	
			index = index +512;
			endpoint= endpoint +512;	
		}
		//package_info[packet_id][i]=transmitinfo.toString();
		//console.log(package_info);
		ses.postMessage(transmitinfo);			
	}
}

function replacebutton(msg)
{
	//console.log(msg);
	var divmirror=document.getElementById(msg);	
	if(divmirror.getElementsByTagName("input") || divmirror.getElementsByTagName("button"))
	{
		btnslength_input=divmirror.getElementsByTagName("input").length;
		btnslength_button=divmirror.getElementsByTagName("button").length;
		for(var i=0; i < btnslength_input; i++)
		{	
			divmirror.getElementsByTagName("input")[i].onclick=function (){refunction_button(this,msg)};			
		}
		for(var i=0; i < btnslength_button; i++)
		{	
			divmirror.getElementsByTagName("button")[i].onclick=function (){refunction_button(this, msg)};			
		}
	}
	traverseNodes(divmirror, msg);	
}


function create_id(){
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//function for client-client model

module_selection="0";

function send_events_execute(e)
{
	//console.log(e); 
	//console.log(Sync.peers.trigger5);
	switch(e.type)
	{
		case "click": 
			//console.log(e);
			//console.log(Sync.peers.trigger5);
			if(e.srcElement.onclick !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue; 
					//console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				console.log(msg);
			}
			break;
				
		case "blur": 
			if(e.srcElement.onblur !=null){
				console.log(e);	
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				msg= new Array(module_selection, e.type, e.target.id, e.target.localName, t_name, e.target.value);
				ses.postMessage(msg);
			}			
			break;
				
		case "change":
			if(e.srcElement.onchange !=null){
				//console.log(e);
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				msg= new Array(module_selection, e.type, e.target.id, e.target.localName, t_name,e.target.value);
				ses.postMessage(msg);
			}		
			break;
			
		case "focus": 
			if(e.srcElement.onfocus !=null){
				//console.log(e);
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				msg= new Array(module_selection, e.type, e.target.id, e.target.localName, t_name,e.target.value);
				ses.postMessage(msg);
			}		
			break;
			
		case "dblclick": 
			if(e.srcElement.ondblclick !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					//console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				//console.log(msg);
			}
			break;
			
		case "keydown": 
			if(e.srcElement.onkeydown !=null){
				//console.log(e);
				if(e.target.id.length >0){
					t_value=document.getElementById(e.target.id).value;
				}else{
					t_value=document.getElementsByName(e.target.name).value;
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				e=e;
				event=event;
				msg= new Array(module_selection, e.type, e.target.id, t_name, e.keyCode, t_value);
				ses.postMessage(msg);
			}			
			break;
			
		case "keypress": 
			if(e.srcElement.onkeypress !=null){
				//console.log(e);
				if(e.target.id.length >0){
					t_value=document.getElementById(e.target.id).value;
				}else{
					t_value=document.getElementsByName(e.target.name).value;
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				msg= new Array(module_selection, e.type, e.target.id, t_name, e.keyCode, t_value);
				ses.postMessage(msg);
			}		
			break;
			
		case "keyup": 
			if(e.srcElement.onkeyup !=null){
				//console.log(e);
				if(e.target.id.length >0){
					t_value=document.getElementById(e.target.id).value;
				}else{
					t_value=document.getElementsByName(e.target.name).value;
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				msg= new Array(module_selection, e.type, e.target.id, t_name, e.keyCode, t_value);
				ses.postMessage(msg);
			}		
			break;
					
		case "mousedown": 
			if(e.srcElement.onmousedown !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					//console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				//console.log(msg);
			}
			break;
			
		case "mouseover": 
			if(e.srcElement.onmouseover !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				//console.log(msg);
			}
			break;
			
		case "mouseout":
			if(e.srcElement.onmouseout !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				//console.log(msg);
			}
			break;
			
		case "mouseup": 
			if(e.srcElement.onmouseup !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				//console.log(msg);
			}
			break;
		
		case "mousemove":
				if(e.srcElement.onmousemove !=null)
				{
					//console.log(e);
				}
				break;
			
		case "reset": 
			
			if(e.srcElement.onreset !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, e.target.innerHTML);
				ses.postMessage(msg);
				//console.log(msg);
			}
			break;
			
		case "select": 
			console.log(Sync.peers.trigger5);
			if(e.srcElement.onselect !=null){
				//console.log(e);
				if(e.target.defaultValue){
					t_value=e.target.defaultValue;
					console.log(t_value);
				}else{
					t_value="";
				}
				if(e.target.name){
					t_name=e.target.name;
				}else{
					t_name="";
				}
				if(e.target.innerHTML.length>1){
					inner_value=e.target.innerHTML;
				}else{
					inner_value=e.target.value;
				}	
				msg= new Array(module_selection, e.type, e.target.id, t_value, e.target.localName, t_name, inner_value);
				ses.postMessage(msg);
				console.log(msg);
			}
			break;
				
		case "submit": 
				if(e.srcElement.onsubmit !=null)
				{
					//console.log(e);
				}	
					break;
			default: break;
	}
}

function do_sync(msg)
{
	switch(msg[1]){
		case "click":		
			peers_synchronization_mouse(msg);
			break;
		case "blur":
			peers_synchronization_about_focus(msg);
			break;
		case "change":
			peers_synchronization_change(msg);
			break;
		case "focus":
			peers_synchronization_about_focus(msg);
			break;
		case "dblclick":
			peers_synchronization_mouse(msg);
			break;
		case "mousedown":
			peers_synchronization_mouse(msg);
			break;
		case "mouseup":
			peers_synchronization_mouse(msg);
			break;
		case "mouseover":			
			peers_synchronization_mouse(msg);
			break;				
		case "mouseout":			
			peers_synchronization_mouse(msg);
			break;				
		case "mousemove":
			peers_synchronization_mouse(msg);
			break;
		case "keydown":
			peers_synchronization_keyboard(msg);
			break;
		case "keyup":
			peers_synchronization_keyboard(msg);
			break;
		case "keypress":
			peers_synchronization_keyboard(msg);
			break;
		case "select":
			peers_synchronization_select(msg);
			break;
		case "reset":
			peers_synchronization_mouse(msg);
			break;
	}
}

function peers_synchronization_mouse(ic)
{	
	//console.log(ic);
	if(ic[2].length>=1){
		//console.log(Sync.peers.trigger5);
		if(ic[1]=="click"){
			//Sync.peers.trigger5=true;
			document.getElementById(ic[2]).onclick();
		}else if(ic[1]=="dblclick"){
			//Sync.peers.trigger5=true;
			document.getElementById(ic[2]).ondblclick();
		}else if(ic[1]=="mousedown"){
			//Sync.peers.trigger5=true;	
			document.getElementById(ic[2]).onmousedown();
		}else if(ic[1]=="mouseup"){
			//Sync.peers.trigger5=true;
			document.getElementById(ic[2]).onmouseup();
		}else if(ic[1]=="mouseover"){
			//Sync.peers.trigger5=true;
			document.getElementById(ic[2]).onmouseover();
		}else if(ic[1]=="mouseout"){
			//Sync.peers.trigger5=true;
			document.getElementById(ic[2]).onmouseout();
		}else if(ic[1]=="reset"){
			if(document.getElementById(ic[2]).getElementsByTagName("input").length>1){
				for(i=0; i< document.getElementById(ic[2]).getElementsByTagName("input").length; i++)
				{
					if(document.getElementById(ic[2]).getElementsByTagName("input")[i].type=="reset")
					{
						//Sync.peers.trigger5=true;
						document.getElementById(ic[2]).getElementsByTagName("input")[i].onclick();
					}
				}
			}else{
				//Sync.peers.trigger5=true;
				document.getElementById(ic[2]).getElementsByTagName("input").onclick();
			}
		}
	}else if(document.getElementsByName(ic[5]).length>=1){ //find it by name
		namelist=document.getElementsByName(ic[5]);
		//console.log(namelist);
		for (i=0; i < namelist.length; i++)
		{
			if(namelist[i].value==ic[3]){
				//console.log(Sync.peers.trigger5);
				//document.getElementsByName(ic[5])[i].event_do;
				if(ic[1]=="click"){
					//Sync.peers.trigger5=true;
					document.getElementsByName(ic[5])[i].onclick();
				}else if(ic[1]=="dblclick"){
					//Sync.peers.trigger5=true;
					document.getElementsByName(ic[5])[i].ondblclick();
				}else if(ic[1]=="mousedown"){
					//Sync.peers.trigger5=true;
					document.getElementsByName(ic[5])[i].onmousedown();
				}else if(ic[1]=="mouseup"){
					//Sync.peers.trigger5=true;
					document.getElementsByName(ic[5])[i].onmouseup();
				}else if(ic[1]=="mouseout"){
					//Sync.peers.trigger5=true;
					document.getElementsByName(ic[5])[i].onmouseout();
				}else if(ic[1]=="mouseover"){
					//Sync.peers.trigger5=true;
					document.getElementsByName(ic[5])[i].onmouseover();
				}else if(ic[1]=="reset"){
					if(document.getElementsByName(ic[5])[i].getElementsByTagName("input").length>1){
						for(j=0; j< document.getElementsByName(ic[5])[i].getElementsByTagName("input").length; j++)
						{
							if(document.getElementsByName(ic[5])[i].getElementsByTagName("input")[j].type=="reset")
							{
								//Sync.peers.trigger5=true;
								document.getElementsByName(ic[5])[i].getElementsByTagName("input")[j].onclick();
							}
						}
					}else{
						//Sync.peers.trigger5=true;
						document.getElementsByName(ic[5])[i].getElementsByTagName("input").onclick();
					}
				}
			}
		}
			
	}else{
		if(ic.length > 7){
			info_part = new Array();
			for(var i=6; i<ic.length; i++)
			{
				info_part.push(ic[i]);
			}
			info_part_string = info_part.join(",");
		}else{
			info_part_string=ic[6];
		}
		taglist=document.getElementsByTagName(ic[4]);
		for (i=0; i < taglist.length; i++)
		{
			if(taglist[i].innerHTML==info_part_string){
				//console.log(Sync.peers.trigger5);
				//console.log(document.getElementsByTagName(ic[4])[i]);
				if(ic[1]=="click"){
					//Sync.peers.trigger5=true;
					document.getElementsByTagName(ic[4])[i].onclick();
				}else if(ic[1]=="dblclick"){
					//Sync.peers.trigger5=true;
					document.getElementsByTagName(ic[4])[i].ondblclick();
				}else if(ic[1]=="mousedown"){
					//Sync.peers.trigger5=true;
					document.getElementsByTagName(ic[4])[i].onmousedown();
				}else if(ic[1]=="mouseup"){
					//Sync.peers.trigger5=true;
					document.getElementsByTagName(ic[4])[i].onmouseup();
				}else if(ic[1]=="mouseover"){
					//Sync.peers.trigger5=true;
					document.getElementsByTagName(ic[4])[i].onmouseover();
				}else if(ic[1]=="mouseout"){
					//Sync.peers.trigger5=true;
					document.getElementsByTagName(ic[4])[i].onmouseout();
				}else if(ic[1]=="reset"){
					if(document.getElementsByTagName(ic[4])[i].getElementsByTagName("input").length>1){
						for(j=0; j< document.getElementsByTagName(ic[4])[i].getElementsByTagName("input").length; j++)
						{
							if(document.getElementsByTagName(ic[4])[i].getElementsByTagName("input")[j].type=="reset")
							{
								//Sync.peers.trigger5=true;
								document.getElementsByTagName(ic[4])[i].getElementsByTagName("input")[j].onclick();
							}
						}
					}
					else{
						//Sync.peers.trigger5=true;
						document.getElementsByTagName(ic[4])[i].getElementsByTagName("input").onclick();
					}
				}		
			}
		}		
	}
}

function peers_synchronization_about_focus(ic)
{
	if(ic.length > 6)
	{
		info_part = new Array();
		for(var i=5; i<ic.length; i++)
		{
			info_part.push(ic[i]);
		}
		info_part_string = info_part.join(",");
	}
	else
	{
		info_part_string = ic[5];
	}
	tp=document.getElementById(ic[2]);
	tp.value = info_part_string;
	if(ic[1]=="blur"){
		//Sync.peers.trigger5=true;
		document.getElementById(ic[2]).onfocus()
		document.getElementById(ic[2]).onblur();
	}else{
		//Sync.peers.trigger5=true;
		document.getElementById(ic[2]).onfocus();
	}
}

function peers_synchronization_change(ic)
{
	if(document.getElementById(ic[2]).type=="text"){
		document.getElementById(ic[2]).onfocus();
	}
	if(ic.length > 6)
	{
		info_part = new Array();
		for(var i=5; i<ic.length; i++)
		{
			info_part.push(ic[i]);
		}
		info_part_string = info_part.join(",");
	}
	else
	{
		info_part_string = ic[5];
	}
	//console.log(info_part_string);
	sel = document.getElementById(ic[2]);
	sel.value=info_part_string;
	//Sync.peers.trigger5=true;
	sel.onchange();
}

function peers_synchronization_keyboard(ic)
{
	//console.log(ic);
	if(ic.length > 6)
	{
		info_part = new Array();
		for(var i=5; i<ic.length; i++)
		{
			info_part.push(ic[i]);
		}
		info_part_string = info_part.join(",");
	}
	else
	{
		info_part_string = ic[5];
	}
	//console.log(info_part_string);
	event={};
	e={};
	event.keyCode=ic[4];
	e.keyCode=ic[4];
	if(ic[2].length > 0){
		tp=document.getElementById(ic[2]);
		tp.value = info_part_string;
		
		if(ic[1]=="keydown"){
			//Sync.peers.trigger5=true;
			tp.onkeydown();
		}else if(ic[1]=="keyup"){
			//Sync.peers.trigger5=true;
			tp.onkeyup();
		}else if(ic[1]=="keypress"){
			//Sync.peers.trigger5=true;
			tp.onkeypress();
		}
	}else{
		tp=document.getElementsByName(ic[3]);
		tp.value = info_part_string;
		
		if(ic[1]=="keydown"){
			//Sync.peers.trigger5=true;
			tp.onkeydown();
		}else if(ic[1]=="keyup"){
			//Sync.peers.trigger5=true;
			tp.onkeyup();
		}else if(ic[1]=="keypress"){
			//Sync.peers.trigger5=true;
			tp.onkeypress();
		}
	}
	delete e.keyCode;
	delete event.keyCode;
}

function peers_synchronization_select(ic)
{
	//console.log(ic);
	if(ic.length > 7){
		info_part = new Array();
		for(var i=6; i<ic.length; i++)
		{
			info_part.push(ic[i]);
		}
		info_part_string = info_part.join(",");
	}else{
		info_part_string=ic[6];
	}
	if(ic[2].length>=1){
		//Sync.peers.trigger5=true;
		document.getElementById(ic[2]).onselect();	
	}else if(document.getElementsByName(ic[5]).length>=1){ //find it by name
		namelist=document.getElementsByName(ic[5]);
		//console.log(namelist);
		for (i=0; i < namelist.length; i++)
		{
			if(namelist[i].value==ic[3] || namelist[i].value==info_part_string || namelist[i].innerHTML==info_part_string){
				//Sync.peers.trigger5=true;
				document.getElementsByName(ic[5])[i].onselect();
			}
		}
			//document.getElementById(ic[5])
	}else{
		taglist=document.getElementsByTagName(ic[4]);
		for (i=0; i < taglist.length; i++)
		{
			if(taglist[i].innerHTML==info_part_string || taglist[i].value==info_part_string){
				//Sync.peers.trigger5=true;
				document.getElementsByTagName(ic[4])[i].onselect();		
			}
		}		
	}
}
