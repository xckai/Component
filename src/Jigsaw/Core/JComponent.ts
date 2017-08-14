import { JController } from './JController';
import _ = require("lodash")
import { EventBus } from "./EventBus"
export class JComponent extends JController{
    constructor(c?){
        super(c)
        this.eventBus=new EventBus
        this.init()
    }
    init(){}
    eventBus:EventBus
    parent: JComponent
    children: { [id: string]: JComponent }
    id: string
    private context = {}
    on(k:string,fn:Function,ctx?){
        this.eventBus.on(k,fn,ctx)
        return this
    }
    off(k:string,fn?:Function,ctx?){
        this.eventBus.off(k,fn,ctx)
        return this
    }
    fire(k:string,...args){
        this.eventBus.fire.apply(this.eventBus,[k].concat(args))
        return this
    }
    once(k:string,fn:Function,ctx?){
        this.eventBus.once(k,fn,ctx)
        return this
    }
    send(k:string,...args){
        this.eventBus.send.apply(this.eventBus,[k].concat(args))
        return this
    }
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
    addTo(c: JComponent,listen?:boolean) {
        this.parent = c
        this.parent.addComponent(this,listen)
        return this
    }
    addComponent(nc: JComponent,listen?:boolean) {
        if (!this.children) {
            this.children = {}
        }
        nc.parent = this
        if(listen ===undefined||listen==true){
            this.eventBus.observe(nc.eventBus)
        }
        this.children[nc.id] = nc
        return this
    }
    remove() {
        if (this.parent) {
            this.parent.removeChild(this)
        }
        super.remove()
    }
    removeChild(c: JComponent|string) {
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
}