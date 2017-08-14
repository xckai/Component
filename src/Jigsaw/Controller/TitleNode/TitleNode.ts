import { JController, IJControllerConfig } from './../../Core/JController';
import { JView } from './../../Core/JView';
import _=require("lodash")

export interface ITitleNodeConfig extends IJControllerConfig{
    title?:string
}
class TitleView extends JView{
    constructor(c:ITitleNodeConfig){
        super(c)
        this.title=c.title
    }
    render(){
        this.$el.html(`<span>${this.title}</span>`)
        return this
    }
    title:string

}
export class TitleNode extends JController {
    constructor(conf?:ITitleNodeConfig){
        super(conf)
    }
    defaultConfig(){
        return _.extend(super.defaultConfig(),{title:"Title",id:_.uniqueId("title")})
    }
    initView(){
        this.view=new TitleView(this.config)
        this.view.addClass("title")
        this.view.render()
    }
    view:TitleView
    setTitle(t:string){
        this.view.title=t
        this.view.render()
    }
    
}
    