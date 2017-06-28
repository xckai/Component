import {Component ,IComponentConfig} from"../../Jigsaw/Component"
import { View } from "../../Jigsaw/View"
import _=require("underscore")
import L=require("leaflet")
export class Map extends Component{
    constructor(conf?){
        super(conf)
        this.map=new MapView(this.config)
        this.rootView.render()
        this.map.appendAt(this.rootView.getNode$())
    }
    defaultConfig(){
        return {
                                className:"",
                                el:null,
                                $el:null,
                                class:"map",
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
    }
    config:IMapConfig
    map:MapView
}
interface IMapConfig extends IComponentConfig{
            className:string ,
            el:any,
            $el:any,
            class:string,
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
        this.leaflet=L.map(this.el,_.extend({scrollWheelZoom:true},this.config.map))
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

