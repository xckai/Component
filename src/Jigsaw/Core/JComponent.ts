import { JController } from './JController';
import { Container } from './../Controller/Container/Container';
import _ = require("lodash")
import { EventBus } from "./EventBus"
export class JComponent extends EventBus{
    constructor(c?){
        super()
        this.initContainer(c)
    }
    parent: JComponent
    children: { [id: string]: JComponent }
    id: string
    private context = {}
    container:JController
    initContainer(c){
        this.container=new JController(c)
    }
    defaultConfig(){
        return {}
    }
    getNode$(){
        return this.container.getNode$()
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
            this.observe(nc)
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