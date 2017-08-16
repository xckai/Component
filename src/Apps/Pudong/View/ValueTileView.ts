import { JView, IJViewOption } from './../../../Jigsaw/Core/JView';
import Mustache=require("mustache")
import _ = require("lodash")
export interface ITileConfig extends IJViewOption{
    title?:string,
    value?:string|number,
}
export class ValueTileView extends JView{
    constructor(c?:ITileConfig){
        super(c)
        this.config=c
        this.render()
    }
    config:ITileConfig
    template:string=`<div class="flex-item tile row-1 col-1 ">
            <div class="tile-title">{{title}}</div>
            <div class="tile-value">{{value}}</div>
        </div>`
    render(){
        this.$el.html(Mustache.render(this.template,this.config))
        this.addClass("value-tile")
        return this
    }
    update(c:ITileConfig){
        this.config=_.extend({},this.config,c)
        this.render()
    }
}