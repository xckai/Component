import { checkIteratorCollection, curry, curry2, curry3 } from '../FP';
import _ = require('underscore');
import L = require('leaflet');
type coordinate=[number,number]
type geometry={
    type:string,
    coordinates:coordinate[]
}
type latlng={
    lat:number,
    lng:number
}
type properties={
    ID:string,
    NAME:string
}
export interface IFeatureCollection{
    type:string,
    features:Feature []
    properties:properties
}
let getProperty=function(paths:string,obj){
    let spliter="/"
    let path=paths.split("/")
    let r=obj
    for(let i=0;i<path.length;++i){
        if(_.has(r,path[i])){
              r=r[path[i]]
        }else{
            r=undefined
        }
    }
    return r
}
let comparer=curry(function(path:string,target:any,obj:any){
    return getProperty(path,obj)==target
})

let isFeature=comparer("type","Feature")
let isPoint =checkIteratorCollection(isFeature,comparer("geometry/type","Point"))
let isPolygon=checkIteratorCollection(isFeature,comparer("geometry/type","Polygon"))
let isPolyline=checkIteratorCollection(isFeature,comparer("geometry/type","LineString"))
function toLatlng(c:coordinate):latlng{
    return {
        lat:c[1],
        lng:c[0]
    }
}
export class Feature{
    type:string
    geometry:geometry
    properties:properties
    constructor(d){
        this.type=d.type
        this.geometry=d.geometry
        this.properties=d.properties
    }
    getCoordinates(){
       return getProperty("geometry/coordinates",this)
    }
    toGeoJSON(){
        return {
            type:this.type,
            geometry:this.geometry,
            properties:this.properties
        }
    }
}
export class Point extends Feature{
    type="Point"
    getCoordinates(){
       return getProperty("geometry/coordinates",this)
    }
    toLeafletMarker(options?){
        return L.marker(this.getleafletCoorinates(),options)
    }
    getleafletCoorinates(){
        let c=this.getCoordinates()
         return {
                  lat:c[1],
                  lng:c[0]
              }
    }
   
}
export class Polygon extends Feature{
    type="Polygon"
    getCoordinates(){
       return getProperty("geometry/coordinates/0",this)
    }
    getleafletCoorinates(){
      return _.map(this.getCoordinates(),(c:coordinate)=>{
              return {
                  lat:c[1],
                  lng:c[0]
              }
        })
    }
    toLeafletPolygon(options?){
        return L.polygon(this.getleafletCoorinates(),options)
    }
}
export class Polyline extends Feature{
    type="Polyline"
    getCoordinates(){
       return getProperty("geometry/coordinates",this)
    }
    getleafletCoorinates(){
      return _.map(this.getCoordinates(),(c:coordinate)=>{
              return {
                  lat:c[1],
                  lng:c[0]
              }
        })
    }
    toLeafletPolyline(options?){
        return L.polyline(this.getleafletCoorinates(),options)
    }
}
export class FeatureCollection implements IFeatureCollection{
    type:string
    features:Feature []
    properties:properties
    constructor(d:IFeatureCollection){
       this.type=d.type
       this.features=d.features
       this.properties=d.properties
    }
    getPoint(){
        return _.chain(this.features).filter(isPoint).map((f)=>new Point(f)).value()
    }
    getPolygon(){
        return _.chain(this.features).filter(isPolygon).map((f)=>new Polygon(f)).value()
    }
    getPolyline(){
          return _.chain(this.features).filter(isPolyline).map((f)=>new Polyline(f)).value()
    }
    getPointCollection(){
        return _.filter(this.features,isPoint)
    }
    getPolygonCollection(){
        return new FeatureCollection({type:this.type,properties:this.properties,features:_.filter(this.features,isPolygon)})
    }
    getPolylineCollection(){
        return _.filter(this.features,isPolyline)
    }
    toGeoJSON(){
        return {
            type:this.type,
            features:this.features,
            properties:this.properties
        }
    }
}