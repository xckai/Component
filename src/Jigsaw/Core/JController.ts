
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
        [k:string]:HTMLElement|SVGAElement|JQuery
    }
    addContent(c:HTMLElement|SVGAElement|JQuery,id?:string){
        if(id==undefined){
            id=$(c).attr("jviewid")
            if(!id){
                console.error("jviewid not assign")
            }
        }
        if(id){
            this.contents[id]=c
            this.view.getNode$().append(c)
        }
        return this
    }
    removeContent(id:string|HTMLElement|SVGAElement|JQuery){
        if(!_.isString(id)){
            id=$(id).attr("jviewid")
        }
        $(this.contents[id]).remove()
        delete this.contents[id]
        return this
    }
}