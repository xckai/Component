import {Component} from"../../Core/Component"
import { View } from "../../Core/View"
import { Model } from "../../Core/Model"
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
        
        this.listenTo(this.model,"change",this.render)
    }
    template=_.template(`<div class="dropdown nav-dropdown fade in">
            <button class="btn btn-default" >
            <span class="value"> <%= curValue%></span>
                <i class="fa fa-caret-down"></i>
            </button>
            <ul class="dropdown-menu "  >
                <% _.each(items,function(item){ %>
                    <li><a href="#<%= item %>" ><%= item %></a></li>
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
            "click .btn": "onBtn",
            "click li":"onLi"
        }
    }
    onBtn(e:JQueryEventObject){

        this.$(".dropdown-menu").toggleClass("dropdown-show")
    }
    onLi(e:JQueryEventObject){
        console.log("li")
        this.model.set("curValue",$(e.target).text())
        this.$(".dropdown-menu").removeClass("dropdown-show")
    }
    setItems(ds){
        this.model.set("items",ds)
        if(!_.isEmpty(ds)){
            this.model.set("curValue",ds[0])
        }
    }
}