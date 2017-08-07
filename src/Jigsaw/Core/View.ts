import Backbone = require('backbone');
import _ = require("lodash")
import { Util } from "../Utils/Util"
import { Model } from "./Model";
export interface IViewConfig {
    tagName?: string | null | undefined,
    className?: string | null | undefined,
    el?: HTMLElement | SVGAElement,
    $el?: JQuery | undefined,
    model?:Model
    class?:string
    position?:string,
    left?:string,
    right?:string,
    top?:string,
    bottom?:string
    width?:string
    height?:string
}
export class View extends Backbone.View<Backbone.Model>{
    constructor(conf?:IViewConfig) {
        super(_.extend({tagName:"div"},conf))
        let styleObj=_.pick(conf,"left","position","right","top","bottom","width","height")
        this.style(styleObj)
        this.addClass(_.pick(conf,["class"])["class"])
    }
getNode$() {
    return this.$el
}
getNode() {
    return this.el
}
getContentNode() {
    return this.el
}
getContentNode$() {
    return this.$el
}
attr(obj) {
    this.$el.attr(obj)
    return this
}
style(obj) {
    _.each(obj, (v: string, k: string) => {
        if (v) {
            this.$el.css(k, v)
        } else {
            this.$el.css(k, "")
        }
    })

    return this
}
setClass(cls: string) {
    //this.$el.removeClass()
    if (_.isArray(cls)) {
        _.each(cls, (v: string) => {
            this.$el.addClass(v)
        })
    }
    if (_.isString(cls)) {
        this.$el.addClass(cls)
    }
}
addClass(cls) {
    if (cls) {
        this.$el.addClass(cls)
    }
    return this
}
removeClass(cls) {
    this.$el.removeClass(cls)
    return this
}
toogleClass(cls) {
    this.$el.toggleClass(cls)
    return this
}
appendAt(dom) {
    this.invokeBeforeRender()
    this.render()
    this.getNode$().appendTo(dom)
    this.invokeAterRender()
}
onAfterRender() { }
onBeforeRender() { }
invokeAterRender() {
    if (this.onAfterRender) {
        this.onAfterRender()
    }
    return this
}
invokeBeforeRender() {
    if (this.onBeforeRender) {
        setTimeout(() => {
            this.onBeforeRender()
        })

    }
}
setModel(m) {
    this.model = m
    this.listenTo(this.model, "change", this.render)
    return this
}
doRender() {
    this.invokeBeforeRender()
    this.render()
    this.invokeAterRender()
}
setBusy(busy: boolean, size ?) {
    if (busy) {
        this.$el.append(Util.loader.genBallBusy(size || .5))
    } else {
        this.$(".busyContainer").remove()
    }
}
}