import {Component ,IControllerConfig} from"../../Jigsaw/Component"
import { View } from "../../Jigsaw/View"
import _=require("underscore")
import L=require("leaflet")
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


export class MapView extends View {
    constructor(conf?){
        super(conf)
        this.setConfig(conf)
        this.style({
            position: "absolute",
            left: "0px",
            right: "0px",
            top: "0px",
            bottom: "0px"
        })
    }
    config:any
    setConfig(c){
        this.config=_.extend({},this.config,c)
    }
    mapSetting: IMapSetting
    leaflet: L.Map
    onAfterRender() {
        this.leaflet=L.map(this.el,_.extend({scrollWheelZoom:true},_.pick(this.config,"zoomControl")))
    }
    setMapSetting(s){
        if(this.mapSetting){
               this.mapSetting=_.extend(this.mapSetting,s)
        }else{
               this.mapSetting=_.extend({},s)
        }
        this.leaflet.setView(this.mapSetting.center, this.mapSetting.zoom);
       let l= L.tileLayer(this.mapSetting.baseLayer.mapUrl, {
                        maxZoom: this.mapSetting.baseLayer.maxZoom
                    })
        l.addTo(this.leaflet)
        return this
    }
}
export interface IMapSetting {
    center: { lat: number, lng: number },
    zoom: number,
    baseLayer: {
        mapUrl: string,
        maxZoom: number
    }
}

