/// <reference path="./Vendor/VicroadChart.d.ts" />
import { DragAblePanal } from '../../../Jigsaw/Component/Panal/DragAblePanal';
import * as moment from '../../../../vendor/moment/moment';
import { TimeAdjust } from 'CustomizedChart/Vicroad/VicroadChart';
export class TimeSlider extends DragAblePanal{
    constructor(conf?){
        super(conf)
        this.rootView.addClass("timeSlider")
        this.setStyle({height:"5rem",width:'30rem'})
        this.timeAdjuster=new TimeAdjust({style:{
            width:"30rem",height:"4.5rem"
        },padding:0})
        this.timeAdjuster.renderAt(this.rootView.getContentNode())
        this.hidden()
        this.on("simulation:begin-calculation",(d)=>{
            this.show()
            this.setTime(d.dateTime,d.duration)
            this.send("time-change",{dateTime:d.dateTime})
        })
        this.timeAdjuster.on("dragend",(o)=>{
            this.send("time-change",{dateTime:o.dateTime})
        })
        this.timeAdjuster.on("init",()=>{
            this.hidden()
        })
      
    }
    timeAdjuster:TimeAdjust
    show(){
        this.rootView.style({
            display:"initial"
        })
    }
    hidden(){
        this.rootView.style({
            display:"none"
        })
    }
    setTime(from:Date,duration:number){
        let fromTime=moment(from).format("YYYY-MM-DD HH:mm")
        let toTime=moment(from).add(duration,"h").format("YYYY-MM-DD HH:mm")
        this.timeAdjuster.setData({
              timeParse: "%Y-%m-%d %H:%M",
              rangeMin: fromTime,
              rangeMax: toTime,
              focusTime:fromTime,
        })
    }
}