import _ = require("underscore")
interface IEventObj{
    callback:Function,
    ctx:Object
}
interface IEvents{
    [selector: string]:IEventObj []
}
interface IEventMessage{
    eventId:string,
    keys:string,
    args:any[]
}
interface IEvented{
    on(key:string,callback?:Function,ctx?:any)
    off(key:string,callback?:Function,ctx?:any)
}
// export class EventBus {
//     constructor(){
//         this.eventId=_.uniqueId("eventbus")
//         this.eventBusChildren=[]
//         this.events={}
//     }
//     private eventId:string
//     private eventBusParent:EventBus
//     private eventBusChildren :EventBus []
//     private events:IEvents
//     on(str:string,callback:Function,ctx?){
//        _.each( str.split(" "),(t)=>{
//            this._on(t,callback,ctx)
//        })
//     }
//     off(str:string ,callback?:Function,ctx?){
//         _.each( str.split(" "),(t)=>{
//            this._off(t,callback,ctx)
//         })
//     }
//     _on(t:string,callback:Function,ctx?){
//         if (this.events[t]!=undefined) {
//             if (_.some(this.events[t], (e) => e.callback.toString() == callback.toString() && e.ctx == ctx)) {
//                 return this
//             } else {
//                 let obj: any = {};
//                 obj.callback = callback;
//                 obj.ctx = ctx;
//                 this.events[t].push(obj);
//             }
//         } else {
//             this.events[t] = [];
//             let obj: any = {};
//             obj.callback = callback;
//             obj.ctx = ctx;
//             this.events[t].push(obj);
//         }
//         return this
//     }
//     _off(t:string ,callback?:Function,ctx?){
//         if(t=="*"){
//             this.events={}
//         }
//         else if(this.events[t]==undefined){
//             return this
//         }else{
//             if(callback==undefined){
//                 return this._offAllKey(t)
//             }else{
//                 let newEvents=[]
//                 newEvents=_.reject(this.events[t],(e)=>e.callback.toString()==callback.toString() && e.ctx==ctx)
//                 this.events[t]=newEvents
//                 return this
//             }
//         }
//     }
//     send(t:string,...args){
//         let message={
//             eventId:this.eventId,
//             eventKey:t,
//             args:args
//         }
//         this.fire(t,args)
//         this.setToParent(message)
//     }
//     setToParent(e:IEventMessage){
//         if(this.eventBusParent){
//             this.eventBusParent.setToParent(e)
//         }else{
//             this.handleEventMessage(e)
//         }
//     }
//     setToChildren(e:IEventMessage){
//          _.chain(this.eventBusChildren).filter(c=>e.eventId!=c.eventId).each(c=>c.handleEventMessage(e))
//     }
//     handleEventMessage(e:IEventMessage){
//         this.fire(e.eventKey,e.args)
//         this.setToChildren(e)
//     }
//     fire(t:string,args?){
//         _.each(this.events[t],(e)=>{
//                e.callback.apply(e.ctx,args)
//         })
//     }
//     destroy(){
//         _.each(this.eventBusChildren,c=>c.eventBusParent=null)

//         if(this.eventBusParent){
//             this.eventBusParent.removeChildrenEventBus(this)
//         }
//     }
//     listenTo(c:EventBus){
//         c.eventBusParent=this
//         this.addChildrenEventBus(c)
//     }
//     observe(c:EventBus){
//         c.eventBusParent=this
//         this.addChildrenEventBus(c)
//     }
//     private addChildrenEventBus(c:EventBus){
//         if(_.some(this.eventBusChildren,(i)=>c.eventId==i.eventId)){
//             return 
//         }else{
//              this.eventBusChildren.push(c)
//         }
       
//     }
//     private removeChildrenEventBus(c:EventBus){
//         this.eventBusChildren=_.reject(this.eventBusChildren,(e)=>e.eventId==c.eventId)
//         c.eventBusParent=null;
//     }
//     _offAllKey(t:string){
//         this.events[t]=[]
//         return this
//     }
//     proxyEvents(obj:IEvented,...args){
//         _.each(args,(k)=>{
//             obj.on(k,(...objs)=>{
//                 this.send.apply(this,[k].concat(objs))
//             })
//         })
//     }
// }
// export class Evented {
//     constructor() {
//         this.events = {};
//     }
//     private events: any
//     private event_parent: Evented
//     on(t: string, fn: Function, ctx ? : Object) {

