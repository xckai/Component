import {Component} from"../../Jigsaw/Component"
import { View } from "../../Jigsaw/View"
import { Model } from "../../Jigsaw/Model"
import { DropListView } from "../../BlueDark/DropList/DropList"
import _=require("underscore")
export class VicroadNavBar extends Component{
    constructor(conf?){
        super(conf)
        this.setConfig({
           style:{
                bottom:null,
                height:"3rem"

           },
           className:"vicroadnavbar"
        })
        this.dropSelector=new DropListView()
       
        this.dropSelector.renderAt(this.rootView.getNode$())
    }
    dropSelector:DropListView
    initDropDown(c){
         this.dropSelector.setDate(c)
    }
}
