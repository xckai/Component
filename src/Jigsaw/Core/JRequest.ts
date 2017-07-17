import _=require("underscore")
import $ =require("jquery")
import { Evented } from "./Evented";
export class JPromise extends Evented {
    done(fn){
        this.on("done",fn)
        return this
    }
    fail(fn){
        this.on("fail",fn)
        return this
    }
    then(fn1,fn2){
        if(fn1){
            this.done(fn1)
        }
        if(fn2){
            this.fail(fn2)
        }
        return this
    }
    doDone(...args){
        this.fire.apply(this,["done"].concat(args))
    }
    doFail(...args){
        this.fire.apply(this,["fail"].concat(args))
    }
}
export function JWhenAll(...args){
    let promise=new JPromise()
    let acc=args.length
    let counter=0
    let rs=[]
    _.each(args,(jr:JRequest,i)=>{
        jr.on("done",(d)=>{
            rs[i]=d
            counter++
            if(counter==acc){
                promise.doDone.apply(promise,rs)
            }
        })
        jr.on("fail",(d)=>{
            promise.doFail(d)
        })
        jr.send()
    })
    return promise
}
export class JRequest extends JPromise{
    constructor(conf?){
        super()
        _.extend(this,conf)
    }
     url:string
     params:any
     method:string="GET"
     context:any
     data:any
    doneHander:any=(...args)=>{
        this.fire.apply(this,["done"].concat(args))
    }
    errorHander:any=(...args)=>{
        this.fire.apply(this,["fail"].concat(args))
    }
    changeDoneHandler(fn){
        this.doneHander=fn
        return this
    }
    handleDone(...args){
        let jRequest=this
        this.doneHander.apply(this,args)
    }
    handleError(...args){
        let jRequest=this
        this.errorHander.apply(this,args)
    }
    send(ctx?){
        $.ajax(this.buildUrl(ctx),{
            success:this.handleDone.bind(this),
            error:this.handleError.bind(this),
            method:this.method.toUpperCase(),
            data:JSON.stringify(this.buildData(ctx))
        })
    }
    
    buildUrl(ctx?){
        let us=[]
        _.each(_.extend({},this.params,_.pick.apply(null,[this.context].concat(_.keys(this.params))),_.pick.apply(null,[ctx].concat(_.keys(this.params)))),(v:any,k)=>{
            if(_.isArray(this.params[k])){
                _.each(v,(vv)=>{
                      us.push(`${k}=${vv}`)
                })
            }else{
                 us.push(`${k}=${v}`)
            }
        })
        let base=us.length>0?this.url+"?":this.url
        
        return base+us.join("&")
    }
    buildData(ctx?){
       return   _.extend({},this.data,_.pick.apply(null,[this.context].concat(_.keys(this.data))),_.pick.apply(null,[ctx].concat(_.keys(this.data))))
    }
    setContext(c){
        this.context=_.extend({},this.context,c)
        return this
    }


}
