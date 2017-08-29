import { Weather } from './Weather';
import { HBox } from './../../../Controller/HBox';
import { DateTime } from './DateTime';
import { JView } from './../../../Jigsaw/Core/JView';
import { JController } from './../../../Jigsaw/Core/JController';
import Backbone =require("backbone")
import Mustache=require("mustache")
import _ = require("lodash")

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
class OverViewPanalView extends JView{ 
    template=`
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
export class OverViewPanal extends JController {
        init(){
            this.view.addClass("overview-panal")
            this.dateTime=new DateTime()
            this.weather=new Weather()
            let dateTimeWeatherContainer=new HBox({left:'3rem',top:'4rem',position:'absolute',content:[this.dateTime,this.weather]},this)

         
        }
        dateTime:DateTime
        weather:Weather
}