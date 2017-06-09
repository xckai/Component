import {App} from "../Jigsaw/Core/App"
import {Map} from "../Jigsaw/Map/Map"
import { NavBar } from "../Jigsaw/Bar/NavBar";
export class MainApp extends App{
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","Main",this.proxy("Main"))
    }
    mapComponent:Map
    bar:NavBar
    Main(){
        this.router.navigate("Pudong/",{trigger: false, replace: true})
        this.mapComponent=new Map()
        this.mapComponent.addTo(this)
        $.get("/dist/Pudong/mapConfig.json",(c)=>{
            console.log(c)
            this.mapComponent.map.setMapSetting(c)
        })
        this.bar=new NavBar()

    }

}