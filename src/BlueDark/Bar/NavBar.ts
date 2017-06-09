import {Component} from"../../Jigsaw/Component"
import {Controller} from"../../Jigsaw/Controller"
import { View } from "../../Jigsaw/View"
import _=require("underscore")
class TitleView extends View{
    title:string
    setTitle(s){
        this.title=s
        this.render()
    }
    render(){
        this.$el.html(`<p>${this.title}</p>`)
        return this
    }
}
class Title extends Controller{
    constructor(str?){
        super()
        this.view=new TitleView()
        this.setConfig({
            position:"static",
            left:null,
            right:null,
            top:null,
            bottom:null
        })
        this.setTitle(str)
    }
    view:TitleView
    setTitle(str){
        this.view.setTitle(str)
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
           class:["NavBar"]
        })
        this.title=new Title("Pudong Smart Traffic")
        this.title.renderAt(this.view.getNode$())
    }
    title:Title
}
