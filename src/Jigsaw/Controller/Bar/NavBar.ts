import {Component} from"../../Core/Component"
import { View, IViewConfig } from "../../Core/View"
import _=require("lodash")
import { Util } from "../../Utils/Util";
import {  IControllerConfig, IController } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";

class NavBarView extends View{
    constructor(conf?){
        super(conf)
    }  
    render(){
        this.$el.html("<content></content>")
        return this
    }
    getContentNode(){
        return this.$("content").eq(0)
    }
    getContentNode$(){
        return this.$("content")
    }
}
export interface INavBarConfig extends IControllerConfig{
    title?:string|number
}
export class NavBar extends Evented implements IController {
    constructor(conf?:INavBarConfig){
        super()
        this.id=_.uniqueId("navbar-")
        this.view=new NavBarView(_.extend(this.defaultConfig(),conf))
    }
    defaultConfig(){
        return {
            class:"navbar",title:""
        }
    }
    render(){
        this.view.doRender()
        return this
    }
    id:string
    view:NavBarView
    children:{[id:string]:IController}
    addController(c:IController){
        if(this.children[c.id]){
            this.children[c.id].remove()
        }
        this.children[c.id]=c
        this.addContent(c.getNode())
        return this
    }
    addContent(c:HTMLElement|JQuery|SVGAElement){
        this.view.getContentNode$().append(c)
        return this
    }
    getNode(){
        return this.view.el
    }
    setTitle(t:string){
        let node=this.view.$(".title")
        if(node.empty()){
            this.view.$el.append(`<div class='title'>${t}</div>`)
        }else{
            node.val(t)
        }
        return this
    }
    setBusy(b){
        this.view.setBusy(b)
        return this
    }
    remove(){
        this.view.remove()
        return this
    }
    
}
    