import _=require("lodash")
import {Evented} from "./Evented"
type IEventMessage={
    eventId:string,
    keys:string,
    args:any[]
}
interface IEvented{
    on(key:string,callback?:Function,ctx?:any)
    off(key:string,callback?:Function,ctx?:any)
}
export class EventBus extends Evented{
    constructor(){
        super()
        this.eventBusChildren=[]
    }
    private eventBusParent:EventBus
    private eventBusChildren:EventBus []
    private removeChildrenEventBus(c:EventBus){
        this.eventBusChildren=_.reject(this.eventBusChildren,(e)=>e.eventId==c.eventId)
        c.eventBusParent=null;
    }
    private sentToParent(e:IEventMessage){
        if(this.eventBusParent){
            this.eventBusParent.sentToParent(e)
        }else{
            this.handleEventMessage(e)
        }
    }
    private handleEventMessage(e:IEventMessage){
            this.trigger.apply(this,[e.keys].concat(e.args))
            this.sentToChildren(e)
    }
    private sentToChildren(e:IEventMessage){
         _.chain(this.eventBusChildren).filter(c=>e.eventId!=c.eventId).each(c=>c.handleEventMessage(e)).value()
    }
    private addChildrenEventBus(c:EventBus){
        if(_.some(this.eventBusChildren,(i)=>c.eventId==i.eventId)){
            return 
        }else{
             this.eventBusChildren.push(c)
        }
       
    }
    destroy(){
        _.each(this.eventBusChildren,c=>{
            c.eventBusParent=null
        })
        if(this.eventBusParent){
            this.eventBusParent.removeChildrenEventBus(this)
        }
    }
    send(keys,...args){
        let message={
            eventId:this.eventId,keys,args
        }
        this.trigger.apply(this,[keys].concat(args))
        this.sentToParent(message)
        return this
    }
    proxyEvents(obj:IEvented,...args){
        _.each(args,k=>{
            obj.on(k,(...args)=>{
                this.send.apply(this,[k].concat(args))
            })
        })
    }
    observe(c:EventBus){
        ///observe all eventbus's event
          this.eventBusParent=this
          c.addChildrenEventBus(this)
    }
}