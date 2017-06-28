import _ = require('underscore');
import { Map } from '../../BlueDark/Map/Map';
import { FeatureCollection } from '../../BlueDark/map/GeoJSON';
import {BaseDrawer,PointDrawer}from '../../BlueDark/Map/MapDrawer'
import L=require('leaflet')
import { Adjuster } from './Adjuster';
import {DatePanal}from "./DatePanal"
class RouterPicker extends PointDrawer{
    onClick(e:L.MouseEvent){
        if(this.latlngs && this.latlngs.length>0){
            this.latlngs.push(e.latlng);
            this.fire("to",{latlngs:this.latlngs});
            this.endDraw()
        }else{
            this.latlngs=[];
            this.latlngs.push(e.latlng);
            this.fire("from",{latlngs:this.latlngs});
        }
    }
}
class RoadPicker extends BaseDrawer{
    baseUrl:string
    oldLatlng:any
    latlng:any
    marker:L.Marker
    path:L.Polyline
    begin(){
       if(this.interactiveLayer){
            this.interactiveLayer.on("click",this.onclick,this)
       }
    }
    end(){
        if(this.interactiveLayer){
            this.interactiveLayer.off("click",this.onclick,this)
        }
    }
    cancel(){
        if(this.interactiveLayer){
            this.interactiveLayer.off("click",this.onclick,this)
        }
    }
    private onclick(e:L.MouseEvent){
        this.drawing=true
        this.fire("drawing",e)
        this.oldLatlng=e.latlng
        this.fetch()
    }
    fetch(){
        this.fire("fetching")
        $.get(this.baseUrl+`lng=${this.oldLatlng.lng}&lat=${this.oldLatlng.lat}`)
        .done((d)=>{
            let f=new FeatureCollection(d)
            if(_.isEmpty(f.getPoint())||_.isEmpty(f.getPolyline())){
                this.fire("fail")
            }else{
                this.fire("drawend",{
                    point:_.first(f.getPoint()).getleafletCoorinates(),
                    path:_.first(f.getPolyline()).getleafletCoorinates(),
                    roadNum:_.first(f.getPolyline()).getProperty("properties/AVGLANES"),
                    name:_.first(f.getPolyline()).getProperty("properties/NAME"),
                    id:_.first(f.getPolyline()).getProperty("properties/ID"),
                })
            }
           
        })
        .fail((d)=>{
            this.fire("fail",null)
        })
    }
}

