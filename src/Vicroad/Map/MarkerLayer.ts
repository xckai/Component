import _ =require("underscore")
import L=require("leaflet")
import {BaseLayer}from '../../BlueDark/Map/BaseLayer'
import {PointDrawer}from '../../BlueDark/Map/MapDrawer'
import {Adjuster} from "./Adjuster"
export class AdjustableLayer extends BaseLayer {
    constructor(conf?){
        super()
        this.layer=L.layerGroup([])
    }
    begin(){
        if(this.leaflet){
            this.leaflet.on("click",this.addOne,this)
        }
    }
    cancel(){
        if(this.leaflet){
            this.leaflet.off("click",this.addOne,this)
        }
    }
    addOne(e:L.MouseEvent){
        this.layer.addLayer(L.marker(e.latlng))
    }
    layer:L.LayerGroup
    leaflet:L.Map
    addTo(map){
        this.layer.addTo(map)
        this.leaflet=map
    }
    remove(){
        this.layer.clearLayers()
        this.leaflet.off("click",this.addOne,this)
        this.layer.remove()
    }
}
export class SingleMarkLayer {
    constructor(conf?){
        this.layer=L.layerGroup([])
    }
    begin(){
        if(this.leaflet){
            this.leaflet.on("click",this.onClick,this)
        }
    }
    cancel(){
        if(this.leaflet){
            this.leaflet.off("click",this.onClick,this)
        }
    }
    onClick(e:L.MouseEvent){
       if(this.marker){
           this.marker.setLatLng(e.latlng)
       }else{
           this.marker=L.marker(e.latlng)
           this.layer.addLayer(this.marker)
       }
    }
    layer:L.LayerGroup
    marker:L.Marker
    leaflet:L.Map
    addTo(map){
        this.layer.addTo(map)
        this.leaflet=map
    }
    remove(){
       
        if(this.marker){
             this.marker.remove()
               this.marker=null;
             
        }
      
        this.layer.clearLayers()
        this.leaflet.off("click",this.onClick,this)
        this.layer.remove()
    }
}
export class RoadAdjusterLayer{
    constructor(conf?){
       
        this.layer=L.layerGroup([])
        this.adjuster=new Adjuster()
    }
   
    begin(){
        if(this.leaflet){
            this.leaflet.on("click",this.onClick,this)
        }
    }
    end(){
        if(this.leaflet){
            this.leaflet.off("click",this.onClick,this)
        }
    }
    cancel(){
        if(this.leaflet){
            this.leaflet.off("click",this.onClick,this)
        }
    }
    onClick(e:L.MouseEvent){
       if(this.marker){
           this.marker.setLatLng(e.latlng)
       }else{
           this.marker=L.marker(e.latlng,{draggable:true})
           this.marker.bindPopup(this.adjuster.toHtml())
           this.adjuster.setRoads([{name:"road1",isOpen:false},{name:"road2",isOpen:false}])
           this.layer.addLayer(this.marker)
       }
       this.marker.openPopup()
       this.end()
    }
    adjuster:Adjuster
    layer:L.LayerGroup
    marker:L.Marker
    leaflet:L.Map
    addTo(map){
        this.layer.addTo(map)
        this.leaflet=map
    }
    remove(){
        if(this.marker){
            this.marker.remove()
            this.marker=null;
        }
        this.layer.clearLayers()
        this.leaflet.off("click",this.onClick,this)
        this.layer.remove()
    }
}