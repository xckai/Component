import {Component} from"../../Jigsaw/Component"
import { View } from "../../Jigsaw/View"
import { Model } from "../../Jigsaw/Model"
import _=require("underscore")
let htmlLooper=(ds:any[],template:string)=>{
    _.templateSettings= {
    interpolate: /\{(.+?)\}/g
    };
    let tmpl=_.template(template)
    return _.map(ds,(o)=>tmpl(o)).join("")
}
class DropModel extends Model{
    curValue:string
    items:string []
    defaults(){
        return {
            curValue:"None",
            items:[]
        }
    }
}
export class DropListView extends View{
    constructor(conf?){
        super({className:"droplist",tagName:"div"})    
        this.model=new DropModel()
        
        this.listenTo(this.model,"change:data",this.render)
    }
    template=_.template(`<div class="dropdown nav-dropdown fade in">
            <button class="btn btn-default" >
            <span class="value"> <%= curValue%></span>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu"  style="min-width: 8rem">
                <% _.each(items,function(item){ %>
                    <li><a href="#" ><%= item.value %></a></li>
                <% }) %>
            </ul>
        </div>`)
    model:DropModel
    render(){
        this.$el.html(this.template(this.model.toJSON()))
        return this
    }
    events(){
        return{
            "change select":"onChange"
        }
    }
    onChange(e:JQueryEventObject){
        console.log(e)
        this.model.set("curValue",this.$("select").val())
    }
    setData(ds){
        this.model.set("data",ds)
    }
}