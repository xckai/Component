import { ScreenNavi2Ocatagon } from './../../../Jigsaw/Controller/Navigation/ScreenNavi2Ocatagon';
import { IJControllerConfig } from './../../../Jigsaw/Core/JController';

import { JComponent } from './../../../Jigsaw/Core/JComponent';
import { ScreenNavi2 } from './../../../Jigsaw/Controller/Navigation/ScreenNavi2';
import { OverViewComponent } from './OverViewComponent';

import _ = require("lodash")
import { G2Map, IMapConfig } from "../../../Jigsaw/Controller/Map/G2Map"
import { DivNode } from "../../../Jigsaw/Controller/DivNode/DivNode";
import { CircleSide } from "../../../Jigsaw/Controller/Side/CircleSide";
import { TaxiMapComponent } from "./TaxiMapComponent";

export class ScreenNavComponent extends JComponent {
    constructor(c?:IJControllerConfig,parent?,autoAppend?,listen?) {
        super(c,parent,autoAppend,listen)
        this.view.addClass("screen-component")
        this.screenContainer=new ScreenNavi2Ocatagon
        this.addContent(this.screenContainer)
    }
    screenContainer:ScreenNavi2Ocatagon
    taxiComponent:TaxiMapComponent
    mainComponent:OverViewComponent
    doMain(){
        this.taxiComponent = new TaxiMapComponent({
               
                mainMapConfig: { center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false },

            })
        this.taxiComponent.addTo(this,false)
        this.screenContainer.addToScreen2(this.taxiComponent.getNode$())
        this.mainComponent=new OverViewComponent({
             position: "absolute", left: "0px", right: "0px", top: "0px", bottom: "0px",
        })
        this.mainComponent.addTo(this,false)
        this.screenContainer.addToScreen1(this.mainComponent.getNode$())

        let i=0
        // setInterval(()=>{
        //     i=++i%2
        //     this.view.NaviTo(i)
        // },2000)
    }
}