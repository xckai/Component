import { JView, IJViewOption } from './JView';
import _ = require("lodash")
import { Evented, IEvented } from "./Evented";

export interface IJControllerConfig extends IJViewOption{
    id?:string
}
export class JController extends Evented{
    constructor(c?:IJControllerConfig){
        super()
        let config=_.pick(c,"id")
        this.config=_.extend(this.defaultConfig(),config)
        this.contents={}
        this.initView(_.extend(this.config,c))
    }
    getNode$(){
        return this.view.getNode$()
    }
    id:string
    defaultConfig():IJControllerConfig{
        return {id:_.uniqueId("controller")}
    }
    initView(c?:IJControllerConfig){
        this.view=new JView(c)
    }
    config:IJControllerConfig
    view:JView
    style(k,v?){
        this.view.style(k,v)
    }
    private contents:{
        [k:string]:JController
    }
    addContent(c:JController){
        this.contents[c.id]=c
        this.getNode$().append(c.getNode$())
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