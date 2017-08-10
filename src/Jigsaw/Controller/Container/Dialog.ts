import { IControllerConfig } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _ = require("lodash")
import { ContainerView, Container } from "../Container/Container";

export interface IDialogViewConfig extends IControllerConfig{
    title?:string
}
class DialogView extends ContainerView {
    config:IDialogViewConfig
    render() {
        this.$el.html(`<div><content></content></div>`)
        return this
    }
    initOctagon(){
        this.$el.append(`<div class=octagon><aside class=top><span/></aside><aside class=bottom><span/></aside><aside class=left><span/></aside><aside class=right><span/></aside>' +
      '<aside class=left-top><span/></aside><aside class=right-top><span/></aside><aside class=left-bottom><span/></aside><aside class=right-bottom><span/></aside><main/></div>`)
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
export class CircleSide extends Container {
    init(){
        this.view=new CircleSideView(this.config)
        this.view.addClass("circleSide")
    }
    config:ICircleSideConfig
    id: string
    view: CircleSideView
    defaultConfig(): ICircleSideConfig {
        return {
            tagName: "div",
            direction: "left"
        }
    }

}