function Loader(width,height,strokeWidth) {
    this.SVG_NS = "http://www.w3.org/2000/svg";
    this.id = "loader";
    this.width = width;
    this.height = height;
    this.strokeWidth = strokeWidth;
}
Loader.prototype.makeContainer=function(id){
    var elem = document.createElementNS("http://www.w3.org/1999/xhtml", "div");  
    elem.style.position="absolute";
    elem.style.left="0px";
    elem.style.right="0px";
    elem.style.top="0px";
    elem.style.bottom="0px";
    elem.setAttribute("id",id)
    elem.classList="loaderContainer"
    return elem; 
}
Loader.prototype.makeSVG = function(tag, attributes) {
    var elem = document.createElementNS(this.SVG_NS, tag);  
    for (var attribute in attributes) {
        var name = attribute;  
        var value = attributes[attribute];  
        elem.setAttribute(name, value);  
    }  
    return elem; 
}

Loader.prototype.addCircleLoader = function() {
    var container=this.makeContainer(this.id)
    var frament =document.createDocumentFragment();
    var centerX = this.width / 2,
        centerY = this.height / 2,
        radius1 = this.width > this.height? this.height / 2 - this.strokeWidth : this.width / 2 - this.strokeWidth,
        radius2 = radius1 - this.strokeWidth * 3;
    var svgNode = this.makeSVG("svg",{width:this.width,height:this.height});
    var group = this.makeSVG("g",{});
    
    var circle1 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius1});
    group.appendChild(circle1);
    var path1 = this.makeSVG("path",{id:"path1",d:"M"+centerX+" "+this.strokeWidth+" "+"A"+radius1+" "+radius1+" 0 0 1 "+centerX+" "+(centerY+radius1)});
    var animateTransform1 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"0"+" "+centerX+" "+centerY, to:"360"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"});
    path1.appendChild(animateTransform1);
    group.appendChild(path1);

    var circle2 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius2});
    group.appendChild(circle2);
    var path2 = this.makeSVG("path",{id:"path2",d:"M"+centerX+" "+(centerY+radius2)+" "+"A"+radius2+" "+radius2+" 0 0 1 "+centerX+" "+(centerY-radius2)});
    var animateTransform2 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"360"+" "+centerX+" "+centerY, to:"0"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"});
    path2.appendChild(animateTransform2);
    group.appendChild(path2);

    var text = this.makeSVG("text",{transform:"translate("+centerX+","+centerY+")"});
    var str = "Loading...";
    for(var i = 0; i < str.length; i++) {
        var tspan = this.makeSVG("tspan",{});
        tspan.textContent=str.charAt(i);
        if (i == 0) {
            var animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:"0s;ani9.end",dur:"0.5s"});
            var animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:"0s;ani"+str.length+".end",dur:"0.5s",fill:"freeze"});
        } else {
            var animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:("ani"+(i-1)+".end"),dur:"0.5s"});
            var animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:("ani"+(i-1)+".end"),dur:"0.5s",fill:"freeze"});
        }
        tspan.appendChild(animateSize);
        tspan.appendChild(animateColor);
        text.appendChild(tspan);
    }
    group.appendChild(text);

    svgNode.appendChild(group);
    frament.appendChild(svgNode);
    container.appendChild(frament)
    document.body.appendChild(container);
    this.initTime=new Date().getTime()
}

Loader.prototype.removeLoader =function() {
    var loader =document.getElementById(this.id)
    var finishTime=new Date().getTime()
    let duration=3000
    if(finishTime-this.initTime>duration){
        this.removeWithAnimation()
    }else{
        setTimeout(this.removeWithAnimation.bind(this),duration-finishTime+this.initTime)
    }
    
}
Loader.prototype.removeWithAnimation=function(){
    var loader =document.getElementById(this.id)
    loader.style.transform="translate(-100%,0)"
    setTimeout(function(){
        loader.remove()
    },1000)
}
window.initLoader=new Loader(200,200,5)
window.initLoader.addCircleLoader()