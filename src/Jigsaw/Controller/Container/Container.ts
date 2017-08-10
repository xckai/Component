import {  IControllerConfig, Controller } from "../../Core/Controller";
import _ = require("lodash")
import { IView } from "../../Core/IView";
import { BackboneView } from "../../Core/View";
export class ContainerView extends BackboneView {
    render(){
        this.$el.html("<content></content>")
        return this
    }
    getContentNode$(){
        return this.$("content")
    }
    
}
export class Container extends Controller implements IView {
    id:string
    initView(){
        return this
    }
    init(){
        this.view=new ContainerView(this.config)
    }
    view:ContainerView
    getNode$(){
        return this.view.getNode$()
    }
    render(){
        this.view.render()
        return this
    }
    style(k,v){
        this.view.style(k,v)
        return this
    }
    addClass(c){
        this.view.addClass(c)
        return this
    }
    removeClass(c){
        this.view.removeClass(c)
        return this
    }
    addController(c:Controller){
        if(this.childrenControllers[c.id]){
            this.childrenControllers[c.id].remove()
        }
        this.childrenControllers[c.id]=c
        this.view.getContentNode$().append(c.getNode$())
        c.render()
        return this
    }
    childrenControllers:{[id:string]:Controller}={}
}