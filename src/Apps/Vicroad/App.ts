import { App } from '../../Jigsaw/Core/App';
import { TimeSlider } from './Chart/TimeSlider';
import { VicroadMap } from './Map/VicroadMap';
import { VicroadNavBar } from './NavBar/VicroadNavBar';
import { ReTimePanal } from './Panal/ReTimePanal';
import { SimulatorPanal } from './Panal/SimulatorPanal';
import { G2Map } from '.../../Jigsaw/Component/Map/G2Map';
import { CircleLoader } from '../../Jigsaw/Component/Loader/CircleLoader';
import { IProgressLoader } from '../../Jigsaw/Component/Loader/ILoader';
import moment=require("moment")

export class MainApp extends App {
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","router",this.proxy("reRouter"))
        this.addRule("reRouter","router",this.proxy("reRouter"))
        //this.addRule("Adjuster","adjuster",this.proxy("Adjuster"))
        this.addRule("reTime","retime",this.proxy("reTime"))
        ///add bar
        this.bar=new VicroadNavBar()
        this.bar.initDropDown({curValue:"reRouter",items:["reTime","reRouter"]})
        this.bar.addTo(this)
        ///add map
        this.mapComponent=new VicroadMap({style:{
            top:"3rem"
        }})
        this.mapComponent.addTo(this)
        requestAnimationFrame(()=>{
            doInitMap(this.mapComponent)
        })
        ///add timeslider
        this.timeSlider=new TimeSlider()
        this.timeSlider.setStyle({
            top:null,
            bottom:"1rem",
            height:"5.2rem",
            left:"calc(50% - 15rem)"
        })
        this.timeSlider.addTo(this)
        ///add progressbar
        this.progressBar=new CircleLoader(200,300,5)
        this.progressBar.toElement()
        this.on("time-change",(d)=>{
           
            this.setContext("currentTime", moment(d.dateTime).seconds(0).milliseconds(0).toDate())
        })
        this.initReRouter()
        this.initReTime()
            
    }   
    initReRouter(){  
         this.on("simulation:begin-calculation",this.showProgressBar,this)
         this.on("simulation:calculation-done",this.hiddenProgressBar,this)
    }
    initReTime(){

    }
    timeSlider:TimeSlider
    mapComponent:VicroadMap
    bar:VicroadNavBar
    simulatorPanal:SimulatorPanal
    reTimePanal:ReTimePanal
    // rightSide:Side
    reTime(){
        this.router.navigate("reTime/",{trigger: false, replace: true})
        this.resetAll()
        this.reTimePanal=new ReTimePanal
        this.reTimePanal.addTo(this)
        this.reTimePanal.show()
        this.mapComponent.doReTime()
        this.on("reTime:reRouter",()=>{
            this.timeSlider.reset()
        })
        //this.send("begin-retime")
    }
    reRouter(){
        this.router.navigate("reRouter/",{trigger: false, replace: true})
        this.resetAll()
        this.simulatorPanal=new SimulatorPanal()
        this.simulatorPanal.addTo(this)
        this.simulatorPanal.show()
        this.mapComponent.doReRouter()
        this.on("reRouter:rePickRoad reRouter:reRoute",()=>{
            this.timeSlider.reset()
        })
       
    }
    resetAll(){
         this.mapComponent.initAll()
         this.timeSlider.hidden()
         if(this.simulatorPanal){
             this.simulatorPanal.remove()
             this.simulatorPanal=null;
         }
         if(this.reTimePanal){
             this.reTimePanal.remove()
             this.reTimePanal=null
         }
    }
    showProgressBar(){
        if(this.progressBar){
            let progressBar=this.progressBar
            progressBar.addTo(this.rootView.getNode())
            progressBar.show()
            this.on("simulation:calculation-progress",(d)=>{progressBar.setProgress(d.value)},this) 
        }
       
    }
    progressBar:IProgressLoader
    hiddenProgressBar(){
          if(this.progressBar){
                this.progressBar.remove()
            }
      
    }


}
function doInitMap(map:G2Map){
       map.setMapSetting({center:{"lat":-37,"lng":145},zoom:8})
       map.layer("base",{renderer:"png",url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                                            visible:true})
      
}