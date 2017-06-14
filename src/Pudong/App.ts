import {App} from "../Jigsaw/App"
import {Map} from "../BlueDark/Map/Map"
import { NavBar } from "../BlueDark/Bar/NavBar";
import { LeftSide } from "./Side/LeftSide";
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
    side:LeftSide
   // rightSide:Side
    Main(){
        this.router.navigate("Pudong/",{trigger: false, replace: true})
        this.mapComponent=new Map({style:{
            top:"3rem"
        }})
        this.mapComponent.addTo(this)
        $.get("/dist/Pudong/mapConfig.json",(c)=>{
            console.log(c)
            this.mapComponent.map.setMapSetting(c)
        })
        this.bar=new NavBar()
        this.bar.addTo(this)
        this.side=new LeftSide({style:{
                top:"3rem",
                width:"40rem",
                bottom:"0px",
                "z-index":2000
            },
            className:"left-api"
        })
        this.side.addTo(this)
        // this.rightSide=new Side({style:{
        //         top:"3rem",
        //         left:null,
        //         right:"0px",
        //         width:"40rem",
        //         bottom:"0px",
        //         "z-index":2000
        // },className:"right-api",direction:"right"})
       
        // this.rightSide.addTo(this)
    }

}