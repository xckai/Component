import {Controller} from "./Controller"
import Backbone =require( 'Backbone');
import {View} from "./View"
import _ =require("underscore")
import {Component} from "./Component"
export class App extends Component{
    constructor(conf?){
         super(conf)
         if(conf && conf.id){
             this.id=conf.id
         }else{
             this.id=_.uniqueId("App")
         }
         if(conf.el){
             this.view=new View({el:conf.el})
         }else{
             this.view=new View({el:"body"})
         } 
         this.setConfig(conf)
     }
     enableRouter(){
         if(this.router==undefined){
             this.router=new Backbone.Router()
         }
     }
     addRule(str,name,fn){
         if(this.router==undefined){
             this.router=new Backbone.Router()
         }
         this.router.route(str,name,fn)
     }
     router:Backbone.Router
}