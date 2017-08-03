import { App } from '../../Jigsaw/Core/App';
import { TimeSlider } from './Chart/TimeSlider';
import { VicroadMap } from './Map/VicroadMap';
import { VicroadNavBar } from './NavBar/VicroadNavBar';
import { ReTimePanal } from './Panal/ReTimePanal';
import { SimulatorPanal } from './Panal/SimulatorPanal';
import { G2Map } from '.../../Jigsaw/Component/Map/G2Map';
import { CircleLoader } from '../../Jigsaw/Component/Loader/CircleLoader';
import { IProgressLoader } from '../../Jigsaw/Component/Loader/ILoader';
import  * as moment  from 'moment';

export class MainApp extends App {
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","router",this.proxy("reRoute"))
        this.addRule("Re-Route","router",this.proxy("reRoute"))
        //this.addRule("Adjuster","adjuster",this.proxy("Adjuster"))
        this.addRule("Re-Time","retime",this.proxy("reTime"))
        ///add bar
        this.bar=new VicroadNavBar()
        this.bar.initDropDown({curValue:"Re-Route",items:["Re-Time","Re-Route"]})
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
        this.on("simulation_begin_calculation",(d)=>{
            this.setContext("beginTime",moment(d.dateTime).add(15,"m").seconds(0).milliseconds(0).toDate())
            this.setContext("duration",d.duration)
            this.send("beginTimeChange",{dateTime:this.getContext("beginTime"),duration:d.duration})
        })
        this.on("retime-apply",(d)=>{
            this.setContext("beginTime",moment(d.dateTime).seconds(0).milliseconds(0).toDate())
             this.setContext("duration",d.duration)
            this.send("beginTimeChange",{dateTime:this.getContext("beginTime"),duration:d.duration})
        })
        this.initReRouter()
        this.initReTime()
            
    }   
    initReRouter(){  
         this.on("simulation_begin_calculation",this.showProgressBar,this)
         this.on("simulation_calculation_done",this.hiddenProgressBar,this)
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
        this.router.navigate("Re-Time/",{trigger: false, replace: true})
        this.resetAll()
        this.reTimePanal=new ReTimePanal
        this.reTimePanal.addTo(this)
        this.reTimePanal.show()
        this.mapComponent.doReTime()
        // this.on("reTime:reRouter",()=>{
        //     this.timeSlider.reset()
        // })
        //this.send("begin-retime")
    }
    reRoute(){
        this.router.navigate("Re-Route/",{trigger: false, replace: true})
        this.resetAll()
        this.simulatorPanal=new SimulatorPanal()
        this.simulatorPanal.addTo(this)
        this.simulatorPanal.show()
        this.mapComponent.doReRouter()
        // this.on("reRouter:rePickRoad reRouter:reRoute",()=>{
        //     this.timeSlider.reset()
        // })
       
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
            this.on("simulation_calculation_progress",(d)=>{progressBar.setProgress(d.value)},this) 
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