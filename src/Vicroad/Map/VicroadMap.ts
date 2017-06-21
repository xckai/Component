import { AdjustableLayer ,SingleMarkLayer,RoadAdjusterLayer} from './MarkerLayer';
import _=require("underscore")
import {Map} from "../../BlueDark/Map/Map"
import {RouterLayer} from "./RouterLayer"
export class VicroadMap extends Map{
    constructor(conf?){
        super(_.extend({zoomControl:false},conf))
        this.init()
    }
    init(){
        this.on("adjuster-btn-click",this.beginSelectAdjuster,this)
        this.on("router-btn-click",this.beginRouter,this)
         
    }
    beginRouter(){
        this.routerLayer.begin()
        this.adjusterLayer.end()
    }
    beginSelectAdjuster(){
        this.adjusterLayer.begin()
        this.routerLayer.end()
    }
    beginSimulator(){
        if(this.adjusterLayer){
            this.adjusterLayer.remove()
        }
        this.adjusterLayer=new RoadAdjusterLayer()
        this.adjusterLayer.addTo(this.map.leaflet)
        this.adjusterLayer.begin()
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
        // if(this.adjusterLayer){
        //     this.adjusterLayer.remove()
        //     this.adjusterLayer=null
        // }
    }

}