import {View} from "./View"
import _ =require("underscore")
import {Util}from "./Util"
export class Controller {
    constructor(conf?){
        this.view=new View(conf)
        this.setConfig(conf)
    }
    view:View
    config:IControllerConfig={
                                class:[],
                                style:{
                                    position:"absolute",
                                    left:"0px",
                                    right:"0px",
                                    top:"0px",
                                    bottom:"0px",
                                    display:"inhert",
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
      this.view.setClass(this.config.class)
      this.view.style(this.config.style)
      return this
  }
   renderAt(dom){
       this.invokeBeforeRender()
       this.view.render()
       this.view.getNode$().appendTo(dom)
       this.invokeAterRender()
   }
    onAfterRender(){}
    onBeforeRender(){}
    invokeAterRender(){
        if(this.onAfterRender){
            this.onAfterRender()
        }
        return this
    }
    invokeBeforeRender(){
        if(this.onBeforeRender){
            this.onBeforeRender()
        }
    }
}
export interface IControllerConfig{
            class:string [],
            style:{
                    position:string | null |undefined,
                    left:string | null |undefined,
                    right:string | null |undefined,
                    top:string | null |undefined,
                    bottom:string | null |undefined,
                    display:string | null |undefined,
                    width:string | null |undefined,
                    height:string | null |undefined
            }
}