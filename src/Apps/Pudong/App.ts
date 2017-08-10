import { App } from "../../Jigsaw/Core/App"
import { MapComponent } from "./Component/MapComponent";
import { CircleSide } from "../../Jigsaw/Controller/Side/CircleSide";
import { SideComponent } from "./Component/SideComponent";
import { BarComponent } from "./Component/BarComponent";

export class MainApp extends App {
    constructor(conf?) {
        super(conf)
        this.initApp()
    }
    initApp() {
        this.addRule("*path", "Main", this.proxy("Main"))
        this.mapComponent = new MapComponent({
            position: "absolute", left: "0px", right: "0px", top: "3rem", bottom: "0px",
            mainMapConfig: { center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false },
            secondMapConfig:{ center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false }
        })
        this.mapComponent.addTo(this)

        this.side=new SideComponent({position:"absolute",top:"3rem"})
        this.side.addTo(this)

        this.bar=new BarComponent
        this.bar.addTo(this)

    }
    bar:BarComponent
    side:SideComponent
    mapComponent: MapComponent
    // rightSide:Side
    Main() {
        this.router.navigate("Pudong/", { trigger: false, replace: true })

    }

}