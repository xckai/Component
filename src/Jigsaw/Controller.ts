import { Evented } from './Evented';
import {View} from "./View"
import {Model} from "./Model"
import _ = require('underscore');
export class Controller extends Evented{
    constructor(conf?){
        super()
    }
    toHtml(){
        return this.view.el
    }
    appendTo(d){
        this.view.$el.appendTo(d)
    }
    model:Model
    view:View
}