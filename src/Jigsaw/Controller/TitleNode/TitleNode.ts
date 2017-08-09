import { View, IViewConfig } from "../../Core/View"
import {  IControllerConfig, IController } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _=require("lodash")

export interface ITitleNodeConfig extends IControllerConfig,IViewConfig{
    title?:string
}
class titleView extends View{
    constructor(c:ITitleNodeConfig){
        super(c)
        this.title=c.title
    }
    render(){
        this.$el.html(`<span>${this.title}</span>`)
        return this
    }
    title:string

}
export class TitleNode extends Evented implements IController {
    constructor(conf?:ITitleNodeConfig){
        super()
        this.id=_.uniqueId("title-")
        this.view=new titleView(_.extend(this.defaultConfig(),conf))
        this.view.addClass("title")
    }
    defaultConfig(){
        return {}
    }
    setTitle(t:string){
        this.view.title=t
        this.view.doRender()
    }
    render(){
        this.view.doRender()
        return this
    }
    id:string
    view:titleView
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
    