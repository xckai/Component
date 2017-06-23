import {View} from "./View"
import _ =require("underscore")
import {Util}from "./Util"
import {EventBus} from "./Evented"
export class Component extends EventBus  {
     constructor(conf?){
         super()
         this.id=_.uniqueId("Component")
         this.config=this.defaultConfig()
         this.mergeConfig(conf)
         this.rootView=new View(this.getViewConfig(conf))
         this.updateStyle()
    }
    rootView:View
    parent:Component
    children:Component []=[]
    id:string
    defaultConfig(){
        return {
                                el:null,
                                $el:null,
                                className:"",
                                style:{
                                    position:"absolute",
                                    left:"0px",
                                    right:"0px",
                                    top:"0px",
                                    bottom:"0px",
                                    width:null,
                                    height:null
                                    }
                                }
    }
    setConfig(c){
        this.mergeConfig(c)
        this.updateConfig()
    }
    updateConfig(){
        this.updateStyle()
        this.rootView.setClass(this.config.className)
    }
    config:IComponentConfig
    mergeConfig(c){
        if(c){
            this.config= _.extend(this.defaultConfig(),_.pick(c,"className","el","$el","tagName"))
            this.config.style=_.extend(this.defaultConfig().style,c["style"])
        }
        return this
    }
    getViewConfig(c){
        return _.extend({},_.pick(this.defaultConfig(),"tagName","el","className","$el"),c)
    }
    style(c){
        this.config.style=_.extend(this.defaultConfig().style,c)
    }
    updateStyle(){
        this.rootView.style(this.config.style)
        this.rootView.setClass(this.config.className)
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
        this.destroy()
    }
    removeChild(c:Component){
        
    }
    setBusy(b){
        this.rootView.setBusy(b)
    }
}
export interface IComponentConfig{
            className:string ,
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