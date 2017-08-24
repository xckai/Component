import { OverViewComponent } from './Component/OverViewComponent';
import { TaxiMapComponent } from './Component/TaxiMapComponent';
import { JApp } from "../../Jigsaw/Core/JApp"
import { BarComponent } from "./Component/BarComponent";
import { ScreenNaviOcatagon } from './../../Controller/Navigation/ScreenNaviOcatagon';

export class MainApp extends JApp {
    constructor(conf?) {
        super(conf)
        this.initApp()
    }
    screenNav: ScreenNaviOcatagon
    initApp() {
        this.addRule("*path", "Main", this.proxy("Main"))


        this.screenNav = new ScreenNaviOcatagon({ position: "absolute", left: "0px", right: "0px", bottom: "0px", top: "3rem" },this)
        this.bar = new BarComponent(null, this)
        this.taxiComponent = new TaxiMapComponent({
            mainMapConfig: { center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false },
        }, this, false)
        this.mainComponent = new OverViewComponent({
            position: "absolute", left: "0px", right: "0px", top: "0px", bottom: "0px",
        }, this, false)

        this.screenNav.addContent(this.mainComponent)
            .addContent(this.taxiComponent)


    }
    taxiComponent: TaxiMapComponent
    mainComponent: OverViewComponent
    bar: BarComponent
    // rightSide:Side
    Main() {
        this.router.navigate("Pudong/", { trigger: false, replace: true })

    }

}