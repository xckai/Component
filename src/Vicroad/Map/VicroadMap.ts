import { AdjustableLayer ,SingleMarkLayer,RoadAdjusterLayer} from './MarkerLayer';
import _=require("underscore")
import {Map} from "../../BlueDark/Map/Map"
import {RouterLayer} from "./RouterLayer"
export class VicroadMap extends Map{
    constructor(conf?){
        super(_.extend({zoomControl:false},conf))
    }
    beginRouter(){
        if(this.routerLayer){
            this.routerLayer.remove()
        }
        this.routerLayer=new RouterLayer()
        this.routerLayer.addTo(this.map.leaflet)
        this.routerLayer.begin()
    }
    beginSimulator(){
        if(this.simulatorLayer){
            this.simulatorLayer.remove()
        }
        this.simulatorLayer=new RoadAdjusterLayer()
        this.simulatorLayer.addTo(this.map.leaflet)
        this.simulatorLayer.begin()
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
    simulatorLayer:RoadAdjusterLayer
    routerLayer:RouterLayer
    initAll(){
        if(this.routerLayer){
            this.routerLayer.remove()
            this.routerLayer=null
        }
        if(this.simulatorLayer){   
            this.simulatorLayer.remove()
             this.simulatorLayer=null
        }
        // if(this.adjusterLayer){
        //     this.adjusterLayer.remove()
        //     this.adjusterLayer=null
        // }
    }

}