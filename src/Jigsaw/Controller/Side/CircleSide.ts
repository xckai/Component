import { IController, IControllerConfig } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _ = require("lodash")
import { View, IViewConfig } from "../../Core/View";
export interface ICircleSideConfig extends IControllerConfig, IViewConfig {
    direction?: string,
    isOpen?: boolean
}

class CircleSideView extends View {
    constructor(c: ICircleSideConfig) {
        super(c)
        this.config = c
    }
    config: ICircleSideConfig
    render() {
        this.$el.html(`<div class='toggleContainer'>
                               <span class ='toggle fa fa-angle-double-${this.config.direction} fa-rotate-180'> 
                            </div>
                            <content></content>`)
        return this
    }
    show(){
        requestAnimationFrame(()=>{
            this.$el.css("transform","")
            this.removeClass("toggle-hide")
        })
        this.config.isOpen=true
    }
    hide(){
        switch(this.config.direction){
            case "left":{
                this.$el.css("transform","translate(-100%, 0)")
               break;
            }
            case "right":{
                this.$el.css("transform","translate(100%, 0)")
            }
        }
        this.config.isOpen=false
        this.addClass("toggle-hide")
    }
}
export class CircleSide extends Evented implements IController {
    constructor(c?: ICircleSideConfig) {
        super()
        this.id = (c && c.id != undefined) ? c.id : _.uniqueId("container-")
        this.view = new CircleSideView(_.extend(this.defaultConfig(),c))
        this.view.addClass("circleSide")
        this.childrenControllers = {}
    }
    id: string
    view: CircleSideView
    getNode() {
        return this.view.el
    }
    getNode$() {
        return this.view.$el
    }
    addController(c: IController) {
        if (this.childrenControllers[c.id]) {
            this.childrenControllers[c.id].remove()
        }
        this.childrenControllers[c.id] = c
        this.getNode$().append(c.getNode())
        c.render()
        return this
    }
    addContent(e:HTMLElement|SVGAElement){
        this.view.$("content").append(e)
        return this
    }
    childrenControllers: { [id: string]: IController }
    defaultConfig(): ICircleSideConfig {
        return {
            tagName: "div",
            direction: "left"
        }
    }
    setBusy(b) {
        this.view.setBusy(b)
        return this
    }
    render() {
        this.view.doRender()
        return this
    }
    remove() {
        this.view.remove()
        return this
    }

}