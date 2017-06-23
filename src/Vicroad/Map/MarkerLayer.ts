import _ = require('underscore');
import L=require("leaflet")
import { BaseLayer } from '../../BlueDark/Map/BaseLayer';
import { PointDrawer } from '../../BlueDark/Map/MapDrawer';
import { FeatureCollection } from '../../Jigsaw/map/GeoJSON';
import { Adjuster } from './Adjuster';
import { RoadPicker } from './RoadPicker';
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
        this.picker=new RoadPicker()
        this.picker.baseUrl='/service/apps/itm/maps/itm/query/point2edge.json?'
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
    end(){
        if(this.leaflet){
            this.leaflet.off("click",this.onClick,this)
        }
    }
    onClick(e:L.MouseEvent){
       this.picker.setLatlng(e.latlng)
       this.picker.on("done",(d)=>{
           let f=new FeatureCollection(d)
           let m=_.first(f.getPoint())
           let p=_.first(f.getPolyline())
           if(m){
                if(this.marker){
                    this.marker.remove()
                }
                this.marker=m.toLeafletMarker()
                this.layer.addLayer(this.marker)
               
           }
           if(p){
                if(this.road){
                    this.road.remove()
                }
                this.road=p.toLeafletPolyline()
                this.layer.addLayer(this.road)
           }
       })
    }
    layer:L.LayerGroup
    marker:L.Marker
    road:L.Polyline
    picker:RoadPicker
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
           this.marker=L.marker(e.latlng)
           
       }
      this.marker.bindPopup(this.adjuster.getNode())
      this.adjuster.doRender()
      this.adjuster.setLatlng(e.latlng)
       this.layer.addLayer(this.marker)
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