import {Component} from"../../Jigsaw/Component"
import {Controller} from"../../Jigsaw/Controller"
import {MapController} from"./MapController"
import { View } from ".../../Jigsaw/View"
export class Map extends Component{
    constructor(conf?){
        super(conf)
        this.map=new MapController()
        this.view.render()
        this.map.renderAt(this.view.getNode$())
    }
    map:MapController
}
