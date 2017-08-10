
import { IControllerConfig, Controller } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _=require("lodash")
import { BackboneView } from "../../Core/View";

export interface ITitleNodeConfig extends IControllerConfig{
    title?:string
}
class TitleView extends BackboneView{
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
export class TitleNode extends Controller {
    constructor(conf?:ITitleNodeConfig){
        super(conf)
        this.id=_.uniqueId("title-")
    }
    defaultConfig(){
        return {title:"Title"}
    }
    init(){
        this.view=new TitleView(this.config)
        this.view.addClass("title")
    }
    view:TitleView
    setTitle(t:string){
        this.view.title=t
        this.view.render()
    }
    
}
    