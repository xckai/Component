import { App } from "../../Jigsaw/Core/App"
import { MapComponent } from "./Component/MapComponent";
import { CircleSide } from "../../Jigsaw/Controller/Side/CircleSide";
import { ScreenNavComponent } from "./Component/ScreenNavComponent";
import { BarComponent } from "./Component/BarComponent";

export class MainApp extends App {
    constructor(conf?) {
        super(conf)
        this.initApp()
    }
    initApp() {
        this.addRule("*path", "Main", this.proxy("Main"))
  

        this.screenNav=new ScreenNavComponent({position: "absolute", left: "0px", right: "0px", bottom: "0px", top: "3rem" })
        this.screenNav.addTo(this)
        this.screenNav.doMain()

        this.bar=new BarComponent
        this.bar.addTo(this)

    }
    bar:BarComponent
    screenNav:ScreenNavComponent
    mapComponent: MapComponent
    // rightSide:Side
    Main() {
        this.router.navigate("Pudong/", { trigger: false, replace: true })

    }

}