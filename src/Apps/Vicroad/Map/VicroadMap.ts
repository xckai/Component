
import {G2Map} from "../../../Jigsaw/Component/Map/G2Map"
import _ = require('underscore');
import {BaseDrawer,PointDrawer}from '../../../Jigsaw/Component/Map/MapDrawer'
import L=require('leaflet')
import { Adjuster } from './Adjuster';
import {DatePanal}from "./DatePanal";
import { API } from "../APIConfig";
import { Util } from "../../../Jigsaw/Utils/Util";
import { VicroadLineChart } from "../Chart/LineChart";
class RouterPicker extends PointDrawer {
    begin(){
        if(this.interactiveLayer){
            this.drawing=true;
            this.interactiveLayer.on("click",this.onClick,this);
            this.interactiveLayer.on("dblclick",this.onDbclick,this);
            this.interactiveLayer.on("mousemove",this.onMouseMove,this);
            //this.map.dragging.disable();
            this.map.doubleClickZoom.disable(); 
        }
    }
    onClick(e:L.MouseEvent){

        if(this.latlngs && this.latlngs.length>0){
            this.latlngs.push(e.latlng);
            this.fire("to",{latlngs:this.latlngs});
            this.endDraw()
        }else{
            this.latlngs=[];
            this.latlngs.push(e.latlng);
            this.fire("from",{latlngs:this.latlngs});
            this.fire("drawbegin",{latlngs:this.latlngs});
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
        API.getRoad(this.oldLatlng.lat,this.oldLatlng.lng).done((d)=>{
            if(!d.point||!d.path){
                this.fire("fail")
            }else{
                this.fire("drawend",d)
            }
        }).fail(()=>{
            this.fire("fail")
        })
        // $.get(this.baseUrl+`lng=${this.oldLatlng.lng}&lat=${this.oldLatlng.lat}`)
        // .done((d)=>{
        //     let f=new FeatureCollection(d)
        //     if(_.isEmpty(f.getPoint())||_.isEmpty(f.getPolyline())){
        //         this.fire("fail")
        //     }else{
        //         this.fire("drawend",{
        //             point:_.first(f.getPoint()).getleafletCoorinates(),
        //             path:_.first(f.getPolyline()).getleafletCoorinates(),
        //             roadNum:_.first(f.getPolyline()).getProperty("properties/AVGLANES"),
        //             name:_.first(f.getPolyline()).getProperty("properties/NAME"),
        //             id:_.first(f.getPolyline()).getProperty("properties/ID"),
        //         })
        //     }
           
        // })
        // .fail((d)=>{
        //     this.fire("fail",null)
        // })
    }
}

export class VicroadMap extends G2Map{
    constructor(conf?){
        super(Util.deepExtend({zoomControl:false,class:"map"},conf))
        this.init()
    }
    roadPicker:RoadPicker
    adjuster:Adjuster
    routerPicker:RouterPicker
    datePanal:DatePanal
    adjusterLayerGroup:L.LayerGroup
    reTimeRouterLayerGroup:L.LayerGroup
    simulateRouterLayerGroup:L.LayerGroup
    init(){
        this.datePanal=new DatePanal()
        this.datePanal.appendAt(this.rootView.$el)
        this.datePanal.style({
            "z-index":2000,
            position:"absolute",
            width:"100%"
        })
        this.on("simulator-apply timeslider-change",(d)=>{
            this.datePanal.setTime(d.date)
        })
        this.on("adjuster-btn-on",this.doSelectAdjuster,this)
        //this.on("adjuster-btn-off router-btn-off",this.doRoadPick,this)
        this.on("begin-retime",this.doReTimeRouter,this)
        this.on("simulate-router-btn-on",this.doRouter,this)
        this.roadPicker=new RoadPicker()
        this.roadPicker.baseUrl="/service/apps/itm/maps/itm/query/point2edge.json?"
        this.roadPicker.setMap(this.map.leaflet)
        this.routerPicker=new RouterPicker()
        this.routerPicker.setMap(this.map.leaflet)
        this.adjuster=new Adjuster
        this.adjusterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
        this.reTimeRouterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
        this.simulateRouterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
        this.on("simulation:done",this.showSimulationResult,this)
    }
    doReTimeRouter(){
        this.roadPicker.off("*")
        let mBegin=L.marker([0,0]),mEnd=L.marker([0,0]),mPath=L.polyline([],{interactive:false})
        this.reTimeRouterLayerGroup.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)
 
