import Backbone =require( 'backbone');
import {View} from "./View"
import _ =require("lodash")
import { Component, IComponentConfig } from "./Component"
import {Util}from "../Utils/Util"
export class App extends Component{
     defaultConfig():IComponentConfig{
         return _.extend(super.defaultConfig(),{el:"body",class:"app",position:"absolute",left:"0px",right:"0px",bottom:"0px",top:"0px",width:null,height:null})
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