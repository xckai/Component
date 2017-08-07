import _ =require("lodash")
import {curry}from "./FP"
export module Util{
export function isEndWith(s:any,ed:string){
    let ss= s.toString();
    let matcher= new RegExp(ed+"$")
    return matcher.test(ss);
  }
export function toPixel(str:string|number,ctx?:string){
    let string2Pixel = (s)=>{
        if(_.isNumber(s)) {
            return s
        }
        else if(isEndWith(s,"px")) {
            return parseFloat(s)
        }
        else if(isEndWith(s,"rem")) {
            let font=window.getComputedStyle(document.body).getPropertyValue('font-size')||"16px"
            return parseFloat(s) * parseFloat(font)
        }
        else if(isEndWith(s,"%")){
            return parseFloat(s)* toPixel(ctx)/100
        }else{
            return 0
        }
    }
    if(_.isNumber(str)) {
        return string2Pixel(str)
    }
    else if(_.isUndefined(str)||_.isNull(str)) {
        return str
    }
    else if(_.isFunction(str)) {
        return toPixel(str.call(null))
    }
    else {
        if(str.split("+").length>= 2){
            return toPixel(str.split("+").slice(0,1).join(""))+toPixel(str.split("+").slice(1).join("+"))    
        }
        else if(str.split("-").length>= 2){
            return toPixel(str.split("-").slice(0,1).join(""))-toPixel(str.split("-").slice(1).join("-"))    
        }
        else{
            return string2Pixel(str)
        }
    }
}
export function isBeginWith(s:any,bs:string){
    let ss= s.toString();
    let matcher= new RegExp("^"+bs)
    return matcher.test(ss);
  }
export function isContaint(s,ss){
    let matcher= new RegExp(ss)
    return matcher.test(s.toString());
  }

export function max (nums:any [],key?){
       let n=Number.MIN_VALUE;
       if(key){
           nums=nums.map(n=>n[key])
       }
       nums.forEach((num)=>{
            n=isNaN(num)?n: n>num? n:num;
       })
       n= n==Number.MIN_VALUE?0:n;
       return n;
    }
export function min (ns:any [],key?){
       let n=Number.MAX_VALUE;
       if(key){
           ns=ns.map(n=>n[key])
       }
       ns.forEach((num)=>{
            n=isNaN(num)?n: n<num? n:num;
       })
       n= n == Number.MAX_VALUE?0:n;
       return n;
    }
export let d3Invoke = curry((method?:string,obj?:any)=>{
    return (d3Selection)=>{
        _.each(obj,(v,k)=>{
            d3Selection[method](k,v)
        })
        return d3Selection
    }
})
export  function  deepExtend(des,...source:any[]){
        if(des==undefined || des==null){
            des={}
        }
        _.each(source,(s)=>{
            if(_.isArray(s)){
                let args=[des].concat(s)
                deepExtend.apply(this,args)
            }else{
                _.each(s,(v,k)=>{
                if(_.isObject(v)){
                    if(_.isUndefined(des[k])){
                        des[k]={}
                    }
                    deepExtend(des[k],v)
                }else{
                     des[k]=v
                }
               
            })
            }
           
        })
        return des
    }
// var stringCache={cla:null,font_size:0,length:0,r:{width:0,height:0}} 
export function getStringRect(str:string, cla ?:string,font_size?:number){
        let d= window.document.createElement("div");
        let p = window.document.createElement("span");
        let r ={width:0,height:0};
        d.style.transform="translate3d(0, 0, 0)";
        d.style.visibility="hidden";
        d.className="getStringRect"
        p.innerHTML= str;
        if(cla){
            p.className=cla;
        }
        if(font_size){
            p.style["font-size"]=font_size+"px"
        }
        if(!str){
            return r;
        }
        p.style.display="inline-block";
        d.appendChild(p);
        window.document.body.appendChild(d);
        let rec=p.getBoundingClientRect()
        r.width=rec.width;
        r.height=rec.height;
        d.remove();
        return r;
    }
export function CacheAble(fn:any,keyFn?){
    let _key=function(){
        return  arguments2Array(arguments).join("-")
    }
    let cache={}
    _key=keyFn?keyFn:_key
    return function(){
        let args=arguments2Array(arguments)
       
        if(cache[_key.apply(null,args)]){
            return cache[_key.apply(null,args)]
        }else{
             console.log("not cached",args)
             return cache[_key.apply(null,args)]=fn.apply(null,args)  
        }
    }
}
export function getProperty(obj,paths:string){
    let spliter="/"
    let path=paths.split("/")
    let r=obj
    for(let i=0;i<path.length;++i){
        if(_.has(r,path[i])){
              r=r[path[i]]
        }else{
            r=undefined
        }
    }
    return r
}

function arguments2Array(args){
    let r=[]
    for(let i=0;i<args.length;++i){
        r.push(args[i])
    }
    return r
}
export function enableAutoResize(dom:any,fn){
       function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            }
            if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            }

            return element.style[prop];
        }
        if (getComputedStyle(dom, 'position') == 'static') {
                dom.style.position = 'relative';
        }
        for(let i=0;i<dom.childNodes.length;++i){
            if(dom.childNodes[i].className =="autoResier"){
                dom.removeChild(dom.childNodes[i])
            }
        }
        let oldWidth=dom.offsetWidth,oldHeight=dom.offsetHeight,refId=0
        let d1= window.document.createElement("div")
        let d2=window.document.createElement("div")
        let d3=window.document.createElement("div")
        d1.className="autoResier"
        
        d1.setAttribute("style"," position: absolute; left: 0; top: 0; right: 0; overflow:hidden; visibility: hidden; bottom: 0; z-index: -1")
        d2.setAttribute("style","position: absolute; left: 0; top: 0; right: 0; overflow:scroll; bottom: 0; z-index: -1")
        d3.setAttribute("style","position: absolute; left: 0; top: 0; transition: 0s ;height: 100000px;width:100000px")
        d2.appendChild(d3)
        d1.appendChild(d2)
        dom.appendChild(d1)
        d2.scrollLeft=100000
        d2.scrollTop=100000
        d2.onscroll=(e)=>{
            d2.scrollLeft=100000;
            d2.scrollTop=100000;
            if((dom.offsetHeight!= oldHeight || dom.offsetWidth!=oldWidth) &&refId===0){
                refId= requestAnimationFrame(onresize) 
            }
        }
        function onresize(){
           refId=0
           if(fn){
               fn({oldHeight:oldHeight,oldWidth:oldWidth,height:dom.offsetHeight,width:dom.offsetWidth})
           }
            oldWidth=dom.offsetWidth,oldHeight=dom.offsetHeight
        }
    }
    export namespace loader{
         export function addKeyFrames(frameData){
        let frameName=frameData.name||""
        let css=""
        css+=("@-webkit-keyframes "+frameName+"{")
          for (var key in frameData) {
                if (key !== "name" && key !== "media" && key !== "complete") {
                    css += key + " {";

                    for (var property in frameData[key]) {
                        css += property + ":" + frameData[key][property] + ";";
                    }

                    css += "}";
                }
            }
        css+="}"
        let ssDom=$("style#" + frameName)
        if(ssDom.length>0){
            ssDom.html(css)
        }else{
            ssDom=$("<style></style>").attr({"id":frameName,type: "text/css"})
                .html(css).appendTo("head")
        }
    }
    export function genBallBusy(size,num?){
        let i=num==undefined?3:num
        let $div=$("<div class='busyContainer'></div>").css({
            position:"absolute",
            top:"0px",
            bottom:"0px",
            left:"0px",
            right:"0px",
            display:"flex",
            "align-items":"center",
            "justify-content":"center",
            "z-index":10000
        })
        let c=$("<div></div>").css({
            display:"inline-flex"
        })
        let w=size
        for(let ii=0;ii<i;++ii){
            let t=$("<div class='ball'></div>")
            t.css({
                width:w+"rem",
                height:w+"rem",
                margin:0.6*w+"rem",
                "border-radius":"100%",
                animation:"shake 1s ease-in-out+"+2*ii/i+"s infinite  alternate"
            })
            
            c.append(t)
        }
        let beginkey=100/i +"%",endkey=300/i +"%",frame={
                name:"shake",
                from:{"-webkit-transform":"scale(1); "},
                "to":{ "-webkit-transform":"scale(2); "}
            }
       // frame[beginkey]={ "-webkit-transform":"scale(2); "}
       // frame[endkey]={ "-webkit-transform":"scale(1); "}
        addKeyFrames(frame)
        $div.append(c)
        return $div.get(0)
    }
    export class ProgressBarLoader{
        constructor(w?,h?,str?){
            this.width=w||300
            this.height=h||300
            this.loadingText=str||"Loading..."
        }
        container:any
        loadingText:string
        width:number
        height:number
        svgNode:any
        barLineNode:any
        makeSVG(tag,attributes){
             let SVG_NS = "http://www.w3.org/2000/svg"
             var elem = document.createElementNS(SVG_NS, tag);  
                for (var attribute in attributes) {
                    var name = attribute;  
                    var value = attributes[attribute];  
                    elem.setAttribute(name, value);  
                }  
                return elem; 
        }
        toHtml(){
            let container=this.container =$("<div class='progressContainer'></div>").css({
                    position:"absolute",
                    top:"0px",
                    bottom:"0px",
                    left:"0px",
                    right:"0px",
                    display:"flex",
                    "align-items":"center",
                    "justify-content":"center",
                    "z-index":10000,
                    "transform":"translate(-100%,0)",
                    transition: "transform 1s linear"
                })[0],svgNode;
            this.svgNode= svgNode= this.makeSVG("svg",{ width:this.width,height:this.height});

            let defs = this.makeSVG("defs",{});
            let linearGradient = this.makeSVG("linearGradient",{id:"color-gradient",x1:"0", y1:"0%", x2:"99.33%", y2:"0%", gradientUnits:"userSpaceOnUse"})
            let stop1 = this.makeSVG("stop",{offset:"0%",style:"stop-color:yellow"});
            let stop2 = this.makeSVG("stop",{offset:"100%",style:"stop-color:aqua"});
            linearGradient.appendChild(stop1);
            linearGradient.appendChild(stop2); 
            defs.appendChild(linearGradient);
            svgNode.appendChild(defs);

            let lineBase = this.makeSVG("line",{ "stroke-width": 30,
                                                    stroke:"#fff",
                                                    "stroke-dasharray":"5.5",
                                                     x1:"0", y1:this.height/3,
                                                     x2:"100%",y2:this.height/3+0.001,
                                                    class:"linebase"})
            
            let lineColor =this.barLineNode = this.makeSVG("line",{transition: "all 0.5s ease",
                                                                        "stroke-width": 30,
                                                                        "stroke-dasharray":"5.5",
                                                                        x1:"0",y1:this.height/3, 
                                                                        x2:"0%",y2:this.height/3+0.001,
                                                                        class:"linecolor"})
          
            svgNode.appendChild(lineBase);
            svgNode.appendChild(lineColor);

            let text = this.makeSVG("text",{transform:"translate("+this.width/2+","+this.height/3*2+")",
                                                "font-size": "20px",
                                                "text-anchor":" middle",
                                                fill:"#fff",
                                                "stroke-width":0,
                                                class:"texts"
                                             })
         
            let str = this.loadingText;
            for(let i = 0; i < str.length; i++) {
                let tspan = this.makeSVG("tspan",{});
                tspan.textContent=str.charAt(i);
                let animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:(i==0?"0s":("ani"+(i-1)+".end")),dur:"0.5s",repeatCount:"indefinite"});
                let animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:(i==0?"0s":("ani"+(i-1)+".end")),dur:"0.5s",repeatCount:"indefinite"});
                tspan.appendChild(animateSize);
                tspan.appendChild(animateColor);
                text.appendChild(tspan);
            }
            svgNode.appendChild(text);

            container.appendChild(svgNode);
            return container
        }
        setProgress(v:number){
            if(this.barLineNode){
                this.barLineNode.setAttribute("x2",`${v}%`)
            }
        }
        show(){
            setTimeout(()=>{
                  this.container.style.transform="translate(0,0)"
            },10)
        }
        remove(){
            if(this.container.parent){
                this.container.style.transform="translate(-100%,0)"
                setTimeout(()=>{
                     this.container.parent.removeChild(this.container)
                },1000)
            }
        }
    }
    export function genBusyDiv(width,height,i,color?){
        let $div=$("<div class='busyContainer'></div>").css({
            position:"absolute",
            top:"0px",
            bottom:"0px",
            left:"0px",
            right:"0px",
            display:"flex",
            "align-items":"center",
            "justify-content":"center",
            "z-index":10000
        })
        let c=$("<div></div>").css({
            display:"inline-flex"
        })
        let w=Math.min(width,height)/10
        for(let ii=0;ii<i;++ii){
            let t=$("<div></div>")
            t.css({
                width:w+"rem",
                height:w+"rem",
                background:color||"blue",
                margin:0.6*w+"rem",
                "border-radius":"100%",
                animation:"shake 1s ease-in-out+"+2*ii/i+"s infinite  alternate"
            })
            
            c.append(t)
        }
        let beginkey=100/i +"%",endkey=300/i +"%",frame={
                name:"shake",
                from:{"-webkit-transform":"scale(1); "},
                "to":{ "-webkit-transform":"scale(2); "}
            }
       // frame[beginkey]={ "-webkit-transform":"scale(2); "}
       // frame[endkey]={ "-webkit-transform":"scale(1); "}
        addKeyFrames(frame)
        $div.append(c)
        return $div.get(0)
    }
    export function BounceBusyDiv(width,height,i,color?,str?){
        let $div=$("<div class='busyContainer'></div>").css({
            position:"absolute",
            top:"0px",
            bottom:"0px",
            left:"0px",
            right:"0px",
            display:"flex",
            "align-items":"center",
            "justify-content":"center",
            "z-index":1000,
            background: "linear-gradient(to left, #76b852 , #8DC26F)"
        })
        let cc=$("<div></div>").css({
            display:"inline",
        })
        let ball=$("<div></div>"),shadow=$("<div></div>")
        ball.css({
            width:"30px",
            height:"30px",
            "border-radius":"100%",
            "z-index":20,
            position:"relative",
            animation:"bounce 1.5s ease-in-out 0s infinite",
            margin: "0px auto"
        }).addClass("ball")
        shadow.css({
            width:"30px",
            height:"15px",
            "border-radius":"100%",
            "z-index":1,
            position:"relative",
            top:"-10px",
            animation:"scaleout 1.5s ease-in-out 0s infinite"
        }).addClass("shadow")
        addKeyFrames({
             name:"bounce",
                from:{"-webkit-transform":"translate(0px,0px); "},
                "50%":{ "-webkit-transform":"translate(0px,-40px)"},
                "to":{ "-webkit-transform":"translate(0px,0px);"}
        }) 
        addKeyFrames({
             name:"scaleout",
                from:{"-webkit-transform":"scale(0) translate(0px ,0px); "},
                "50%":{ "-webkit-transform":"scale(1) translate(0px ,2px); "},
                "to":{ "-webkit-transform":"scale(0) translate(0px ,0px); "}
        })
        // let c=$("<div></div>").css({
        //     display:"inline-flex"
        // })
        // let w=Math.min(width,height)/10
        // for(let ii=0;ii<i;++ii){
        //     let t=$("<div></div>")
        //     t.css({
        //         width:w+"px",
        //         height:w+"px",
        //         background:color||"blue",
        //         margin:0.6*w+"px",
        //         "border-radius":"100%",
        //         animation:"bounce+"+i/2+"s linear+"+ii/2+"s infinite"
        //     })
            
        //     c.append(t)
        // }
        // let beginkey=50/i +"%",endkey=150/i +"%",frame={
        //         name:"bounce",
        //         from:{"-webkit-transform":"scale(1); "},
        //         "to":{ "-webkit-transform":"scale(1); "}
        //     }
        // frame[beginkey]={ "-webkit-transform":"scale(2); "}
        // //frame[endkey]={ "-webkit-transform":"scale(1); "}
        // addKeyFrames(frame)
      
        cc.append(ball).append(shadow).appendTo($div)
        if(str){
             let text=$("<div></div>").appendTo($div).css({
                 margin:"0px 40px",
                "padding-bottom": "20px"
             }).addClass("textloader")
             let h1=$("<h1></h1>").appendTo(text)
             _.each(str,s=>{
                 h1.append("<span>"+s+"</span>")
             })
        }
       

        return $div.get(0)
    }
    }
}