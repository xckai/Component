import { AdjustableLayer ,SingleMarkLayer,RoadAdjusterLayer} from './MarkerLayer';
import _ = require('underscore');
import { Map } from '../../BlueDark/Map/Map';
import { FeatureCollection, PolyLine } from '../../Jigsaw/map/GeoJSON';
import { RouterLayer } from './RouterLayer';
export class VicroadMap extends Map{
    constructor(conf?){
        super(conf)
        this.init()
    }
     defaultConfig(){
        return {
                    className:"map",
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
    init(){
        this.on("adjuster-btn-click",this.beginSelectAdjuster,this)
        this.on("router-btn-click",this.beginRouter,this)
         
    }
    beginRouter(){
        this.routerLayer.begin()
        this.adjusterLayer.end()
        this.roadLayer.end()
    }
    beginSelectAdjuster(){
        this.adjusterLayer.begin()
        this.routerLayer.end()
        this.roadLayer.end()
    }
    beginPickRoad(){
        this.roadLayer.begin()
        this.routerLayer.end()
        this.adjusterLayer.end()
        this.showPickAbleArea()
    }
    
    // beginAdjuster(){
    //     if(this.adjusterLayer){
    //         this.adjusterLayer.remove()
    //     }
    //     this.adjusterLayer=new AdjustableLayer()
    //     this.adjusterLayer.addTo(this.map.leaflet)
    //     this.adjusterLayer.begin()
    // }
    //adjusterLayer:AdjustableLayer
    adjusterLayer:RoadAdjusterLayer
    routerLayer:RouterLayer
    roadLayer:SingleMarkLayer
    initAll(){
        if(this.routerLayer){
            this.routerLayer.remove()
           
        }
        this.routerLayer=new RouterLayer()
        this.routerLayer.addTo(this.map.leaflet)
        if(this.adjusterLayer){   
            this.adjusterLayer.remove()
        }
        this.adjusterLayer=new RoadAdjusterLayer()
        this.adjusterLayer.addTo(this.map.leaflet)
        if(this.roadLayer){
            this.roadLayer.remove()
        } 
        this.roadLayer=new SingleMarkLayer()
        this.roadLayer.addTo(this.map.leaflet)
        this.beginPickRoad()
        // if(this.adjusterLayer){
        //     this.adjusterLayer.remove()
        //     this.adjusterLayer=null
        // }
    }
    showPickAbleArea(){
        $.get("/service/apps/tcm/maps/tpi/query/area_search.json").done(
            (fc)=>{
                let f=new FeatureCollection(fc)
                let p=_.first(f.getPolygon())
                if(p){
                    this.pickableArea=p.toLeafletPolygon()
                    this.pickableArea.addTo(this.map.leaflet)
                }
                this.map.leaflet.fitBounds(this.pickableArea.getBounds())
            }
        )

    }
    pickableArea:L.Polygon

}