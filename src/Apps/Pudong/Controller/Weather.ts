import { JController, IJControllerConfig } from './../../../Jigsaw/Core/JController';
import Mustache=require("mustache")
export class Weather extends JController {
   viewTemplate:string
   init(){
       this.viewTemplate=`<content class="weather">
       <div class="icon {{weather}}"></div>
       <div><span class="text">{{weatherText}}</span><span class="temperate">{{temperate}}</span></div>
    </content>`
       this.view.$el.html(Mustache.render(this.viewTemplate,{weather:"sun",weatherText:"晴天",temperate:"--"}))
   }
   setWeather(w:{weather:string,temperate:number}){

   }
}