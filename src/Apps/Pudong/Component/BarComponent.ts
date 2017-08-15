import { IJControllerConfig } from './../../../Jigsaw/Core/JController';
import { JView } from './../../../Jigsaw/Core/JView';
import _ = require("lodash")
import { DivNode } from "../../../Jigsaw/Controller/DivNode/DivNode";
import { TitleNode } from "../../../Jigsaw/Controller/TitleNode/TitleNode";
import { JComponent } from "../../../Jigsaw/Core/JComponent";
export interface BarComponentConfig extends IJControllerConfig{
    title?:string
}

export class BarComponent extends JComponent{
    constructor(c?:BarComponentConfig,parent?,autoAppend?,listen?){
        super(c,parent,autoAppend,listen)
        // this.bar=new Container({position:"absolute",left:"0px",right:"0px",bottom:"0px",top:"0px",class:"navbar"})
        // this.addController(this.bar)
        this.mainIcon=new DivNode({class:"sap-logo"})
        this.addContent(this.mainIcon)
        this.title=new TitleNode(_.pick(this.config,"title"))
        this.addContent(this.title)
        // this.bar.addController(this.title)
        // this.on("titleChange",(d)=>{
        //     setTimeout(()=>{
        //         this.title.setTitle(d.title)
        //     },800);
        // })
    }
    config:BarComponentConfig
    defaultConfig(){
       return _.extend(super.defaultConfig(),{left:"0px",right:"0px",height:"3rem",top:"0px",position:"absolute",title:"交通概况",class:"bar-component"})
    }
    mainIcon:DivNode
    title:TitleNode
}