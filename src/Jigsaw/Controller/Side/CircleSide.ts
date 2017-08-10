import { IControllerConfig } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _ = require("lodash")
import { ContainerView, Container } from "../Container/Container";
export interface ICircleSideConfig extends IControllerConfig {
    direction?: string,
    isOpen?: boolean
}

class CircleSideView extends ContainerView {
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