export class VicroadMap extends Map{
    constructor(conf?){
        super(conf)
        this.init()
    }
    defaultConfig(){
        return {
                    className:"",
                    class:"map",
                    el:null,
                    $el:null,
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
                                    zoomControl:false
                                }
                        }
    }
    roadPicker:RoadPicker
    adjuster:Adjuster
    routerPicker:RouterPicker
    datePanal:DatePanal
    adjusterRoadMarker:L.Marker
    adjusterRoadPath:L.Polyline
    init(){
        this.datePanal=new DatePanal({className:"datapanal"})
        this.datePanal.appendAt(this.rootView.$el)
        this.datePanal.style({
            "z-index":2000,
            position:"absolute",
            width:"100%"
        })
        this.on("adjuster-btn-on",this.doSelectAdjuster,this)
        this.on("adjuster-btn-off router-btn-off",this.doRoadPick,this)
        this.on("router-btn-on",this.doRouter,this)
        this.roadPicker=new RoadPicker()
        this.roadPicker.baseUrl="/service/apps/itm/maps/itm/query/point2edge.json?"
        this.roadPicker.setMap(this.map.leaflet)
        this.routerPicker=new RouterPicker()
        this.routerPicker.setMap(this.map.leaflet)
        this.adjuster=new Adjuster
        this.adjusterRoadMarker=L.marker([0,0],{icon:L.divIcon({className: 'adjusterIcon fa fa-times'})})
        this.adjusterRoadPath=L.polyline([],{color:"red"})
        this.adjusterRoadMarker.addTo(this.map.leaflet)
        this.adjusterRoadPath.addTo(this.map.leaflet)
    }
    doRoadPick(){
        this.roadPicker.off("*")
        let roadMark=L.marker([0,0])
        roadMark.addTo(this.map.leaflet)
        let road=L.polyline([])
        road.addTo(this.map.leaflet)
        this.roadPicker.begin()
        this.roadPicker.on("drawing",(e)=>{
           roadMark.setOpacity(1)
           roadMark.setLatLng(e.latlng)
        })
        this.roadPicker.on("fail",(e)=>{
            roadMark.setOpacity(.5)
        })
        this.roadPicker.on("drawend",(e)=>{
            if(e.point){
                roadMark.setLatLng(e.point)
            }
            if(e.path){
                road.setLatLngs(e.path)
            }
            roadMark.setOpacity(1)
        })
    }
    doSelectAdjuster(){
        let adjuster=this.adjuster
        this.proxyEvents(adjuster,"simulate-road-change")
        this.roadPicker.off("*")
        let roadMark=this.adjusterRoadMarker
        //roadMark.addTo(this.map.leaflet)
        let road=this.adjusterRoadPath
        this.roadPicker.on("drawing",(e)=>{
           roadMark.setOpacity(1)
           roadMark.setLatLng(e.latlng)
           roadMark.bindPopup(adjuster.getNode())
           adjuster.doRender()
           adjuster.setBusy(true)
           roadMark.openPopup()
        })
        this.roadPicker.on("fail",(e)=>{
            roadMark.setOpacity(.5)
            adjuster.setData({roads:[]})
            road.setLatLngs([])
            roadMark.closePopup()
        })
        this.roadPicker.on("drawend",(e)=>{
            if(e.point){
                roadMark.setLatLng(e.point)
               
            }
            if(e.path){
                road.setLatLngs(e.path)
                
            }
            if(e.roadNum!=undefined){
                let roads=[]
                for(let i=0;i<e.roadNum;++i){
                    roads.push({name:`Lane-${i+1}`,isOpen:true})
                }
                adjuster.setData({roads:roads,name:e.name,id:e.id})
            }
            roadMark.setOpacity(1)
        })
        this.roadPicker.begin()
    }
    doRouter(){
        this.roadPicker.off("*")
        let mBegin=L.marker([0,0]),mEnd=L.marker([0,0]),mPath=L.polyline([],{interactive:false})
        mBegin.addTo(this.map.leaflet)
        mEnd.addTo(this.map.leaflet)
        mPath.addTo(this.map.leaflet)
 
        this.routerPicker.on("from",(e)=>{
            mBegin.setLatLng(e.latlngs[0])
        })
        this.routerPicker.on("to",(e)=>{
            mEnd.setLatLng(e.latlngs[1])
        })
        this.routerPicker.on("drawing drawend",(e)=>{
            mPath.setLatLngs(e.latlngs)
        })
        this.routerPicker.begin()
        // this.routerLayer.begin()
        // this.adjusterLayer.end()
        // this.roadLayer.end()
    }
    // beginSelectAdjuster(){
    //     this.adjusterLayer.begin()
    //     this.routerLayer.end()
    //     this.roadLayer.end()
    // }
    // adjusterLayer:RoadAdjusterLayer
    // routerLayer:RouterLayer
    // roadLayer:SingleMarkLayer
    initAll(){
        // if(this.routerLayer){
        //     this.routerLayer.remove()
           
        // }
        // this.routerLayer=new RouterLayer()
        // this.routerLayer.addTo(this.map.leaflet)
        // if(this.adjusterLayer){   
        //     this.adjusterLayer.remove()
        // }
        // this.adjusterLayer=new RoadAdjusterLayer()
        // this.adjusterLayer.addTo(this.map.leaflet)
        // if(this.roadLayer){
        //     this.roadLayer.remove()
        // } 
        // this.roadLayer=new SingleMarkLayer()
        // this.roadLayer.addTo(this.map.leaflet)
        this.showArea()
        // if(this.adjusterLayer){
        //     this.adjusterLayer.remove()
        //     this.adjusterLayer=null
        // }
    }
    showArea(){
        if(!this.pickableArea){
            $.get("/service/apps/tcm/maps/tpi/query/area_search.json").done(
                (fc)=>{
                    let f=new FeatureCollection(fc)
                    let p=_.first(f.getPolygon())
                    if(p){
                        this.pickableArea=p.toLeafletPolygon()
                        this.pickableArea.addTo(this.map.leaflet)
                        this.map.leaflet.fitBounds(this.pickableArea.getBounds())
                        this.initArea()
                    }
                }
            )
        }
    }
    initArea(){
        if(this.pickableArea){
             this.roadPicker.setInteractiveLayer(this.pickableArea)
             this.routerPicker.setInteractiveLayer(this.pickableArea)
             this.doRoadPick()
        }
    }
    pickableArea:L.Polygon

}