import {View} from "./View"
import {Model} from "./Model"
import _ =require("underscore")
export class Controller extends View{
    constructor(conf?){
        super(conf)
        this.model=new Model()
    }
    setData(k,v?){
        if(v!=undefined){
            this.model.set(k,v)
        }else{
            if(_.isObject(k)){
                _.each(k,(vv,kk)=>{
                    this.model.set(kk,vv)
                })
            }
        }
        return this
    }
    getData(k?){
        if(k==undefined){
             return this.model.toJSON()
        }else{
            return this.model.get(k)
        }       
    }
    model:Model
}