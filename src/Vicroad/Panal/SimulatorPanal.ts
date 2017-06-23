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
        this.simulatorView.on("adjuster-btn-click",()=>{
            this.send("adjuster-btn-click")
        })
        this.simulatorView.on("router-btn-click",()=>{
            this.send("router-btn-click")
        })
    }
   simulatorView:SimulatorView
   
}

class SimulatorView extends View{
    events(){
        return {
            "click .adjuster-btn":"onAdjuster",
            "click .router-btn":"onRouter"
        }
    }
    onAdjuster(){
       this.trigger("adjuster-btn-click")
    }
    onRouter(){
        this.trigger("router-btn-click")
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
    <button class="btn btn-default btn-disable">Apply</button>
</section>`)
        $(this.el).find('.datetimeinput').datepicker({
        timepicker: true,
        language: 'en'})
        return this
    }
}
class SimulatorModel extends Model{

}