import {Component} from"../../Jigsaw/Component"
import {MapView} from"./MapView"
import { View } from "../../Jigsaw/View"
export class Map extends Component{
    constructor(conf?){
        super(conf)
        this.map=new MapView()
        this.rootView.render()
        this.map.renderAt(this.rootView.getNode$())
    }
    map:MapView
}
