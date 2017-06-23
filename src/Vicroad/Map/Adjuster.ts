import { Model } from "../../Jigsaw/Model"
import { View } from "../../Jigsaw/View"
import _ =require("underscore")
export class Adjuster extends View{
    constructor(conf?){
        super(conf)
        this.style({position:"relative"})
        this.model=new RoadAdjusterModel()
        this.model.on("change:latlng",this.model.getDetail,this.model)
        this.model.on("change:roads",this.render,this)
        this.model.on("fetching",()=>{
            this.setBusy(true)
        })
    }
    model:RoadAdjusterModel
    events(){
       return{
            "click .operation .btn":"onBtn"
       }
    }
    onBtn(e){
        let i=$(e.currentTarget ).attr("index")
        let roads=this.model.get("roads")
        roads[i].isOpen=!roads[i].isOpen
        this.model.set("roads",roads)
        this.render()
    }
    setLatlng(latlng){
        this.model.set("latlng",latlng)
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
        this.setBusy(false)
        this.$el.html(this.template(this.getRenderData()))
        return this
    }
    getRenderData(){
        let n= _.pick(this.model.toJSON(),"roads")
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
    roads:road[]
    setRoads(d){
        this.roads=d;
        this.render()
    }
}
class RoadAdjusterModel extends Model{
    defaults(){
        return{
            latlng:{lat:0,lng:0},
            roads:[]
        }
    }
    getDetail(){
         this.set("roads",[])
        this.trigger("fetching")
        setTimeout(()=>{
              this.set("roads",[{name:"road1",status:"opened",isOpen:true,class:"open"},
                            {name:"road2",status:"opened",isOpen:true,class:"open"},
                            {name:"road3",isOpen:false,status:"closed",class:"close"}])
        },1000)
    }
}
interface road{
    name:string,
    isOpen:boolean
}
