import Backbone =require( 'Backbone');
import _=require("underscore")
import {Util}from "../Utils/Util"
import {EventBus} from "./Evented"
export class View extends  Backbone.View<Backbone.Model>{
    constructor(conf?){
        super(_.extend({tagName:"div"},conf))
        this.addClass(_.pick(conf,"class"))
    }
    getNode$(){
        return this.$el
    }
    getNode(){
        return this.el
    }
    getContentNode(){
        return this.el
    }
    getContentNode$(){
        return this.$el
    }
    attr(obj){
        this.$el.attr(obj)
        return this
    }
    setDate(o:string|Object,v?:string){
        if(_.isString(o)){
            this.model.set(o,v)
        }
        if(_.isObject(o)){
            this.model.set(o)
        }
        return this
    }
    style(obj){
        _.each(obj,(v:string,k:string)=>{
            if(v){
                this.$el.css(k,v)
            }else{
                this.$el.css(k,"")
            }
        })
        
        return this
    }
    setClass(cls:string){
        //this.$el.removeClass()
        if(_.isArray(cls)){
            _.each(cls,(v:string)=>{
                this.$el.addClass(v)
            })
        }
        if(_.isString(cls)){
            this.$el.addClass(cls)
        }
    }
    addClass(cls){
        if(cls){
             this.$el.addClass(cls)
        }
        return this
    }
    removeClass(cls){
        this.$el.removeClass(cls)
        return this
    }
    toogleClass(cls){
        this.$el.toggleClass(cls)
        return this
    }
    appendAt(dom){
       this.invokeBeforeRender()
       this.render()
       this.getNode$().appendTo(dom)
       this.invokeAterRender()
    }
    onAfterRender(){}
    onBeforeRender(){}
    invokeAterRender(){
        if(this.onAfterRender){
            this.onAfterRender()
        }
        return this
    }
    invokeBeforeRender(){
        if(this.onBeforeRender){
            setTimeout(()=>{
                 this.onBeforeRender()
            })
           
        }
    }
    setModel(m){
        this.model=m
        this.listenTo(this.model,"change",this.render)
        return this
    }
    doRender(){
        this.invokeBeforeRender()
        this.render()
        this.invokeAterRender()
    }
    setBusy(busy:boolean,size?){
        if(busy){
            this.$el.append(Util.loader.genBallBusy(size||.5))
        }else{
            this.$(".busyContainer").remove()
        }
    }
}