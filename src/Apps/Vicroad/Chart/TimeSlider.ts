/// <reference path="./Vendor/VicroadChart.d.ts" />
import { DragAblePanal } from '../../../Jigsaw/Component/Panal/DragAblePanal';
import moment=require("moment");
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
            this.setTime(moment(d.dateTime).add(15,"m").toDate(),d.duration)
            
        })
        this.on("retime-apply",(d)=>{
            this.setTime(d.dateTime,d.duration)
        })
        this.on("retime-router-done",()=>{
            this.show()
        })
        this.timeAdjuster.on("dragend",(o)=>{
            this.send("time-change",{dateTime:o.dateTime})
        })
        this.timeAdjuster.on("init",()=>{
            this.hidden()
        })
      
    }
    beginTime:Date
    duration:number
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
    reset(){
        this.setTime(this.beginTime,this.duration)
        return this
    }
    setTime(from:Date,duration:number){
        this.beginTime=from
        this.duration=duration
        let fromTime=moment(from).format("YYYY-MM-DD HH:mm")
        let toTime=moment(from).add(duration,"h").format("YYYY-MM-DD HH:mm")
        this.timeAdjuster.setData({
              timeParse: "%Y-%m-%d %H:%M",
              rangeMin: fromTime,
              rangeMax: toTime,
              focusTime:fromTime,
        })
        this.send("time-change",{dateTime:from})
    }
}