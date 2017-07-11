import {Component} from"../../../Jigsaw/Core/Component"
import { View } from "../../../Jigsaw/Core/View"
import { Model } from "../../../Jigsaw/Core/Model"
import { DropListView } from "../../../Jigsaw/Component/DropList/DropList"
import _=require("underscore")
import { Util } from "../../../Jigsaw/Utils/Util";
export class VicroadNavBar extends Component {
    constructor(conf?){
        super(Util.deepExtend({style:{
            bottom:null,
            height:"3rem"
        },class:"vicroadnavbar"},conf))
        this.dropSelector=new DropListView()
       
        this.dropSelector.appendAt(this.rootView.getNode$())
    }
    dropSelector:DropListView
    initDropDown(c){
         this.dropSelector.setDate(c)
    }
}
