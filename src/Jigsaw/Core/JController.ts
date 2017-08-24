import { JView, IJViewOption } from './JView';
import _ = require("lodash")
import { Evented, IEvented } from "./Evented";

export interface IJControllerConfig extends IJViewOption{
    id?:string
}
export class JController extends Evented{
    constructor(c?:IJControllerConfig,parent?:JController){
        super()
        this.config=_.extend(this.defaultConfig(),c)
        this.contents={}
        this.id=this.config.id
        this.initView()
        this.init()
        if(parent){
            parent.addContent(this)
        }
    }
    init(){}
    getNode$(){
        return this.view.getNode$()
    }
    getContentNode$(){
        return this.view.getNode$()
    }
    id:string
    defaultConfig():IJControllerConfig{
        return {id:_.uniqueId("controller")}
    }
    initView(){
        this.view=new JView(this.config)
    }
    config:IJControllerConfig
    view:JView
    style(k,v?){
        this.view.style(k,v)
    }
    protected contents:{
        [k:string]:JController
    }
    addContent(c:JController){
        if(!c.id){
            console.error("Controller no id",c)
        }else{
            this.contents[c.id]=c
            this.getNode$().append(c.getNode$())
        }
      
        return this
    }
    removeContent(id:string|JController){
        if(!_.isString(id))
            id=id.id
            
        if(this.contents[id])
            this.contents[id].remove()
        delete this.contents[id]
        return this
    }
    remove(){
        this.view.$el.remove()
    }
}