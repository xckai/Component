import { JController } from './../../Core/JController';
import { JView } from './../../Core/JView';
import _=require("lodash")
import d3 = require("d3")
import mustache=require("mustache")


class ScreenNavi2View extends JView{
    constructor(conf?){
        super(conf)
    }
    events(){
        return{
            "click .screen-nav-btn":"switchScreen",
            "mouseenter .screen-nav-btn-left":"leftBtnChange",
            "mouseleave .screen-nav-btn-left":"leftBtnRecover",
            "mouseenter .screen-nav-btn-right":"rightBtnChange",
            "mouseleave .screen-nav-btn-right":"rightBtnRecover"
        }
    }
    switchScreen(){
        if(this.currentScreen==1){
            this.navTo(2)
        }else if(this.currentScreen==2){
            this.navTo(1)
        } 
    }
    leftBtnChange(){
        let leftBtn = d3.select(".screen-nav-btn-left")
        leftBtn.select(".btn-border").style("animation","drawBorder 1s forwards")
        leftBtn.select(".btn-line1").attr("d","M10 35 L15 50 L10 65").style("opacity","0.5")
               .append("animate").attr("attributeName","opacity")
               .attr("values","0.5;1.0;0.5").attr("begin","0s")
               .attr("dur","1s").attr("repeatCount","indefinite")
        leftBtn.select(".btn-line2").attr("d","M20 35 L25 50 L20 65").style("opacity","0.5")
               .append("animate").attr("attributeName","opacity")
               .attr("values","0.5;1;0.5").attr("begin","0.3s")
               .attr("dur","1s").attr("repeatCount","indefinite")
        leftBtn.select(".btn-line3").attr("d","M30 35 L35 50 L30 65").style("opacity","0.5")
               .append("animate").attr("attributeName","opacity")
               .attr("values","0.5;1;0.5").attr("begin","0.6s")
               .attr("dur","1s").attr("repeatCount","indefinite")
    }
    leftBtnRecover(){
        let leftBtn = d3.select(".screen-nav-btn-left")
        leftBtn.select(".btn-border").style("animation","eraseBorder 1s forwards")
        leftBtn.select(".btn-line1").attr("d","M10 35 v30")
        leftBtn.select(".btn-line2").attr("d","M20 35 v30")
        leftBtn.select(".btn-line3").attr("d","M30 35 v30")
        leftBtn.selectAll("animate").remove()
    }
    rightBtnChange(){
        let rightBtn = d3.select(".screen-nav-btn-right")
        rightBtn.select(".btn-border").style("animation","drawBorder 1s forwards")
        rightBtn.select(".btn-line1").attr("d","M15 35 L10 50 L15 65").style("opacity","0.5")
        .append("animate").attr("attributeName","opacity")
        .attr("values","0.5;1.0;0.5").attr("begin","0.6s")
        .attr("dur","1s").attr("repeatCount","indefinite")
        rightBtn.select(".btn-line2").attr("d","M25 35 L20 50 L25 65").style("opacity","0.5")
        .append("animate").attr("attributeName","opacity")
        .attr("values","0.5;1.0;0.5").attr("begin","0.3s")
        .attr("dur","1s").attr("repeatCount","indefinite")
        rightBtn.select(".btn-line3").attr("d","M35 35 L30 50 L35 65").style("opacity","0.5")
        .append("animate").attr("attributeName","opacity")
        .attr("values","0.5;1.0;0.5").attr("begin","0s")
        .attr("dur","1s").attr("repeatCount","indefinite")
    }
    rightBtnRecover(){
        let rightBtn = d3.select(".screen-nav-btn-right")
        rightBtn.select(".btn-border").style("animation","eraseBorder 1s forwards")
        rightBtn.select(".btn-line1").attr("d","M15 35 v30")
        rightBtn.select(".btn-line2").attr("d","M25 35 v30")
        rightBtn.select(".btn-line3").attr("d","M35 35 v30")
        rightBtn.selectAll("animate").remove()
    }
    render(){
        this.$el.html(`<div class='screen-nav-btn screen-nav-btn-left'  style='opacity:0'>
                           <svg x="0px" y="0px" width="45px" height="100px" viewbox="0 0 45 100">
                             <path class='solid-btn-border' d='M0 1 L40 20 L40 80 L0 99'></path>
                             <path class='btn-border btn-border-left' id='btnLeft' d='M0 1 L40 20 L40 80 L0 99'></path>
                              
                               <g class='btn-icon'>
                                   <path class='btn-line1' d='M10 35 v30'>
                                   </path>
                                   <path class='btn-line2' d='M20 35 v30'>
                                   </path>
                                   <path class='btn-line3' d='M30 35 v30'>
                                   </path>
                               </g>
                           </svg>
                       </div>
                       <div class='screen-nav-btn screen-nav-btn-right'>
                           <svg x="0px" y="0px" width="45px" height="100px" viewbox="0 0 45 100">
                                <path  class='solid-btn-border'  d='M45 1 L1 20 L1 80 L45 99'/>
                               <path class='btn-border btn-border-right' d='M45 1 L1 20 L1 80 L45 99'/>
                               <g class='btn-icon'>
                                   <path class='btn-line1' d='M15 35 v30'></path>
                                   <path class='btn-line2' d='M25 35 v30'></path>
                                   <path class='btn-line3' d='M35 35 v30'></path>
                               </g>
                           </svg>
                       </div>
                       <content class='screen-nav-content'>
                           <div class='screen screen1'></div>
                           <div class='screen screen2'></div>
                       </content>`)
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
                this.$(">.screen-nav-content").css("transform","translate(0px,0px)")
                this.$(".screen-nav-btn-left").animate({opacity:"0"},500).css("pointer-events","none")
                this.$(".screen-nav-btn-right").animate({opacity:".3"},1000,()=>{this.$(".screen-nav-btn-right").css("opacity","")}).css("pointer-events","auto")
            }else{
                this.$(">.screen-nav-content").css("transform","translate(-100%,0px)")
                this.$(".screen-nav-btn-left").animate({opacity:".3"},1000,()=>{this.$(".screen-nav-btn-left").css("opacity","")}).css("pointer-events","auto")
                this.$(".screen-nav-btn-right").animate({opacity:"0"},500).css("pointer-events","none")
            }
            this.currentScreen=i
        }
        this.trigger("screenChange",{i})
        return this
    }
}
export class ScreenNavi2Ocatagon extends JController {
    initView(){
        this.view=new ScreenNavi2View(this.config)
        this.proxyEvents(this.view,"screenChange")
        this.view.addClass("screen-nav2-ocatagon")
        this.view.render()
    }
    id:string
    view:ScreenNavi2View
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
    