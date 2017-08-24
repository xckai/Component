import {IProgressLoader} from "./ILoader"
import {Util} from "../../Jigsaw/Utils/Util"

export class CircleLoader implements IProgressLoader{
    id = "loader";
    el:HTMLElement
    width:number
    height:number
    strokeWidth:number
    oldRatio:number
    interval:number
    constructor(width,height,strokeWidth) {
        this.width = Util.toPixel(width)
        this.height = Util.toPixel(height)
        this.strokeWidth = Util.toPixel(strokeWidth)
    }

    setWidth(width:string) {
        this.width = Util.toPixel(width)
        return this
    }

    setHeight(height:string) {
        this.height = Util.toPixel(height)
        return this
    }

    setStrokeWidth(strokeWidth:string) {
        this.height = Util.toPixel(strokeWidth)
        return this
    }

    makeSVG(tag, attributes) {
        let elem = document.createElementNS("http://www.w3.org/2000/svg", tag)
        for (let attribute in attributes) {
            let name = attribute
            let value = attributes[attribute] 
            elem.setAttribute(name, value)  
        }  
        return elem
    }

    addTo(el:HTMLElement) {
        this.el.style.transform = "translate(-100%,0)"
        this.oldRatio = 0
        this.interval = 1000
        el.appendChild(this.el)
        return this
    }

    toElement() {
        this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div")  
        this.el.setAttribute("id",this.id)
        this.el.setAttribute("class","porgressLoaderContainer")

        let centerX = this.width / 2,
            centerY = this.width / 2,
            radius1 = this.width / 2 - this.strokeWidth,
            radius2 = radius1 - this.strokeWidth * 3
        let svgNode = this.makeSVG("svg",{width:this.width,height:this.height})
        let group = this.makeSVG("g",{})
        
        let circle1 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius1})
        group.appendChild(circle1)
        let path1 = this.makeSVG("path",{class:"path1",d:"M"+centerX+" "+this.strokeWidth+" "+"A"+radius1+" "+radius1+" 0 0 1 "+centerX+" "+(centerY+radius1)})
        let animateTransform1 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"0"+" "+centerX+" "+centerY, to:"360"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"})
        path1.appendChild(animateTransform1)
        group.appendChild(path1)

        let circle2 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius2})
        group.appendChild(circle2)
        let path2 = this.makeSVG("path",{class:"path2",d:"M"+centerX+" "+(centerY+radius2)+" "+"A"+radius2+" "+radius2+" 0 0 1 "+centerX+" "+(centerY-radius2)})
        let animateTransform2 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"360"+" "+centerX+" "+centerY, to:"0"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"})
        path2.appendChild(animateTransform2)
        group.appendChild(path2)

        let ratio = this.makeSVG("text",{transform:"translate("+centerX+","+centerY+")", class:"loaderRatio"})
        ratio.textContent = "0%"
        group.appendChild(ratio)

        let text = this.makeSVG("text",{transform:"translate("+centerX+","+((this.height+this.width)/2)+")", class:"loaderText"})
        let str = "Calculating..."
        for(let i = 0; i < str.length; i++) {
            let tspan = this.makeSVG("tspan",{})
            tspan.textContent=str.charAt(i)
            let animateSize,animateColor
            if (i == 0) {
                animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:"0s;ani13.end",dur:"0.5s"})
                animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:"0s;ani"+str.length+".end",dur:"0.5s",fill:"freeze"})
            } else {
                animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:("ani"+(i-1)+".end"),dur:"0.5s"})
                animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:("ani"+(i-1)+".end"),dur:"0.5s",fill:"freeze"})
            }
            tspan.appendChild(animateSize)
            tspan.appendChild(animateColor)
            text.appendChild(tspan)
        }
        group.appendChild(text)
        svgNode.appendChild(group)

        this.el.appendChild(svgNode)
        return this.el
    }

    show() {
        requestAnimationFrame(()=>{
            this.el.style.transform = "translate(0,0)"
        })
        return this
    }
    intervalIndex:number
    setProgress(ratio:number) {
        let temp = this.oldRatio
        if(this.intervalIndex){
            clearInterval(this.intervalIndex)
            this.intervalIndex=0
        }
        this.intervalIndex=setInterval(()=>{
                if(this.oldRatio < ratio) {
                    document.getElementsByClassName("loaderRatio")[0].textContent = this.oldRatio + 1 + "%"
                    this.oldRatio += 1
                }
                else {
                    if(ratio == 100) {
                         clearInterval(this.intervalIndex)
                         this.intervalIndex=0
                    }
                    else
                        return this
                }
            },50)
        this.interval = (ratio - temp)*50

        return this
    }

    remove() {
         this.el.style.transform = "translate(-100%,0)"
        setTimeout(()=>{
            this.el.remove()
        },1000)
        return this
    }
}