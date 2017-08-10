import _ = require("lodash")
import { Evented, IEvented } from "./Evented";
import { IControllerView, IViewConfig } from "./IView";
import { BackboneView } from "./View";
export interface IControllerConfig extends IViewConfig {
    id?:string
}
export class Controller extends Evented{
    constructor(c?:IControllerConfig){
        super()
        this.id=(c && c.id!=undefined)?c.id:_.uniqueId("component-")
        this.config=_.extend(this.defaultConfig(),c)
        this.init()
    }
    id:string
    config:IControllerConfig
    defaultConfig(){
        return {}
    }
    init(){
      this.view=new BackboneView(this.config)
    }
    setBusy(b){
        this.view.setBusy(b)
    }
    remove(){
        $(this.view.getNode$()).remove()
    }
    render(){
        this.view.render()
    }
    getNode$(){
        return this.view.getNode$()
    }
    view:IControllerView
}