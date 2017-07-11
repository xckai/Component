import {Component} from"../../Core/Component"
import {Model} from"../../Core/Model"
import { View } from "../../Core/View"
import {Util}from "../../Utils/Util"
import _=require("underscore")
class SideView extends View{
    constructor(conf?){
        super(conf)
        this.config=_.extend({direction:"left"},conf)
        this.render()
    }
    events(){
       return {
            "click .toggle":"toggle"
       }
    }
    config:{
             direction:string,
              style:any  
            }
    toggle(e?){
        if(this.$el.hasClass("toggle-hidden")){
            ///close
            this.open()

        }else{
            //open
            this.hidden()
        }
       
    }
    open(){
          requestAnimationFrame(()=>{
               this.$el.css("transform","")
            this.$el.find(".fa").removeClass("fa-rotate-180")
            this.removeClass("toggle-hidden") 
            this.addClass("toggle-show") 
          })
    }
    hidden(){
        switch(this.config.direction){
            case "left":{
                this.$el.css("transform","translate(-100%, 0)")
                this.$el.find(".fa").addClass("fa-rotate-180")
               break;
            }
            case "right":{
                this.$el.css("transform","translate(100%, 0)")
                this.$el.find(".fa").addClass("fa-rotate-180")
            }
        }
          this.addClass("toggle-hidden") 
          this.removeClass("toggle-show") 
    }
    render(){
        this.$el.html(`
                        <content></content>
                        <div class='toggle ${this.config.direction}'>
                            <span class='fa fa-angle-double-${this.config.direction} fa-rotate-180'></span>
                        </div>`
                        )
        return this
    }
}

export class Side extends Component{
    constructor(conf?){
        super(conf)
        this.rootView=new SideView(Util.deepExtend({tagName:"section",class:"side", style:{
                bottom:null,
                right:null
           }},conf))
        this.rootView.hidden()
        // this.Content=new Content("Pudong Smart Traffic")
        // this.title.renderAt(this.view.getNode$())
    }
    getContentContainer(){
        return this.rootView.$("content")
    }
    rootView:SideView
    show(){
        this.rootView.open()
    }
    hidden(){
        this.rootView.hidden()
    }
    toggle(){
        this.rootView.toggle()
    }
}
