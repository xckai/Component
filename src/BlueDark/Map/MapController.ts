import { Controller } from "../../Jigsaw/Controller"
import { View } from "../../Jigsaw/View"
import _ =require("underscore")
import L=require("leaflet")
class MapView extends View {
    render() {
        this.mapNode$ = $("<div></div>").css({
            position: "absolute",
            left: "0px",
            right: "0px",
            top: "0px",
            bottom: "0px",
        }).appendTo(this.$el)
        return this
    }
    getMapNode() {
        return this.mapNode$.get(0)
    }
    mapNode$: JQuery
}
export class MapController extends Controller {
    constructor(conf?){
        super(conf)
        this.view=new View({el:"<div></div>"})
        this.updataConfig()
    }
    view:View
    mapSetting: IMapSetting
    leaflet: L.Map
    onAfterRender() {
        this.leaflet=L.map(this.view.el,{scrollWheelZoom:true})
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

