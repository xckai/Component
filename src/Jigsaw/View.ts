import Backbone =require( 'Backbone');
import _=require("underscore")
export class View extends  Backbone.View<Backbone.Model>{
    constructor(conf?){
        super(conf)
    }
    getNode$(){
        return this.$el
    }
    attr(obj){
        this.$el.attr(obj)
        return this
    }
    style(obj){
        this.$el.css(obj)
        return this
    }
    setClass(cls:any []|string){
        this.$el.removeClass()
        if(_.isArray(cls)){
            _.each(cls,(v:string)=>{
                this.$el.addClass(v)
            })
        }
        if(_.isString(cls)){
            this.$el.addClass(cls)
        }
    }
}