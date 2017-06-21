import {Component} from"../../Jigsaw/Component"
import { View } from "../../Jigsaw/View"
import { Model } from "../../Jigsaw/Model"
import _=require("underscore")
class TitleModel extends Model{
    constructor(conf?){
        super(conf)
    }
    title:string
}
class TitleView extends View{
    constructor(conf?){
        super(_.extend({className:"title"},conf))
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
        super(conf)
        this.setConfig({
           style:{
                display:"flex",
                bottom:null,
                height:"3rem"

           },
           className:"navbar"
        })
        this.title=new TitleView()
        this.title.setTitle("Pudong Smart Traffic")
        this.title.renderAt(this.rootView.getNode$())
    }
    title:TitleView
}
