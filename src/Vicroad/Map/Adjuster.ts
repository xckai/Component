import { Model } from "../../Jigsaw/Model"
import { View } from "../../Jigsaw/View"
import _ =require("underscore")
export class Adjuster extends View{
    constructor(conf?){
        super(conf)
    }
    events(){
       return{
            "click .operation .btn":"onBtn"
       }
    }
    onBtn(e){
        let i=$(e.currentTarget ).attr("index")
        this.roads[i].isOpen=!this.roads[i].isOpen
        this.render()
    }
    template=_.template(`<div class="adjuster">
                    <table>
                    <thead>
                        <tr>
                        <th>Road</th>
                        <th>Status</th>
                        <th>Operation</th>
                        </tr>
                    </thead>
                    <% _.each(roads,function(item,i){ %>
                        <tr class=" <%= item.class %>"><td class='name'><%= item.name %></td><td class='status'><%= item.status %></td><td class='operation'><button class='btn btn-default' index=<%= i %> ><span class='fa'></span></button></td></tr>
                    <% }) %>
                    </table>
                </div>`)
    render(){
        this.$el.html(this.template(this.preHandleData()))
        return this
    }
    preHandleData(){
      return{
          roads: _.map(this.roads,(dd:any)=>{
                let n:any={}
                n.name=dd.name;
                if(dd.isOpen){
                        n.status="Opened"
                        n.class="open"
                    }else{
                        n.status="Closed",
                        n.class="close"
                    }
                return n
            })
      }
    }
    roads:road[]
    setRoads(d){
        this.roads=d;
        this.render()
    }
}
interface road{
    name:string,
    isOpen:boolean
}
