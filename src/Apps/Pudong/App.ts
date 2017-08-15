import { TaxiMapComponent } from './Component/TaxiMapComponent';
import { JApp } from "../../Jigsaw/Core/JApp"
import { CircleSide } from "../../Jigsaw/Controller/Side/CircleSide";
import { ScreenNavComponent } from "./Component/ScreenNavComponent";
import { BarComponent } from "./Component/BarComponent";

export class MainApp extends JApp {
    constructor(conf?) {
        super(conf)
        this.initApp()
    }
    initApp() {
        this.addRule("*path", "Main", this.proxy("Main"))
  

        this.screenNav=new ScreenNavComponent({position: "absolute", left: "0px", right: "0px", bottom: "0px", top: "3rem" },this)
        this.screenNav.doMain()
        
        this.bar=new BarComponent(null,this)
      
        // this.map=new TaxiMapComponent({position:"absolute",left:"0px",right:"0px",top:"3rem",bottom:"0px", mainMapConfig: { center: { lat: 31.2102, lng: 121.599 }, zoom: 14, zoomControl: false }})
        // this.addContent(this.map)
    }
    map:TaxiMapComponent
    bar:BarComponent
    screenNav:ScreenNavComponent
    // rightSide:Side
    Main() {
        this.router.navigate("Pudong/", { trigger: false, replace: true })

    }

}