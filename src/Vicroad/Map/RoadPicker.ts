import { Evented } from '../../Jigsaw/Evented'
import _=require("underscore")
import L=require("leaflet")
export class RoadPicker extends Evented{
    baseUrl:string
    oldLatlng:any
    latlng:Object
    marker:L.Marker
    path:L.Polygon
    paths:any[]
    setLatlng(latlng){
        this.oldLatlng=latlng
        this.fetch()
    }
    fetch(){
        this.fire("fetching")
        $.get(this.baseUrl+`lng=${this.oldLatlng.lng}&lat=${this.oldLatlng.lat}`)
        .done((d)=>{
            this.fire("done",d)
            
        })
        .fail((d)=>{
            this.fire("erroe")
        })
    }
}