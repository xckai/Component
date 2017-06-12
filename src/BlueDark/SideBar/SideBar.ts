import {Component} from"../../Jigsaw/Component"
import {Controller} from"../../Jigsaw/Controller"
import { View } from "../../Jigsaw/View"
import _=require("underscore")
class SideBarView extends View{
    title:string
    setTitle(s){
        this.title=s
        this.render()
    }
    render(){
        this.$el.html(`<span>${this.title}</span>`)
        return this
    }
}
class Content extends Controller{
    constructor(str?){
        super()
        this.view=new SideBarView()
        this.setConfig({
            class:["content"],
            style:{
            position:"absolute",
            left:"0px",
            right:null,
            top:null,
            bottom:null
        }
        })
        this.setTitle(str)
    }
    view:SideBarView
    setTitle(str){
        this.view.setTitle(str)
        return this
    }
}
export class SideBar extends Component{
    constructor(conf?){
        super(conf)
        this.setConfig({
           style:{
                display:"flex",
                bottom:null,
                height:"3rem"

           },
           class:["navbar"]
        })
        this.Content=new Content("Pudong Smart Traffic")
        this.title.renderAt(this.view.getNode$())
    }
    title:Title
}
