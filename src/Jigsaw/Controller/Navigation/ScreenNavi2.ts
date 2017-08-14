import { JView } from './../../Core/JView';
import { JController } from './../../Core/JController';
import {Component} from"../../Core/Component"
import _=require("lodash")
import {  IControllerConfig,  } from "../../Core/Controller";
import { Container } from "../Container/Container";
import mustache=require("mustache")
import { BackboneView } from "../../Core/View";
import { ControllerView } from "../../Controller/Container/ControllerView";

class ScreenNavi2View extends JView{
    constructor(conf?){
        super(conf)
    }
    events(){
        return{
            "click .screen-nav-icon":"switchScreen"
        }
    }
    switchScreen(){
        console.log("click")
        if(this.currentScreen==1){
            this.navTo(2)
        }else if(this.currentScreen==2){
            this.navTo(1)
        }
        
    }
    render(){
        this.$el.html(`<div class='screen-nav-icon screen-nav-icon-left' style="display:none">
                               <span class ='toggle fa fa-angle-double-left '> 
                        </div>
                        <div class='screen-nav-icon screen-nav-icon-right'>
                               <span class ='toggle fa fa-angle-double-right '> 
                        </div>
                        <content class='screen-nav-content'><div class='screen screen1'></div><div class='screen screen2'></div></content>`)
        return this
    }
    getScreen1(){
        return this.$(".screen1")
    }
    getScreen2(){
        return this.$(".screen2")
    }
    currentScreen:number=1
    navTo(i:number){
        if(i==this.currentScreen){
            return
        }else{
            if(i==1){
                this.$(".screen-nav-content").css("transform","translate(0px,0px)")
                this.$(".screen-nav-icon-left").fadeOut(500)
                this.$(".screen-nav-icon-right").fadeIn(500)
            }else{
                this.$(".screen-nav-content").css("transform","translate(-100%,0px)")
                this.$(".screen-nav-icon-left").fadeIn(500)
                this.$(".screen-nav-icon-right").fadeOut(500)
            }
            this.currentScreen=i
        }
        this.trigger("screenChange",{i})
        return this
    }
}

export class ScreenNavi2 extends JController {
    initView(){
        this.view=new ScreenNavi2View(this.config)
        this.proxyEvents(this.view,"screenChange")
        this.view.addClass("screen-nav")
        this.view.render()
    }
    id:string
    view:ScreenNavi2View
    defaultConfig(){
        return _.extend(super.defaultConfig(),{position:"absolute",left:"0px",right:"0px",bottom:"0px",top:"0px"})
    }
    addToScreen1(dom:JQuery){
        this.view.getScreen1().html("")
        this.view.getScreen1().append(dom)
        return this
    }
    addToScreen2(dom:JQuery){
        this.view.getScreen2().html("")
        this.view.getScreen2().append(dom)
        return this
    }
    NaviTo(i:number){
        this.view.navTo(i)
    } 
    
}
    