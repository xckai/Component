import { App } from '../../Jigsaw/Core/App';
import { TimeSlider } from './Chart/TimeSlider';
import { VicroadMap } from './Map/VicroadMap';
import { VicroadNavBar } from './NavBar/VicroadNavBar';
import { SimulatorPanal } from './Panal/SimulatorPanal';
import { G2Map } from '.../../Jigsaw/Component/Map/G2Map';
import { IProgressLoader } from '../../Jigsaw/Component/Loader/ILoader';


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
        this.bar=new VicroadNavBar()
        this.bar.initDropDown({curValue:"reRouter",items:["reTime","reRouter"]})
        
        this.bar.addTo(this)




        this.mapComponent=new VicroadMap({style:{
            top:"3rem"
        }})
        this.mapComponent.addTo(this)
        this.timeSlider=new TimeSlider()
        this.timeSlider.style({
            top:null,
            bottom:"1rem",
            left:"calc(50% - 15rem)"
        })
        this.timeSlider.addTo(this)
    
         this.on("begin_calculation",this.showProgressBar,this)
         this.on("calculation_done",this.hiddenProgressBar,this)
         requestAnimationFrame(()=>{
            doInitMap(this.mapComponent)
        })
            
    }   
    timeSlider:TimeSlider
    mapComponent:VicroadMap
    bar:VicroadNavBar
    simulatorPanal:SimulatorPanal
   // rightSide:Side
    reTime(){
        this.router.navigate("reTime/",{trigger: false, replace: true})
        this.initAll()
    }
    reRouter(){
        this.router.navigate("reRouter/",{trigger: false, replace: true})
        this.initAll()
        this.simulatorPanal=new SimulatorPanal()
        this.simulatorPanal.addTo(this)
        this.simulatorPanal.show()
    }
    initAll(){
         this.mapComponent.initAll()
         if(this.simulatorPanal){
             this.simulatorPanal.remove()
             this.simulatorPanal=null;
         }
    }
    showProgressBar(){
        if(this.progressBar){
            let progressBar=this.progressBar
            progressBar.show()
            this.on("calculation_progress",(d)=>{progressBar.setProgress(d.value)},this) 
        }
       
    }
    progressBar:IProgressLoader
    hiddenProgressBar(){
        this.progressBar.remove()
    }


}
function doInitMap(map:G2Map){
       map.setMapSetting({center:{"lat":-37,"lng":145},zoom:8})
       map.layer("base",{renderer:"png",url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                                            visible:true})
      
}