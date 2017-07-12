import {View} from "./View"
import _ =require("underscore")
import {Util}from "../Utils/Util"
import {EventBus} from "./Evented"
const getProperty=Util.getProperty
export class Component extends EventBus  {
     constructor(conf?){
         super()
         this.id=_.uniqueId("Component")
         this.initRootView(conf)

    }
    initRootView(conf){
         this.rootView=new View(_.extend({tagName:"section"},conf))
         this.rootView.addClass("componentContainer")
    }
    rootView:View
    parent:Component
    children:Component []=[]
    id:string
    deepExtend(...args){
        return Util.deepExtend.apply(null,args)
    }
    setStyle(s){
        this.rootView.style(s)
        return this
    }
    addClass(c){
        this.rootView.addClass(c)
        return this
    }
    removeClass(c){
        this.rootView.removeClass(c)
    }
    addTo(c:Component,listen?){
        this.parent=c
        this.parent.add(this,listen)
        return this
    }
    add(nc:Component,listen?){
       let i=_.findIndex(this.children,c=>c.id==nc.id)
       nc.parent=this
       this.observe(nc)
       if(i==-1){
           this.children.push(nc)
          
       }else{
           this.children[i]=nc
       }
       nc.rootView.getNode$().appendTo(this.rootView.getNode$())
       return this
    }
    remove(){
        if(this.parent){
            this.parent.removeChild(this)
        }
        this.rootView.remove()
        super.destroy()
    }
    removeChild(c:Component){
        
    }
    setBusy(b){
        this.rootView.setBusy(b)
    }
}
export interface IComponentConfig{
            className:string ,
            class:string,
            $el:JQuery|null
            el:any|null,
            style:{
                    position:string | null |undefined,
                    left:string | null |undefined,
                    right:string | null |undefined,
                    top:string | null |undefined,
                    bottom:string | null |undefined,
                    width:string | null |undefined,
                    height:string | null |undefined
            }
}