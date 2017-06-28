import {View} from "./View"
import _ =require("underscore")
import {Util}from "./Utils/Util"
import {EventBus} from "./Evented"
const getProperty=Util.getProperty
export class Component extends EventBus  {
     constructor(conf?){
         super()
         this.id=_.uniqueId("Component")
         this.config=this.defaultConfig()
         this.rootView=new View(_.extend({},_.pick(this.defaultConfig(),"tagName","el","className","$el"),conf))
         this.setConfig(conf)
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
                                class:"",
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
        this.rootView.addClass(this.config.class)
    }
    config:IComponentConfig
    mergeConfig(c){
        if(c){
            this.config= _.extend(this.defaultConfig(),_.pick(c,"className","el","$el","tagName","class"))
            this.config.style=_.extend(this.defaultConfig().style,getProperty(this.config,"style"),c["style"])
        }
        return this
    }
    style(c){
        this.config.style=_.extend(this.defaultConfig().style,getProperty(this.config,"style"),c)
        this.updateStyle()
    }
    addClass(c){
        this.rootView.addClass(c)
        return this
    }
    removeClass(c){
        this.rootView.removeClass(c)
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