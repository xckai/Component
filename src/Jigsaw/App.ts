import Backbone =require( 'Backbone');
import {View} from "./View"
import _ =require("underscore")
import {Component} from "./Component"
import {Util}from "./Util"
export class App extends Component{
    constructor(conf?){
        super(conf)
        this.id=_.uniqueId("App")
     }
    defaultConfig(){
        return {
                                el:"body",
                                $el:null,
                                className:"app",
                                style:{
                                    position:"absolute",
                                    left:"0px",
                                    right:"0px",
                                    top:"0px",
                                    bottom:"0px",
                                    width:null,
                                    height:null
                                    }
                                }
    }
     start(){
        Backbone.history.start()
     }
     addRule(str,name,fn){
         if(this.router==undefined){
             this.router=new Backbone.Router()
         }
         this.router.route(str,name,fn)
     }
     proxy(fnStr){
         let self=this
         return this[fnStr].bind(self)
     }
     router:Backbone.Router
     
}