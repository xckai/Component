import {App} from "../Jigsaw/App"
import {VicroadMap} from "./Map/VicroadMap"
import { VicroadNavBar } from "./NavBar/VicroadNavBar"
import {SimulatorPanal} from "./Panal/SimulatorPanal"
export class MainApp extends App{
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","router",this.proxy("Router"))
        this.addRule("Router","router",this.proxy("Router"))
        //this.addRule("Adjuster","adjuster",this.proxy("Adjuster"))
        this.addRule("Re Time","retime",this.proxy("Simulator"))
        this.bar=new VicroadNavBar()
        this.bar.initDropDown({curValue:"Router",items:["Re Time","Router"]})
        this.bar.addTo(this)
        this.mapComponent=new VicroadMap({style:{
            top:"3rem"
        }})
        this.mapComponent.addTo(this)
        $.get("/dist/Vicroad/mapConfig.json",(c)=>{
                this.mapComponent.map.setMapSetting(c)
                //this.mapComponent.beginRouter()
            })
        
      
    }
    mapComponent:VicroadMap
    bar:VicroadNavBar
    simulatorPanal:SimulatorPanal
   // rightSide:Side
    Simulator(){
        this.router.navigate("Simulator/",{trigger: false, replace: true})
        this.initAll()
        this.mapComponent.beginSimulator()
        this.simulatorPanal=new SimulatorPanal()
        this.simulatorPanal.addTo(this)
        this.simulatorPanal.show()
        this.on("adjuster-btn-click",()=>{
            console.log("adjuster-btn-click")
        })
      
    }
    Router(){
         this.router.navigate("Router/",{trigger: false, replace: true})
         this.initAll()
         this.mapComponent.beginRouter()
        
    }
    initAll(){
         this.mapComponent.initAll()
         if(this.simulatorPanal){
             this.simulatorPanal.remove()
             this.simulatorPanal=null;
         }
    }
    // Adjuster(){
    //      this.router.navigate("Adjuster/",{trigger: false, replace: true})
    //      this.mapComponent.initAll()
    //      this.mapComponent.beginAdjuster()
    // }

}