import { JView, IJViewOption } from './../../../Jigsaw/Core/JView';
import Mustache=require("mustache")
import _ = require("lodash")
export interface ITileConfig extends IJViewOption{
    title?:string,
    value?:string|number,
    row?:number,
    col?:number
}
export class TileView extends JView{
    constructor(c?:ITileConfig){
        super(c)
        this.config=_.extend({row:1,col:1},c)
    }
    config:ITileConfig
    template:string=`<div class="row-{{row}} col-{{col}} ">
            <div class="tile-title">{{title}}</div>
            <div class="tile-value">{{value}}</div>
        </div>`
    render(){
        this.$el.html(Mustache.render(this.template,this.config))
        this.addClass("flex-item tile")
        return this
    }
    update(c:ITileConfig){
        this.config=_.extend({},this.config,c)
        this.render()
    }
}