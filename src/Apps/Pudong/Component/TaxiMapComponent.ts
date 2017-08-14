import { IJControllerConfig } from './../../../Jigsaw/Core/JController';
import { JComponent } from './../../../Jigsaw/Core/JComponent';
import _ = require("lodash")
import { G2Map, IMapConfig } from "../../../Jigsaw/Controller/Map/G2Map"
export interface ITaxiMapComponent extends IJControllerConfig {
    mainMapConfig?: IMapConfig
}
export class TaxiMapComponent extends JComponent {
    constructor(c?: ITaxiMapComponent) {
        super(c)
        this.view.addClass("map-component")
        this.mainMap = new G2Map(_.extend({ position: "absolute", left: "0px", right: "0px", bottom: "0px", top: "0px" }, _.get(c, "mainMapConfig")))
        this.addContent(this.mainMap)
        this.mainMap.layer("base", { renderer: "png", url: "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieGNrYWkxMjMiLCJhIjoiY2l1NmExM21tMGg1eTJ0cXRveXkzMTczOSJ9.ItKaM2vO8SVBWfaijd6-hQ", visible: true })
        
        // this.secondMap = new G2Map(_.extend({ position: "absolute", left: null, right: ".5rem", bottom: null, top: ".5rem",width:"25rem",height:"18rem" }, _.get(c, "secondMapConfig")))
        // this.addController(this.secondMap)
        // this.secondMap.layer("base", { renderer: "png", url: "https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieGNrYWkxMjMiLCJhIjoiY2l1NmExM21tMGg1eTJ0cXRveXkzMTczOSJ9.ItKaM2vO8SVBWfaijd6-hQ", visible: true })
        // this.secondMap.view.addClass("second-map")
        
       

    }
    mainMap: G2Map
    secondMap: G2Map
}