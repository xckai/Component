import {Component ,IControllerConfig} from"../../Jigsaw/Component"
import {MapView} from"./MapView"
import { View } from "../../Jigsaw/View"
import _=require("underscore")
export class Map extends Component{
    constructor(conf?){
        super(_.extend({className:"map"},conf))
        this.setConfig(conf)
        this.map=new MapView(this.config)
        this.rootView.render()
        this.map.renderAt(this.rootView.getNode$())
    }
    config:IMapConfig={
                                className:"",
                                style:{
                                    position:"absolute",
                                    left:"0px",
                                    right:"0px",
                                    top:"0px",
                                    bottom:"0px",
                                    width:null,
                                    height:null
                                },
                                map:{
                                    zoomControl:true
                                }
                        }
    map:MapView
}
interface IMapConfig extends IControllerConfig{
            className:string ,
            style:{
                    position:string | null |undefined,
                    left:string | null |undefined,
                    right:string | null |undefined,
                    top:string | null |undefined,
                    bottom:string | null |undefined,
                    width:string | null |undefined,
                    height:string | null |undefined
            }
            map:{
                zoomControl:boolean
            }
}