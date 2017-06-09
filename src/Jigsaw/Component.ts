import {Controller} from "./Controller"
import {View} from "./View"
import _ =require("underscore")
export class Component extends Controller{
     constructor(conf?){
         super(conf)
         if(conf && conf.id){
             this.id=conf.id
         }else{
             this.id=_.uniqueId("Component")
         }
         this.view=new View({el:"<section></section>"})
         this.setConfig(conf)
     }
    parent:Component
    children:Component []=[]
    id:string
    addTo(c:Component,listen?){
        this.parent=c
        this.parent.add(this,listen)
        return this
    }
    add(nc:Component,listen?){
       let i=_.findIndex(this.children,c=>c.id==nc.id)
       nc.parent=this
       if(i==-1){
           this.children.push(nc)
          
       }else{
           this.children[i]=nc
       }
       nc.view.getNode$().appendTo(this.view.getNode$())
       return this
    }
}