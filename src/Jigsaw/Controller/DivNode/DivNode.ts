import { View, IViewConfig } from "../../Core/View"
import {  IControllerConfig, IController } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _=require("lodash")

export interface IDivNodeConfig extends IControllerConfig,IViewConfig{
  
}
export class DivNode extends Evented implements IController {
    constructor(conf?:IDivNodeConfig){
        super()
        this.id=_.uniqueId("icon-")
        this.view=new View(_.extend(this.defaultConfig(),conf))
    }
    defaultConfig(){
        return {}
    }
    render(){
        this.view.doRender()
        return this
    }
    id:string
    view:View
    getNode(){
        return this.view.el
    }
    setBusy(b){
        return this
    }
    remove(){
        this.view.remove()
        return this
    }
    
}
    