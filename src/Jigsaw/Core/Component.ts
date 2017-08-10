import { IViewConfig, IControllerView } from "./IView"
import _ = require("lodash")
import { Util } from "../Utils/Util"
import { EventBus } from "./EventBus"
import { Controller } from "./Controller";
import { BackboneView } from "./View";
const getProperty = Util.getProperty
export interface IComponentConfig extends IViewConfig{
    id?:string
}
export class Component extends EventBus{
    constructor(conf?:IComponentConfig) {
        super()
        this.id=(conf && conf.id!=undefined)?conf.id:_.uniqueId("component-")
        this.config=_.extend(this.defaultConfig(),conf)
        this.init()
    }   
    init() {
        this.view=new BackboneView(this.config)
        this.view.render()
       
    }
    defaultConfig():IComponentConfig{
        return {
            tagName:"section"
        }
    }
    config:IComponentConfig
    view: IControllerView
    getNode$(){
        return this.view.getNode$()
    }
    parent: Component
    children: { [id: string]: Component }
    id: string
    private context = {}
    getContext(k?:string|number) {
        let ctx={}
        ctx=_.extend(ctx,this.context)
        if(this.parent){
            ctx=_.extend(ctx,this.parent.getContext())
        }
        if(this.children){
           let cCtx= _.chain(this.children).filter((v,key)=>key!=this.id).reduce((memo,c)=>_.extend(memo,c.getContext()),{}).value()
           ctx=_.extend(ctx,cCtx)
        }
        if(k!=undefined){
            return ctx[k]
        }else{
            return ctx
        }
    }
    setContext(k, v?) {
        if(_.isObject(k)){
            this.context=_.extend(this.context,k)
        }else{
             this.context[k] = v
        }
        return this
    }
    style(s) {
        this.view.style(s)
        return this
    }
    addClass(c) {
        this.view.addClass(c)
        return this
    }
    removeClass(c) {
        this.view.removeClass(c)
    }
    addController(c:Controller){
        this.view.getNode$().append(c.getNode$())
        c.render()
    }
    addTo(c: Component,autoAppend?:boolean,listen?:boolean) {
        this.parent = c
        this.parent.addComponent(this,autoAppend,listen)
        return this
    }
    addComponent(nc: Component,autoAppend?:boolean,listen?:boolean) {
        if (!this.children) {
            this.children = {}
        }
        nc.parent = this
        if(listen ===undefined||listen==true){
            this.observe(nc)
        }
        this.children[nc.id] = nc
        if(autoAppend==undefined||autoAppend==true){
             nc.view.getNode$().appendTo(this.getNode$())
        }
        return this
    }
    remove() {
        if (this.parent) {
            this.parent.removeChild(this)
        }
        $(this.view.getNode$()).remove()
        this.destroy()
    }
    removeChild(c: Component|string) {
        if(_.isString(c)||_.isNumber(c)){
            if(this.children[c]){
                this.children[c].remove()
            }
            this.children[c]=undefined
        }else{
            if(this.children[c.id]){
                this.children[c.id].remove()
            }
            this.children[c.id]=undefined
        }
        return this
    }
    setBusy(b) {
        this.view.setBusy(b)
        return this
    }
}