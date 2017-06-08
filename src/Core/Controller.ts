import {View} from "./View"
import _ =require("underscore")
export class Controller {
    constructor(conf?){
        this.view=new View({el:"div"})
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
      this.config=_.extend(this.config,c)
      this.updataConfig()
      return this
    }
  updataConfig(){
      this.view.setClass(this.config.class)
      this.view.style(this.config.style)
      return this
  }
   renderAt(dom){
       this.view.render()
       this.view.getNode$().appendTo(dom)
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