//         var st = t.split(" ");
//         st.forEach((tt) => {
//             this._on(tt,fn,ctx)
//         })
//         return this;
//     }
//     private _on(t: string, fn: Function, ctx ? : Object) {
//         if (this.events[t]) {
//             if (_.some(this.events[t], (e: any) => e.fn.toString() == fn.toString() && e.ctx == ctx)) {
//                 return
//             } else {
//                 let obj: any = {};
//                 obj.fn = fn;
//                 obj.ctx = ctx;
//                 this.events[t].push(obj);
//             }
//         } else {
//             this.events[t] = [];
//             let obj: any = {};
//             obj.fn = fn;
//             obj.ctx = ctx;
//             this.events[t].push(obj);
//         }
//     }
//     private _off(t: string, fn ? : Function, ctx ? ) {
//         if(t=="*"){
//             this.events={}
//         }
//         if (!this.events[t]) {
//             return this;
//         } else {
//             let nEs = [];
//             if (fn) {
//                 this.events[t].forEach(o => {
//                     if (o.fn.toString() != fn.toString() && o.ctx != ctx) {
//                         nEs.push(o);
//                     }
//                 });
//             }
//             this.events[t] = nEs;
//         }
//     }
//     off(t: string, fn?: Function) {
//         var st = t.split(" ");
//         st.forEach(s => this._off(s, fn))
//         return this;
//     }
//     fire(t: string, ...args) {
//          _.each(this.events[t],(e:any)=>{
//             e.fn.apply(e.ctx,args)
//         })
//         return this
//     }
//     listenTo(e: Evented) {
//         e.event_parent = this
//         return this
//     }
// }

type EventsDataObj={
    [key:string]:{callback:Function,context:Object|null|undefined}[]
}
export class Evented{
    eventId:string
    private eventObj:EventsDataObj={}
    private eventSplitter:any
    private keyMatcher:(a,b)=>boolean
    constructor(){
        this.eventId=_.uniqueId("event-")
        this.setEventSplitter(" ")
        this.setEventKeyMatcher((a,b)=>{
            if(b=="*" ||b=="all"||a=="*"||a=="all"){
                return true
            }else{
                return a==b
            }
        })
    }
    setEventKeyMatcher(fn:(a,b)=>boolean){
        this.keyMatcher=fn
        return this
    }
    setEventSplitter(s){
        this.eventSplitter=s
        return this
    }
    static eachEvent(iteratee:(eventObj:Evented,eventsDataObj:EventsDataObj,name,callback,context?,args?)=>any,eventObj:Evented,name,callback,context?,args?){
       let names= name.split(eventObj.eventSplitter)
       for(let i=0;i<names.length;++i){
          iteratee(eventObj,eventObj.eventObj,names[i],callback,context,args)
       }
    }
    static onApi(eventObj:Evented,eventsDataObj:EventsDataObj,name,callback,context?){
        if(_.isFunction(callback)){
            let handlers=eventsDataObj[name] || (eventsDataObj[name]=[])
            let handler={
                callback,context
            }
            let isFind=_.some(handlers,h=>h.callback.toString()==callback.toString()&&h.context==context)
            if(isFind){
                return eventObj
            }else{
                handlers.push(handler)
                return eventObj
            }
        }
    }
    static offApi(eventObj:Evented,eventsDataObj:EventsDataObj,key,callback?,context?){
        _.each(eventsDataObj,(v,k)=>{
            if(eventObj.keyMatcher(k,key)){
                if(_.isFunction(callback)){
                     eventsDataObj[k]=_.reject(v,handle=>handle.callback.toString()==callback.toString()&&handle.context==context)
                }else{
                    eventsDataObj[k]=[]
                }
            }
        })
        return eventObj
    }
    static onceApi(eventObj:Evented,eventsDataObj:EventsDataObj,key,callback,context?){
        if(_.isFunction(callback)){
            let newCallback=(...args)=>{
                callback.apply(context,args)
                eventObj.off(key,callback,context)
            }
            eventObj.on(key,newCallback,null)
        }
    }
    static triggerApi(eventObj:Evented,eventsDataObj:EventsDataObj,key,callback,context?,args?){
         _.each(eventsDataObj,(v,k)=>{
             if(eventObj.keyMatcher(k,key)){
                 _.each(v,v=>v.callback.apply(v.context,args))
             }
         })
    }
    on(keys,callback,context?){
        Evented.eachEvent(Evented.onApi,this,keys,callback,context)
        return this
    }
    off(keys,callback?,context?){
        Evented.eachEvent(Evented.offApi,this,keys,callback,context)
        return this
    }
    once(keys,callback,context?){
        Evented.eachEvent(Evented.onceApi,this,keys,callback,context)
        return this
    }
    trigger(keys,...args){
        Evented.eachEvent(Evented.triggerApi,this,keys,null,null,args)
        return this
    }
    fire(keys,...args){
         Evented.eachEvent(Evented.triggerApi,this,keys,null,null,args)
         return this
    }


}
export class   EventBus extends Evented{
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
         _.chain(this.eventBusChildren).filter(c=>e.eventId!=c.eventId).each(c=>c.handleEventMessage(e))
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
          c.eventBusParent=this
          this.addChildrenEventBus(c)
    }
}