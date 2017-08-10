import { Component, IComponentConfig } from "../../../Jigsaw/Core/Component";
import _ = require("lodash")
import { G2Map, IMapConfig } from "../../../Jigsaw/Controller/Map/G2Map"
import { DivNode } from "../../../Jigsaw/Controller/DivNode/DivNode";
import { CircleSide } from "../../../Jigsaw/Controller/Side/CircleSide";
import { ScreenNavi2Cool } from "../../../Jigsaw/Controller/Navigation/ScreenNavi2Cool";
import { TaxiMapComponent } from "./TaxiMapComponent";

export class ScreenNavComponent extends Component {
    constructor(c?: IComponentConfig) {
        super(c)
        this.addClass("screen-component")
    }
    view:ScreenNavi2Cool
    init(){
        this.view=new ScreenNavi2Cool(this.config).render()
        this.view.on("screenChange",(data)=>{
            let title=""
            if(data.i==1){
                title="交通概况"
            }else{
                title="出租车实时地图"
            }
            this.send("titleChange",{title})
        })
    }
    taxiComponent:TaxiMapComponent
    doMain(){
        this.taxiComponent = new TaxiMapComponent({
                position: "absolute", left: "0px", right: "0px", top: "0px", bottom: "0px",
                mainMapConfig: { center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false },
                secondMapConfig:{ center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false }
            })
        this.taxiComponent.addTo(this,false)
        this.view.addToScreen2(this.taxiComponent.getNode$())
        let i=0
        // setInterval(()=>{
        //     i=++i%2
        //     this.view.NaviTo(i)
        // },2000)
    }
}