        this.routerPicker.on("from",(e)=>{
            mBegin.setLatLng(e.latlngs[0])
            mEnd.setLatLng([0,0])
            mPath.setLatLngs([])
        })
        this.routerPicker.on("to",(e)=>{
            mEnd.setLatLng(e.latlngs[1])
        })
        this.routerPicker.on("drawend",(e)=>{
            mPath.setLatLngs(e.latlngs)
            this.send("retime-router-done",{latlngs:e.latlngs})
            API.getReTimeRouter(e.latlngs,null).done((d)=>{
                let linechart=new VicroadLineChart({style:{width:"30rem",height:"20rem"}})
                linechart.loadMeasures(d)
                mEnd.bindPopup(linechart.toElement())
                mEnd.openPopup()
            })
            setTimeout(()=>{
                    this.routerPicker.begin()
            },200)
        })
        this.routerPicker.on("drawing",(e)=>{
             mPath.setLatLngs(e.latlngs)
            
        })
        this.routerPicker.on("drawbegin",(e)=>{
             this.send("retime-router-drawing",{latlngs:e.latlngs})
        })
        this.routerPicker.begin()
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
        let adjuster=new Adjuster()
        this.proxyEvents(adjuster,"simulate-road-change")
        this.on("simulate-road-change",()=>{
             this.roadPicker.off("*")
        })
        this.routerPicker.off("*")
        let roadMark= L.marker([0,0],{icon:L.divIcon({className: 'adjusterIcon fa fa-times'})})
        this.adjusterLayerGroup.addLayer(roadMark)
        //roadMark.addTo(this.map.leaflet)
        let road=L.polyline([],{color:"red"})
        this.adjusterLayerGroup.addLayer(road)
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
            adjuster.setData({id:null,name:null,roads:[]})
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
        this.simulateRouterLayerGroup.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)

 
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
        this.roadPicker.off("*")
        this.routerPicker.off("*")
        this.adjusterLayerGroup.clearLayers()
        this.simulateRouterLayerGroup.clearLayers()
        this.reTimeRouterLayerGroup.clearLayers()
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
    initSimulationResult(){
            let l=this.layer("simulationResult",{renderer:"canvas",
                                                url:"/services/vicroad/tiers/ctmEdgeSpeedMap/extent/:zoom/:extent/canvas.w2?category=1&:timeTo",
                                                 selectable:false})
            l.setContext({timeTo:":2017-05-08T16:45:00%2B08:00"})
            l.style("*").line({width:(c)=>{
                    
                    if(c("zoom")){
                        return Math.floor(c("zoom")/5)
                    }else{
                        return 2
                    }
                },color:(c)=>{
                 if(c("SIM_SPEED")>60)
                    return "yellow";
                 else
                    return "red";
            }})
    }
    showSimulationResult(){
        this.layer("simulationResult").show()
    }
    hiddenSimulationResult(){
        this.layer("simulationResult").hide()
    }
    updateSimulationResult(){
        this.layer("simulationResult").redraw()
    }
    showArea(){
        if(!this.pickableArea){
            API.getMainArea().done((d)=>{
                if(d){
                      this.pickableArea=L.polygon(d.latlngs)
                        this.pickableArea.addTo(this.map.leaflet)
                        this.map.leaflet.fitBounds(this.pickableArea.getBounds())
                        this.initArea()
                }
            }).fail(()=>{
                alert("error ")
            })
           


       
            // $.get("/service/apps/tcm/maps/tpi/query/area_search.json").done(
            //     (fc)=>{
            //         let f=new FeatureCollection(fc)
            //         let p=_.first(f.getPolygon())
            //         if(p){
            //             this.pickableArea=p.toLeafletPolygon()
            //             this.pickableArea.addTo(this.map.leaflet)
            //             this.map.leaflet.fitBounds(this.pickableArea.getBounds())
            //             this.initArea()
            //         }
            //     }
            // )
        }
    }
    initArea(){
        if(this.pickableArea){
             this.roadPicker.setInteractiveLayer(this.pickableArea)
             this.routerPicker.setInteractiveLayer(this.pickableArea)
            // this.doRoadPick()
        }
        this.initSimulationResult()
    }
    pickableArea:L.Polygon

}