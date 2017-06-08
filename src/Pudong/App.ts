import {App} from "../FrameWork/Core/App"
import {Map} from "../FrameWork/Map/Map"
export class MainApp extends App{
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","Main",this.proxy("Main"))
    }
    mapComponent:Map
    Main(){
        this.router.navigate("Pudong/",{trigger: false, replace: true})
        this.mapComponent=new Map()
        this.mapComponent.addTo(this)
        $.get("/dist/Pudong/mapConfig.json",(c)=>{
            console.log(c)
            this.mapComponent.map.setMapSetting(c)
        })
    }

}