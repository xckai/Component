import { IController, IControllerConfig } from "../Core/Controller";
import { Evented } from "../Core/Evented";
import _ = require("lodash")
import { View, IViewConfig } from "../Core/View";
export interface IContainerConfig extends IControllerConfig,IViewConfig{}
export class Containter extends Evented implements IController {
    constructor(c?:IContainerConfig){
        super()
        this.id=(c&& c.id!=undefined)?c.id:_.uniqueId("container-")
        this.view=new View(c)
        this.childrenControllers={}
    }
    id:string
    view:View
    getNode(){
        return this.view.el
    }
    getNode$(){
        return this.view.$el
    }
    addController(c:IController){
        if(this.childrenControllers[c.id]){
            this.childrenControllers[c.id].remove()
        }
        this.childrenControllers[c.id]=c
        this.getNode$().append(c.getNode())
        c.render()
        return this
    }
    childrenControllers:{[id:string]:IController}
    defaultConfig():IContainerConfig{
        return{
            tagName:"div"
        }
    }
    setBusy(b){
        this.view.setBusy(b)
         return this
    }
    render(){
        this.view.doRender()
        _.each(this.childrenControllers,c=>this.getNode$().append(c.getNode()))
        return this
    }
    remove(){
        this.view.remove()
         return this
    }
    
}