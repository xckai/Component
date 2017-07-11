import { View } from '../../../Jigsaw/Core/View';
import * as moment from '../../../../vendor/moment/moment'
import _ = require('underscore');
import { Util } from "../../../Jigsaw/Utils/Util";
export class DatePanal extends View {
    constructor(conf?){
        super(Util.deepExtend({style:{bottom:null}},conf))
        this.setTime(new Date())
    }
    dataTime:{
        date:string
        hour:string|number
        minute:string|number

    }
    render(){
        this.$el.html(`<section>
                        <div class="date">${this.dataTime.date}</div>
                            <div class="time">
                                <span class="hour">${this.dataTime.hour}</span>
                                <span class="spliter">:</span>
                                <span class="min">${this.dataTime.minute}</span>
                            </div>
                        </section>`)
        return this
    }
    setTime(t:string|Date){
        let m=moment(t)
        this.dataTime={
            date:m.format('YYYY-MM-DD'),
            hour:m.format('HH'),
            minute:m.format("mm")
        }
        this.dataTime.date=m.format('YYYY-MM-DD')
        this.dataTime.hour=m.format('HH')
        this.dataTime.minute=m.format("mm")
        this.render()
        return this
    }
}