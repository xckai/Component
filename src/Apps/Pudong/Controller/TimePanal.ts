import { JView } from './../../../Jigsaw/Core/JView';
import { JController, IJControllerConfig } from './../../../Jigsaw/Core/JController';
import moment =require("moment")
import Mustache=require("mustache")
class dateTimeView extends JView{ 
    template='<div class="time">{{timeHour}}<span>:</span>{{timeMinute}}</div><div class="date">{{date}}</div>'
    render(){
        this.$el.html(Mustache.render(this.template,{timeHour:moment(this.dateTime).format("HH"),timeMinute:moment(this.dateTime).format("mm"),date:moment(this.dateTime).format("YYYY年MM月DD日")}))
        return this
    }
    dateTime:Date

}
export class TimePanal extends JController {
    view:dateTimeView
    initView(){
        this.view=new dateTimeView(this.config)
        this.view.addClass("data-time-container")
        this.view.dateTime
        this.view.render()
    }
    setTime(t:Date){
        this.view.dateTime=t
        this.view.render()
        return this
    }
}