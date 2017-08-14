import { Controller } from "../../../Jigsaw/Core/Controller";
import { BackboneView } from "../../..//Jigsaw/Core/View";
import Backbone =require("backbone")
import Mustache=require("mustache")

class BusPanelModel extends Backbone.Model{
    defaults(){
        return {
            mainTitle:"公交车指标",
            todayCardAcc:"--",
            yestodayCardAcc:"--",
            busOperatingRate:"--",
            busFastThanDriveRate:"--",
            yestodayOnTimeRate:"--",
            busSpeed:"--",
            todayCardAccTitle:"今日刷卡总量",
            yestodayCardAccTitle:"昨日客运总量",
            busOperatingRateTitle:"出车率",
            busFastThanDriveRateTitle:"公交快于驾车比例",
            yestodayOnTimeRateTitle:"昨日首末班次准点率",
            busSpeedTitle:"公交车平均速度"
        }
    }
}
class BusPanelView extends BackboneView{ 
    template=`
            <div class='head'><div class="title-panel"><span class='title-with-underline'>{{mainTitle}}</span></div> </div>
    <content class='flex-container flex-row-center'>
       <div class="tile row-1 col-1 flex-item">
           <div class="tile-title">{{todayCardAccTitle}}</div>
           <div class="tile-value">{{todayCardAcc}}</div>
       </div>
       <div class="tile row-1 col-1 flex-item">
           <div class="tile-title">{{yestodayCardAccTitle}}</div>
           <div class="tile-value">{{yestodayCardAcc}}</div>
       </div>
       <div class="tile row-1 col-1 flex-item">
           <div class="tile-title">{{busOperatingRateTitle}}</div>
           <div class="tile-value">{{busOperatingRate}}</div>
       </div>
       <div class="tile row-1 col-1 flex-item">
           <div class="tile-title">{{busFastThanDriveRateTitle}}</div>
           <div class="tile-value">{{busFastThanDriveRate}}</div>
       </div>
       <div class="tile row-1 col-1 flex-item">
           <div class="tile-title">{{yestodayOnTimeRateTitle}}</div>
           <div class="tile-value">{{yestodayOnTimeRate}}</div>
       </div>
       <div class="tile row-1 col-1 flex-item">
           <div class="tile-title">{{busSpeedTitle}}</div>
           <div class="tile-value">{{busSpeed}}</div>
       </div>
    </content>
    `
    render(){
        this.$el.html(Mustache.render(this.template,this.model.toJSON()))
        return this
    }
}
export class BusPanel extends Controller {
    view:BusPanelView
    model:BusPanelModel
    defaultConfig(){
        this.model=new BusPanelModel
        return {model:this.model}
    }
    init(){
        this.view=new BusPanelView(this.config)
        this.view.addClass("bus-panal")
        this.model.on("change",this.view.render)
    }
    setActive(){
        this.view.addClass("active")
    }
}