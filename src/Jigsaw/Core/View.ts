import Backbone = require('backbone');
import _ = require("lodash")
import { Util } from "../Utils/Util"
import { IView, IControllerView, IViewConfig } from "./IView";
export interface IBackboneViewConfig extends IViewConfig {
    className?: string | null | undefined,
    el?: HTMLElement | SVGAElement | string,
    $el?: JQuery | undefined,
    model?: Backbone.Model
}
export class BackboneView extends  Backbone.View<Backbone.Model> implements IControllerView{
    constructor(c?:IBackboneViewConfig){
        super(c)
        this.initView(c)
    }
    initView(c){
         this.getNode$().addClass(_.get(c,"class",""))
         this.style(_.pick(c,"width","height","left","right","top","bottom","position"))
         return this
    }
    getNode$(){
        return this.$el
    }
    fire(k:string,...args){
        this.trigger.apply(this,[k].concat(args))
    }
    style(k,v?){
        if(_.isObject(k)){
            _.each(k,(vv,kk)=>{
                vv=vv?vv:""
                this.$el.css(kk,vv)
            })
        }else{
            this.$el.css(k,v)
        }
        return this
    }
    addClass(cls) {
        if (cls) {
            this.$el.addClass(cls)
        }
        return this
    }
    removeClass(cls) {
        this.$el.removeClass(cls)
        return this
    }
    setBusy(busy: boolean, size?) {
        if (busy) {
            this.$el.append(Util.loader.genBallBusy(size || .5))
        } else {
            this.$(".busyContainer").remove()
        }
        return this
    }
}