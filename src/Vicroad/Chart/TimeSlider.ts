/// <reference path="../../Chart/VicroadChart.d.ts" />
import { DragAblePanal } from '../../BlueDark/Panal/DragAblePanal';
import { Side } from '../../BlueDark/Side/Side';
import{TimeAdjust} from 'VicroadChart'
import _ = require('underscore');
export class TimeSlider extends DragAblePanal{
    constructor(conf?){
        super(conf)
        this.rootView.addClass("timeSlider")
        this.style({height:"5rem",width:'30rem'})
        this.timeAdjuster=new TimeAdjust("adjuster",{style:{
            width:"30rem",height:"5rem"
        },padding:0})
        this.timeAdjuster.renderAt(this.rootView.getContentNode())
    }
    timeAdjuster:TimeAdjust
}