import _ = require("lodash")
type IEventMessage={
    eventId:string,
    keys:string,
    args:any[]
}
interface IEvented{
    on(key:string,callback?:Function,ctx?:any)
    off(key:string,callback?:Function,ctx?:any)
}
type EventsDataObj={
    [key:string]:{callback:Function,context:Object|null|undefined}[]
}
export class Evented{
    eventId:string
    private eventObj:EventsDataObj={}
    private eventSplitter:any
    private eventSuffixSplitter:string
    constructor(){
        this.eventId=_.uniqueId("event-")
        this.setEventSplitter(" ")
        this.setEventSuffixSplitter(":")
    }
    private offKeyMatcher(objkey,key){
            if(key =="*"||key=="all"){
                return true
            }else{
                let reg=new RegExp("^"+key+":{1}|^"+key+"$")
                return reg.test(objkey)
            }
    }
    private triggerKeyMatcher(objkey,key){
            if(key=="*"||key=="all"||objkey=="*"||objkey=="all"){
                return true
            }else{
                key=key.split(this.eventSuffixSplitter)[0].trim()
                objkey=objkey.split(this.eventSuffixSplitter)[0].trim()
                return key==objkey
            }
    }
    setEventSplitter(s){
        this.eventSplitter=s
        return this
    }
    setEventSuffixSplitter(s){
        this.eventSuffixSplitter=s
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
            let isFind=_.some(handlers,h=>h.callback==callback&&h.context==context)
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
            if(eventObj.offKeyMatcher(k,key)){
                if(_.isFunction(callback)){
                     eventsDataObj[k]=_.reject(v,handle=>handle.callback==callback&&handle.context==context)
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
             if(eventObj.triggerKeyMatcher(k,key)){
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
