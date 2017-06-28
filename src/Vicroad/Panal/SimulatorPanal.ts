/// <amd-dependency path="timepicker" />
///<reference path="./timepicker.d.ts" />
import {Side} from "../../BlueDark/Side/Side"
import {Component} from"../../Jigsaw/Component"
import { View } from "../../Jigsaw/View"
import { Model } from "../../Jigsaw/Model"

export class SimulatorPanal extends Side{
    constructor(conf?){
        super(conf)
        this.setConfig({
           style:{
                left:"0rem",
                top:"3.05rem",
                bottom:null,
                right:null,
           }
        })
        this.rootView.render()
        this.simulatorView=new SimulatorView()
        this.simulatorView.appendAt(this.rootView.getNode$())
       this.initSimulatorView()
       this.applyButtonInit()
    }
   simulatorView:SimulatorView
   applyButtonInit(){
        let dateTime,duration,road,from,to
        let isButtonEnable=()=>{
            if(dateTime!=undefined &&duration!=undefined&&road!=undefined){
              this.simulatorView.setApplyButtonIsEnable(true)
            }else{
              this.simulatorView.setApplyButtonIsEnable(false)   
            }
        }
        this.on("simulate-timepicker-change",(e)=>{
            dateTime=e.dateTime
            isButtonEnable()
        })
        this.on("simulate-duration-change",(e)=>{
            duration=e.duration
            isButtonEnable()
        })
        this.on("simulate-road-change",(e)=>{
            road={}
            road.capacity=e.disableNumber/e.roadNumber
            road.id=e.id
            isButtonEnable()            
        })     
   }
   initSimulatorView(){
       this.proxyEvents(this.simulatorView,"adjuster-btn-off",
                                                "adjuster-btn-on",
                                                "router-btn-off",
                                                "router-btn-on",
                                                "simulate-timepicker-change",
                                                "simulate-duration-change")
   }
   
}

class SimulatorView extends View{
    events(){
        return {
            "click .adjuster-btn":"onAdjuster",
            "click .router-btn":"onRouter",
            "change .datetimeinput":"onSimulateTimeChange",
            "change .durationinput":"onDurationTimeChange"
        }
    }
    setApplyButtonIsEnable(isable){
        if(isable){
             this.$('.applybtn').removeClass('btn-disable')
        }else{
             this.$('.applybtn').addClass('btn-disable')              
        }
    }
    onAdjuster(e:JQueryMouseEventObject){
        if($(e.currentTarget).hasClass("btn-active")){
            this.trigger("adjuster-btn-off")
            $(e.currentTarget).removeClass("btn-active")

        }else{
            $(".operation").removeClass("btn-active")
            $(e.currentTarget).addClass("btn-active")
            this.trigger("adjuster-btn-on")
        }
       
    }
    onRouter(e:JQueryMouseEventObject){
        if($(e.currentTarget).hasClass("btn-active")){
            this.trigger("router-btn-off")
            $(e.currentTarget).removeClass("btn-active")

        }else{
            $(".operation").removeClass("btn-active")
            $(e.currentTarget).addClass("btn-active")
            this.trigger("router-btn-on")
        }
    }
    onSimulateTimeChange(){
        let oldValue,currentValue
        currentValue=this.$(".datetimeinput").val()
        if(oldValue==currentValue){
            return 
        }else{
            this.trigger("simulate-timepicker-change",{dateTime:currentValue})
            oldValue=currentValue
        }
    }
    onDurationTimeChange(){
        let oldValue,currentValue
        currentValue=this.$(".durationinput").val()
        if(oldValue==currentValue){
            return 
        }else{
            this.trigger("simulate-duration-change",{duration:currentValue})
            oldValue=currentValue
        }
    }
    render(){
        this.$el.html(`<section>
            <label>Simulation DateTime:</label>
            <input type="datetime" placeholder="Date Time" class='datetimeinput'>
            <label>Simulation Duration:</label>
            <input type="number" placeholder="Number of hours" class="durationinput"><span>Hour</span>  
        </section>
        <section>
            <button class="btn btn-default operation adjuster-btn fa fa-times"></button>
            <button class="btn btn-default operation router-btn  fa fa-car"></button>
        </section>
        <section class="applypanal">
            <button class="btn btn-default btn-disable applybtn">Apply</button>
        </section>`)
        $(this.el).find('.datetimeinput').datepicker({
        timepicker: true,
            onSelect: function(formattedDate, date, inst) {
                    $(inst.el).trigger('change');
                },
        language: 'en'})
        return this
    }
}
class SimulatorModel extends Model{

}