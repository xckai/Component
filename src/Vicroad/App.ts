import {App} from "../Jigsaw/App"
import {Map} from "../BlueDark/Map/Map"
import { VicroadNavBar } from "./NavBar/VicroadNavBar";
export class MainApp extends App{
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","Main",this.proxy("Main"))
    }
    mapComponent:Map
    bar:VicroadNavBar
   // rightSide:Side
    Main(){
        this.router.navigate("Pudong/",{trigger: false, replace: true})
        this.mapComponent=new Map({style:{
            top:"3rem"
        }})
        this.mapComponent.addTo(this)
        $.get("/dist/Vicroad/mapConfig.json",(c)=>{
            console.log(c)
            this.mapComponent.map.setMapSetting(c)
        })
        this.bar=new VicroadNavBar()
        this.bar.addTo(this)
    }

}