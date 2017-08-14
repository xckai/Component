
import { IControllerConfig, Controller } from "../../Core/Controller";
import _=require("lodash")
import { BackboneView } from "../../Core/View";

export interface ITileConfig extends IControllerConfig{
    title?:string,
    value?:string,
    row?:number,
    col?:number
}
class TileView extends BackboneView{
    constructor(c:ITileConfig){
        super(c)
        this.title=c.title
    }
    render(){
        this.$el.html(`<div class="tile row-1 col-1 flex-item">
                            <div class="tile-title">{{title}}</div>
                            <div class="tile-value">{{value}}</div>
                      </div>`)
        return this
    }
    title:string

}
export class TitleNode extends Controller {
    constructor(conf?:ITileConfig){
        super(conf)
        this.id=_.uniqueId("tile-")
    }
    defaultConfig(){
        return _.extend(super.defaultConfig(),{row:1,col:1})
    }
    config:ITileConfig
    init(){
        this.view=new TileView(this.config)
        this.view.addClass("tile")
        this.view.addClass(`row-${this.config.row} col-${this.config.col}`)
    }
    view:TileView    
}
    