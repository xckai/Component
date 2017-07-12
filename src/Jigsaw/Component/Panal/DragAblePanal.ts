import { Component } from '../../Core/Component';
import { View } from '../../Core/View';

export class DragAblePanal extends Component{
    constructor(conf?){
        super(conf)
        this.rootView=new DragComponentView()
        this.rootView.doRender()
    }
    rootView:DragComponentView
    initRootView(conf){
         this.rootView=new DragComponentView(conf)
         this.rootView.addClass("dragablepanal")
    }
}
class DragComponentView extends View{
    events(){
        return {"mousedown aside":"beginDraging"}
    }
    offsetx:number=0
    offsety:number=0
    beginDraging(e:JQueryMouseEventObject){
        let isDraging=false, beginX=null,beginY=null;
        let mousemove=(e:JQueryMouseEventObject)=>{
            if(isDraging){
               this.offsetx+=(e.clientX-beginX)
               this.offsety+=(e.clientY-beginY)
               beginX=e.clientX
               beginY=e.clientY
            }else{
               beginX=e.clientX
               beginY=e.clientY
               isDraging=true
            }
            this.style({
                transform:`translate(${this.offsetx}px,${this.offsety}px)`
            })
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault()
        }
        let mouseup=(e:JQueryMouseEventObject)=>{
            this.$el.parent().off("mousemove",mousemove)
            this.$el.parent().off("mouseup",mouseup)
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault()
        }
        this.$el.parent().on("mousemove",mousemove)
        this.$el.parent().on("mouseup",mouseup)
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault()
    }
    render(){
        this.$el.html(`<aside class="left"></aside>
            <div class="content"></div>
        <aside class="right"></aside>`)
        return this
    }
     getContentNode(){
        return this.$(".content")[0]
    }
    getContentNode$(){
        return this.$(".content")
    }
    
}
