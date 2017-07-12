import {Component} from"../../Core/Component"
import { View } from "../../Core/View"
import { Model } from "../../Core/Model"
import _=require("underscore")
import { Util } from "../../Utils/Util";
class TitleModel extends Model {
    constructor(conf?){
        super(conf)
    }
    title:string
}
class TitleView extends View{
    constructor(conf?){
        super(_.extend({className:"title",style:{
             position:"inherit",
             left:null,
             right:null,
             bottom:null,
             top:null
        }},conf))
        this.model=new TitleModel()
        this.listenTo(this.model,"all",this.render)
        //this.model.set("title","Title")
    }
    model:Model
    setTitle(s){
        this.model.set("title",s)
    }
    render(){
        this.$el.html(`<span>${this.model.get("title")}</span>`)
        return this
    }
}
export class NavBar extends Component{
    constructor(conf?){
        super(Util.deepExtend({
           style:{
                display:"flex",
                bottom:null,
                height:"3rem"

           }
        },conf))
        this.title=new TitleView()
        this.title.setTitle("Pudong Smart Traffic")
        this.title.appendAt(this.rootView.getNode$())
    }
     initRootView(conf){
         this.rootView=new View(_.extend({tagName:"section"},conf))
         this.rootView.addClass("navbar")
    }
    title:TitleView
}
