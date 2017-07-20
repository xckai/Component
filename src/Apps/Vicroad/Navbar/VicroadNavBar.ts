import { DropListView } from "../../../Jigsaw/Component/DropList/DropList"
import _=require("underscore")
import { Util } from "../../../Jigsaw/Utils/Util";
import {NavBar} from "../../../Jigsaw/Component/Bar/NavBar"
export class VicroadNavBar extends NavBar {
    constructor(conf?){
        super(Util.deepExtend({style:{
            bottom:null,
            height:"3rem"
        }},conf))
        this.addClass("vicroadnavbar")
        this.dropSelector=new DropListView()
         this.title.setTitle("Intelligent Traffic Management - Simulation")
        this.dropSelector.appendAt(this.rootView.getNode$())
    }
    
    dropSelector:DropListView
    initDropDown(c){
         this.dropSelector.setDate(c)
    }
}

