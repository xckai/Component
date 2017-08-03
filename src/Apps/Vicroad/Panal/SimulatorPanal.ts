/// <amd-dependency path="timepicker" />
///<reference path="./timepicker.d.ts" />
///<reference path="../Module.ts" />
import { Side } from '../../../Jigsaw/Component/Side/Side';
import { Component } from '../../../Jigsaw/Core/Component';
import { Model } from '../../../Jigsaw/Core/Model';
import { View } from '../../../Jigsaw/Core/View';
import { IRoad } from '../Map/Adjuster';
import{API}from "../APIConfig"
import _ = require('underscore');
import { Util } from "../../../Jigsaw/Utils/Util";
declare var EventBus: any
export class SimulatorPanal extends Side{
    constructor(conf?){
        super(Util.deepExtend({style:{
                left:"0rem",
                top:"3.05rem",
                bottom:null,
                right:null,
           }},conf))
        this.rootView.render()
        this.simulatorView=new SimulatorView()
        this.simulatorView.appendAt(this.getContentContainer())
        this.roads=[]
        this.initSimulatorView()
        this.applyButtonInit()
        this.simulatorView.on("simulator-apply",this.beginSimulator,this)
    }
    dateTime:Date
    duration:number=1
    roads:RoadPickerMessage[]
    addRoads(road:RoadPickerMessage){
       let i= _.findIndex(this.roads,{id:road.id})
       if(i==-1){
           this.roads.push(road)
       }else{
           this.roads[i]=road
       }
    }
   simulatorView:SimulatorView
   applyButtonInit(){
        let duration,road,from,to
        let isButtonEnable=()=>{
            if(this.dateTime!=undefined &&!_.isEmpty(this.roads)){
              this.simulatorView.setApplyButtonIsEnable(true)
            }else{
              this.simulatorView.setApplyButtonIsEnable(false)   
            }
        }
        this.on("simulate-timepicker-change",(e)=>{
            this.dateTime=new Date(e.dateTime)
            isButtonEnable()
        })
        this.on("simulate-duration-change",(e)=>{
            this.duration=e.duration
            isButtonEnable()
        })
        this.on("simulate-road-change",(e)=>{
            this.addRoads(e)
           // this.simulatorView.setAdjusterActive(false) 
            isButtonEnable()            
        })
        this.on("simulation_calculation_done",()=>{
            this.simulatorView.setRouterEnable(true)
        })  
   }
   beginSimulator(){
    //    var postDate={
    //        controls:,
    //        from:this.dateTime.toUTCString()
    //    }
       let controls=_.map(this.roads,(r)=>{
               return {id:r.id,kj:r.capacity,f:r.capacity,duration:"360m"}
           })
     
       let enableEventBus=()=>{
            let self=this
            var eb = new EventBus('/eventbus');
            eb.onopen = function() {
                console.log('open');
                eb.registerHandler("client.CTMProgress", function(err, msg){
                    console.log('received  '+msg.body);
                    self.send("simulation_calculation_progress",{value:msg.body})
                });
                eb.registerHandler("client.CTMComplete",function(){
                    console.log("Calculation done")
                    self.send("simulation_calculation_done")
                    eb.onclose = function (e) {};
                    eb.close()
                })
                };
            eb.onclose = function (e) {
                console.log('reconnecting');
                setTimeout(enableEventBus, 1000); // Give the server some time to come back
            };
       }
      
    API.beginSimulation(controls,this.dateTime).done(()=>{
            this.send("simulation_begin_calculation",{dateTime:this.dateTime,duration:this.duration})
            enableEventBus()
        })
   }
   initSimulatorView(){
       this.proxyEvents(this.simulatorView,"adjuster-btn-off",
                                                "adjuster-btn-on",
                                                "simulate-router-btn-off",
                                                "simulate-router-btn-on",
                                                "simulate-timepicker-change",
                                                "simulate-duration-change",
                                                )
   }
   
}

class SimulatorView extends View{
    constructor(conf?){
        super(Util.deepExtend({style:{
            position:"initial"
        }},conf))
    }
    events(){
        return {
            "click .adjuster-btn":"onAdjuster",
            "click .router-btn":"onRouter",
            "change .datetimeinput":"onSimulateTimeChange",
            "change .durationinput":"onDurationTimeChange",
            "click  .applybtn":"onApply"
        }
    }
    setApplyButtonIsEnable(isable){
        if(isable){
             this.$('.applybtn').removeClass('btn-disable')
        }else{
             this.$('.applybtn').addClass('btn-disable')              
        }
    }
    onApply(){
        this.trigger("simulator-apply",{dateTime:new Date(this.$(".datetimeinput").val()),duration:this.$(".durationinput").val()})
        this.setAdjusterEnable(false)
        this.setApplyButtonIsEnable(false)
        this.$(".datetimeinput").off("focus")
        
        
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
    setAdjusterActive(b:boolean){
         if(b){
            $(".operation").removeClass("btn-active")
            this.$(".adjuster-btn").addClass("btn-active")
            this.trigger("adjuster-btn-on")
        }else{
            this.trigger("adjuster-btn-off")
            this.$(".adjuster-btn").removeClass("btn-active")
        }
    }
    setAdjusterEnable(b:boolean){
        if(b){
             this.$('.adjuster-btn').removeClass('btn-disable')
        }else{
             this.$('.adjuster-btn').addClass('btn-disable')              
        }
    }
    setRouterEnable(isable){
        if(isable){
             this.$('.router-btn').removeClass('btn-disable')
        }else{
             this.$('.applybtn').addClass('btn-disable')              
        }
    }
    onRouter(e:JQueryMouseEventObject){
        if($(e.currentTarget).hasClass("btn-active")){
            this.trigger("simulate-router-btn-off")
            $(e.currentTarget).removeClass("btn-active")

        }else{
            $(".operation").removeClass("btn-active")
            $(e.currentTarget).addClass("btn-active")
            this.trigger("simulate-router-btn-on")
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
            <input type="datetime" readonly="readonly" placeholder="Date Time" class='datetimeinput notreadonly'>
            <label>Simulation Duration:</label>
            <input type="number" placeholder="Number of hours" value=1 readonly="readonly" class="durationinput"><span>Hour</span>  
        </section>
        <section>
            <button class="btn btn-default operation adjuster-btn fa fa-times"></button>
            <button class="btn btn-default operation btn-disable router-btn  fa fa-car"></button>
        </section>
        <section class="applypanal">
            <button class="btn btn-default btn-disable applybtn">Apply</button>
        </section>`)
 
        return this
    }
    onAfterRender(){
        let datepicker =$(this.el).find('.datetimeinput').datepicker({
            timepicker: true,
            timeFormat: "hh:ii",
            onSelect: function(formattedDate, date:Date, inst) {
                    $(inst.el).trigger('change');
                  
                    let newDate=new Date(date.toUTCString())
                    newDate.setMinutes(Math.floor(date.getMinutes()/15)*15)
                    if(newDate.toTimeString()!=date.toTimeString()){
                        inst.selectDate(newDate)
                    }
                },
        language: 'en'}).data('datepicker')
            
        setTimeout(()=>{
            datepicker.selectDate(new Date())
        },0)
    }
}
class SimulatorModel extends Model{

}