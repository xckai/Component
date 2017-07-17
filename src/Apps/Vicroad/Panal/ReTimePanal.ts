/// <amd-dependency path="timepicker" />
///<reference path="./timepicker.d.ts" />
import { Side } from '../../../Jigsaw/Component/Side/Side';
import { View } from '../../../Jigsaw/Core/View';
import { Util } from '../../../Jigsaw/Utils/Util';

export class ReTimePanal extends Side{
    constructor(conf?){
         super(Util.deepExtend({style:{
                left:"0rem",
                top:"3.05rem",
                bottom:null,
                right:null,
           }},conf))
        this.rootView.render()
        this.reTimeView=new ReTimeView
        this.reTimeView.appendAt(this.getContentContainer())
        this.proxyEvents(this.reTimeView,"retime-apply")
        this.reTimeView.on("retime-apply",(d)=>{
            this.send("retime-apply",d)
            this.send("time-change",d)
        })
        // this.on("retime-router-drawing",()=>{
        //     this.reTimeView.setApplyButtonIsEnable(false)
        // })
        // this.on("retime-router-done",()=>{
        //     this.reTimeView.setApplyButtonIsEnable(true)
        // })
    }
    reTimeView:ReTimeView
}
class ReTimeView extends View{
    constructor(conf?){
        super(Util.deepExtend({style:{
            position:"initial"
        }},conf))
    }
    events(){
        return {
            "change .datetimeinput":"onTimeChange",
            "click  .applybtn":"onApply"
        }
    }
    onApply(){
         this.trigger("retime-apply",{dateTime:new Date(this.$(".datetimeinput").val()),duration:this.$(".durationinput").val()})
    }
   setApplyButtonIsEnable(isable){
        if(isable){
             this.$('.applybtn').removeClass('btn-disable')
        }else{
             this.$('.applybtn').addClass('btn-disable')              
        }
    }
    onTimeChange(){
         let oldValue,currentValue
         currentValue=this.$(".datetimeinput").val()
            if(oldValue==currentValue){
                return 
            }else{
                this.trigger("retime-timepicker-change",{dateTime:currentValue})
                oldValue=currentValue
            }
    }
    render(){
           this.$el.html(`<section>
                <label>Departure Time:</label>
                <input type="datetime" readonly="readonly" placeholder="Date Time" class='datetimeinput notreadonly'>
                <label>Simulation Duration:</label>
                        <input type="number" placeholder="Number of hours" value=2 readonly="readonly" class="durationinput"><span>Hour</span>  
                    </section>
                <section class="applypanal">
                    <button class="btn btn-default  applybtn">Apply</button>
                </section>`)
        return this
    }
    onAfterRender(){
        let datepicker =$(this.el).find('.datetimeinput').datepicker({
            timepicker: true,
            timeFormat: "hh:ii",
            onSelect: function(formattedDate, date:Date, inst) {
                    $(inst.el).trigger('change');
                    console.log(arguments)
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