import { ValueTileView } from './../View/ValueTileView';
import { TileView } from './../View/TileView';
import { JView } from './../../../Jigsaw/Core/JView';
import { JController } from './../../../Jigsaw/Core/JController';
import Backbone =require("backbone")
import Mustache=require("mustache")
import _ = require("lodash")

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
class BusPanelView extends JView{ 
    template=`<div class='head'><div class="title-panel"><span class='title-with-underline'>{{mainTitle}}</span></div> </div>
             <content class='flex-container flex-row-center'></content>`
    render(){
        this.$el.html(Mustache.render(this.template,this.model.toJSON()))
        this.initTile()
        return this
    }
    initTile(){
        let todayCardAcc=new ValueTileView({class:"today-card-acc",
                                        appendAt:this.$(">content")
                                        ,title:"今日刷卡总量",value:10000})
        let yestodayCardAcc=new ValueTileView({class:"yestoday-card-acc",
                                            appendAt:this.$(">content")
                                            ,title:"昨日客运总量",value:30000})
        let busOperatingRate=new ValueTileView({class:"bus-operation-rate",
                                    appendAt:this.$(">content")
                                    ,title:"出车率",value:0.77})
    }
}
export class BusPanel extends JController {
    view:BusPanelView
    model:BusPanelModel
    defaultConfig(){
        this.model=new BusPanelModel
        return _.extend(super.defaultConfig(),{model:this.model})
    }
    initView(){
        this.view=new BusPanelView(this.config)
        this.view.addClass("bus-panal")
        this.model.on("change",this.view.render)
        this.view.render()
    }
    setActive(){
        this.view.addClass("active")
    }
}