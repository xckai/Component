import { Model } from "../../Jigsaw/Model"
import { View } from "../../Jigsaw/View"
import _ =require("underscore")
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
    onBtn(e){
        let i=$(e.currentTarget ).attr("index")
        let roads=this.data.roads
        roads[i].isOpen=!roads[i].isOpen
        this.trigger("simulate-road-change",this.data)
        this.render()
    }
    template=_.template(`<div class="adjuster">
                    <header><%= name %></header>
                    <table>
                    <thead>
                        <tr>
                        <th>Road</th>
                        <th>Status</th>
                        <th>Operation</th>
                        </tr>
                    </thead>
                    <% _.each(roads,function(item,i){ %>
                        <tr class=" <%= item.class %>"><td class='name' nowrap><%= item.name %></td><td class='status'><%= item.status %></td><td class='operation'><button class='btn btn-default' index=<%= i %> ><span class='fa'></span></button></td></tr>
                    <% }) %>
                    </table>
                </div>`)
    render(){
        this.setBusy(false)
        this.$el.html(this.template(this.getRenderData()))
        return this
    }
    getRenderData(){
        let n= _.pick(this.data,"roads","name","id")
        n.roads=_.map(n.roads,(dd:any)=>{
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
      return n
    }
    data:any
    setData(d){
        this.data=d
        this.render()
    }
    setRoadNumber(n){
        let roads=[]
        for(let i=0;i<n;++i){
            roads.push({name:`Lane-${i+1}`,isOpen:true})
        }
       this.setData({roads:roads})
    }
}
interface road{
    name:string,
    isOpen:boolean
}
