import _ = require("lodash")
import { Evented } from "./Evented";
import { View, IViewConfig } from "./View";
export interface IControllerConfig extends IViewConfig{
    id?:string
}
export class Controller extends Evented {
    constructor(conf?:IControllerConfig){
        super()
        this.view=new View(conf)
        this.id=(conf&&conf.id!=undefined)?conf.id:_.uniqueId("controller-")
    }
    id:string
    view:View
    setBusy(b){
         this.view.setBusy(b)
     }
}