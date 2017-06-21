import {View} from "./View"
import _ =require("underscore")
import {Util}from "./Util"
import {EventBus} from "./Evented"
export class Component extends EventBus  {
     constructor(conf?){
         super()
         if(conf && conf.id){
             this.id=conf.id
         }else{
             this.id=_.uniqueId("Component")
         }
         this.rootView=new View({tagName:"section"})
         this.setConfig(conf)
     }
    rootView:View
    parent:Component
    children:Component []=[]
    id:string
    config:IControllerConfig={
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
    setConfig(c){
      this.config=Util.deepExtend(this.config,c)
      this.updataConfig()
      return this
    }

    updataConfig(){
        this.rootView.setClass(this.config.className)
        this.rootView.style(this.config.style)
        return this
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
        this.rootView.remove()
    }
}
export interface IControllerConfig{
            className:string ,
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