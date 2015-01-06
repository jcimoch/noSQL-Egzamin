var fs = require('fs');
var sax = require("sax");
 var options= {
 	strict:true,
 	normalize:true
 };
var tagStack=[];
var isText=false, isId=false;
var saxStream = require("sax").createStream(options)

saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e)
  // clear the error
  this._parser.error = null
  this._parser.resume()
})

saxStream.on("opentag", function (node) {
  // same object as above
  if(node.name==="text"){
  		isText= true;
  		console.log(node.tag);	  	
  }
  else
  	isText=false;
  if(node.name==="id"&&tagStack.indexOf("revision") <= -1)
  	isId = true;
  else
  	isId=false;
  tagStack.push(node.name)
});

saxStream.on("closetag", function(){
	 tagStack.pop();
	 isText = false;
	 isId = false;

})

saxStream.on("end",function(){
	fs.appendFileSync('output.json','] \n');
});

saxStream.on("text", function (text) {
		if(isId){
			fs.appendFileSync('output.json','{\n"id": '+text.replace(/(\r\n|\n|\r)/gm,'').replace(/[^a-zA-Z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]/g,'')+', \n');
		}
		
		if(isText&&!isId){
			fs.appendFileSync('output.json',' "text": '+'" '+text.replace(/(\r\n|\n|\r)/gm,'').replace(/[^a-zA-Z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]/g ,'').substring(0,40)+'" \n'+' }, \n');
		}
});

fs.appendFileSync('output.json','[ \n');

fs.createReadStream("small.xml").pipe(saxStream)

