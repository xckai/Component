///<reference path="../Module.ts" />
import { Model } from "../../../Jigsaw/Core/Model"
import { View } from "../../../Jigsaw/Core/View"
import _ =require("lodash")
export interface IRoad{
    id:string,
    name:string,
    roads:{name:string,isOpen:boolean}[]
}
export class Adjuster extends View{
    constructor(conf?){
        super(conf)
        this.style({position:"relative"})
    }
    events(){
       return{
            "click .operation .btn":"onBtn"
       }
    }
    disable(){
        this.$("button").addClass("btn-disable")
    }
    enable(){
        this.$("button").removeClass("btn-disable")
    }
    onBtn(e){
        let i=$(e.currentTarget ).attr("index")
        let roads=this.data.roads
        roads[i].isOpen=!roads[i].isOpen
        let m:RoadPickerMessage={
                                    id:this.data.id,
                                    name:this.data.name,
                                    capacity:_.filter(roads,(r)=>r.isOpen).length/roads.length}
        this.trigger("simulate-road-change",m)
        this.render()
    }
    template=_.template(`<div class="adjuster">
                    <header><%= name %></header>
                    <table>
                    <thead>
                        <tr>
                        <th>Road</th>
                      
                        <th>Status</th>
                        </tr>
                    </thead>
                    <% _.each(roads,function(item,i){ %>
                        <tr class=" <%= item.class %>"><td class='name' nowrap><%= item.name %></td><td class='operation'><button class='btn btn-default' index=<%= i %> ><span class='fa'></span></button></td></tr>
                    <% }) %>
                    </table>
                </div>`)
    render(){
        this.setBusy(false)
        this.$el.html(this.template(this.getRenderData()))
        return this
    }
    getRenderData(){
        let n= this.data
        n.roads=_.map(n.roads,(dd:any)=>{
                        let n:any={}
                        n.name=dd.name
                        if(dd.isOpen){
                               
                                n.class="close"
                            }else{
                            
                                n.class="open"
                            }
                        return n
                    })
      return n
    }
    data:IRoad
    setData(d){
        this.data=d
        this.render()
    }
}
interface road{
    name:string,
    isOpen:boolean
}
