import _ =require("underscore")
import L=require("leaflet")
import {PointDrawer}from '../../BlueDark/Map/MapDrawer'
export class RouterLayer {
    constructor(conf?){
        this.layer=L.layerGroup([])
        this.line=L.polyline([])
        this.layer.addLayer(this.line)
        this.initDrawer()
    }
    initDrawer(){
          this.drawer=new PointDrawer()
          this.drawer.on("drawing",(o)=>{
               this.line.setLatLngs(o.latlngs)
          })
          this.drawer.on("cancel",()=>{
              this.line.setLatLngs([])
          })
    }
    layer:L.LayerGroup
    paths:L.LatLng[]=[]
    line:L.Polyline
    leaflet:L.Map
    drawer:PointDrawer
    begin(){
       this.drawer.beginDraw()

    }
    cancel(){
        this.drawer.cancelDraw()
    }
    addLatLng(e:L.MouseEvent){
        this.paths.push(e.latlng)
        this.drawLine()
    }
    drawLine(){
        this.line.setLatLngs(this.paths)
    }
    addTo(map){
        this.layer.addTo(map)
        this.drawer.setMap(map)
        this.leaflet=map
    }
    remove(){
        this.drawer.cancelDraw()
        this.line=L.polyline([])
        this.layer.clearLayers()
        this.layer.remove()
    }
}