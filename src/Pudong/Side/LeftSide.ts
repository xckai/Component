import {Component} from"../../Jigsaw/Component"
import {Model} from"../../Jigsaw/Model"
import { View } from "../../Jigsaw/View"
import {Util}from "../../Jigsaw/Util"
import _=require("underscore")
import {Side} from "../../BlueDark/Side/Side"
import {}from "smart_traffic_chart"
export class LeftSide extends Side{
    constructor(conf?){
        super(conf)
        this.kpiPanelView=new KpiPanelView()
        let kpi=new KpiModel()
        this.kpiPanelView.setModel(kpi)
        this.kpiPanelView.renderAt(this.getContentContainer())
        kpi.set({"title":"全城KPI",
                 regionValue:[{name:"Pudong",value:40}]})
        this.kpiPanelView.render()
    }
    kpiPanelView:KpiPanelView
}

class KpiPanelView extends View{
     constructor(conf?){
        super(_.extend({className:"KpiPanal"},conf))
    }
    model:KpiModel
    render(){
        this.$el.html(`
                        <section>
                            <header>${this.model.get("title")}</header>
                            <div class="content"> 
                                <div class='info'> </div>
                                <div class='ragions'> 
                                <table>
                                        ${_.map(this.model.get("regionValue"),function(n:any){
                                            return `<tr><td class='name'>${n.name}</td><td class='value'>${n.value}</td></tr>`
                                        }).join('')}
                                </table>
                                    </div>
                            </div >
                        </section>
                        `
                      )
        return this
    }
}
class KpiModel extends Model{
        title:string
        label:string
        value:string
        regionValue:any[]
}