import {Component} from"../Core/Component"
import {Controller} from"../Core/Controller"
import {MapController} from"./MapController"
import { View } from "../Core/View"
export class Map extends Component{
    constructor(conf?){
        super(conf)
        this.map=new MapController()
        this.view.render()
        this.map.renderAt(this.view.getNode$())
    }
    map:MapController
}
