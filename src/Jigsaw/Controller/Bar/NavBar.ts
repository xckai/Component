import {Component} from"../../Core/Component"
import { View, IViewConfig } from "../../Core/View"
import { Model } from "../../Core/Model"
import _=require("lodash")
import { Util } from "../../Utils/Util";
import { Controller, IControllerConfig } from "../../Core/Controller";
class TitleModel extends Model {
    constructor(conf?){
        super(conf)
    }
    defaults(){
       return {
            title:"Default Title"
       }
    }
}
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
export class NavBar extends Controller{
    constructor(conf?:INavBarConfig){
        super()
        this.view=new NavBarView(_.extend({width:"100%",position:"absolute",top:"0px",height:"3rem"},conf))
    }
    children:{[id:string]:Controller}
    addContent(c:Controller|HTMLElement|JQuery){
        if(c instanceof Controller){
            this.view.getContentNode$().append(c.view.getNode())
            this.children[c.id]=c
        }else{
            this.view.getContentNode$().append(c)
        }
        return this
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
}
    