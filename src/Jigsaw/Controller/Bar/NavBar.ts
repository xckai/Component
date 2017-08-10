import {Component} from"../../Core/Component"
import { BackboneView } from "../../Core/View"
import _=require("lodash")
import {  IControllerConfig, IController } from "../../Core/Controller";
import { Containter, IContainerConfig } from "../Containter";
import mustache=require("mustache")

class NavBarView extends BackboneView{
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
export interface INavBarConfig extends IContainerConfig{
    title?:string|number
}
export class NavBar extends Containter {
    init(){
        this.view=new NavBarView(this.config)
    }
    defaultConfig(){
        return {
            class:"navbar",title:""
        }
    }
    id:string
    view:NavBarView

    getNode$(){
        return this.view.getContentNode$()
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
    