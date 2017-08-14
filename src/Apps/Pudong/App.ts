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
  

        // this.screenNav=new ScreenNavComponent({position: "absolute", left: "0px", right: "0px", bottom: "0px", top: "3rem" })
        // this.screenNav.addTo(this)
        // this.screenNav.doMain()

        this.bar=new BarComponent
        this.bar.addTo(this)
        this.addContent(this.bar)

    }
    bar:BarComponent
    screenNav:ScreenNavComponent
    // rightSide:Side
    Main() {
        this.router.navigate("Pudong/", { trigger: false, replace: true })

    }

}