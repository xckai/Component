import _ =require("underscore")
import {curry}from "./FP"
export module Util{
export function isEndWith(s:any,ed:string){
    let ss= s.toString();
    let matcher= new RegExp(ed+"$")
    return matcher.test(ss);
  }
export function toPixel(s:string,ctx?:string){
    if(isEndWith(s,"px")){
        return parseFloat(s)
    }
    if(isEndWith(s,"rem")){
         let font=window.getComputedStyle(document.body).getPropertyValue('font-size')||"16px"
         return parseFloat(s) * parseFloat(font)
    }
    if(isEndWith(s,"%")){
        return parseFloat(s)* toPixel(ctx)/100
    }
        return 0
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
// export function curry(f) {
//         var arity = f.length;
//         return function f1(r1?,r2?,r3?) {
//             var args = Array.prototype.slice.call(arguments, 0);
//             if(args.length < arity) {
//                 var f2= function() {
//                     var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
//                     return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
//                 }
//                 return f2;
//             } else {
//                 return f.apply(null, args); //all parameters are provided call the origin function
//             }
//         }
//     }
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