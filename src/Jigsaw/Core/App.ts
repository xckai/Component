import Backbone =require( 'backbone');
import {View} from "./View"
import _ =require("lodash")
import {Component} from "./Component"
import {Util}from "../Utils/Util"
export class App extends Component{
    constructor(conf?){
        super(_.extend({el:"body"},conf))
        this.id=_.uniqueId("App")
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