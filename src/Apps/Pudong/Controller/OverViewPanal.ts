import { Controller } from "../../../Jigsaw/Core/Controller";
import { BackboneView } from "../../..//Jigsaw/Core/View";
import Backbone =require("backbone")
import Mustache=require("mustache")

class OverViewModel extends Backbone.Model{
    defaults(){
        return {
            publicTransportationShare:"--",
            publicTransportationAccCard:"--",
            publicTransportationPerson:"--",
            publicTransportationShareTitle:"公共交通分担率",
            publicTransportationAccCardTitle:"公共交通出行总量（刷卡乘次）",
            publicTransportationPersonTitle:"公共交通出行总量（刷卡人次）",
            mainTitle:"交通总体指标"
        }
    }
}
class OverViewPanalView extends BackboneView{ 
    template=`
    <div class='head'><div class="title-panel"><span class='title-with-underline'>{{mainTitle}}</span></div> </div>
    <content>
       <div class="index-panel">
           <div class="panel-title">{{publicTransportationShareTitle}}</div>
           <div class="panel-value">{{publicTransportationShare}}</div>
       </div>
       <div class="index-panel">
           <div class="panel-title">{{publicTransportationAccCardTitle}}</div>
           <div class="panel-value">{{publicTransportationAccCard}}</div>
       </div>
       <div class="index-panel">
           <div class="panel-title">{{publicTransportationPersonTitle}}</div>
           <div class="panel-value">{{publicTransportationPerson}}</div>
       </div>
    </content>
    `
    render(){
        this.$el.html(Mustache.render(this.template,this.model.toJSON()))
        return this
    }
}
export class OverViewPanal extends Controller {
    view:OverViewPanalView
    model:OverViewModel
    defaultConfig(){
        this.model=new OverViewModel
        return {model:this.model}
    }
    init(){
        this.view=new OverViewPanalView(this.config)
        this.view.addClass("overview-panal")
        this.model.on("change",this.view.render)
    }
}