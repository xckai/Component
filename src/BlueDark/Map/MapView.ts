import { View } from "../../Jigsaw/View"
import _ =require("underscore")
import L=require("leaflet")

export class MapView extends View {
    constructor(conf?){
        super(conf)
        this.style({
            position: "absolute",
            left: "0px",
            right: "0px",
            top: "0px",
            bottom: "0px"
        })
    }
    mapSetting: IMapSetting
    leaflet: L.Map
    onAfterRender() {
        this.leaflet=L.map(this.el,{scrollWheelZoom:true})
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

