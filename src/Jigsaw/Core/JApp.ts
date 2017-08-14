import { JController } from './JController';
import { JView } from './JView';
import { JComponent } from './JComponent';
import Backbone =require( 'backbone');
import _ =require("lodash")
export class JApp extends JComponent{
     constructor(c){
         super(c)  
     }
     initContainer(c){
        this.container=new JController(_.extend({el:"body",class:"app",position:"absolute",left:"0px",right:"0px",bottom:"0px",top:"0px",width:null,height:null},c))
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