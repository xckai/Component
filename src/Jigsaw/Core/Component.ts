import { View } from "./View"
import _ = require("lodash")
import { Util } from "../Utils/Util"
import { EventBus } from "./EventBus"
const getProperty = Util.getProperty
export class Component extends EventBus {
    constructor(conf?) {
        super()
        this.id = _.uniqueId("Component")
        this.initRootView(conf)

    }
    initRootView(conf) {
        this.rootView = new View(_.extend({ tagName: "section" }, conf))
        this.rootView.addClass("componentContainer")
    }
    rootView: View
    parent: Component
    children: { [id: string]: Component }
    id: string
    private context = {}
    deepExtend(...args) {
        return Util.deepExtend.apply(null, args)
    }
    getContext(k?) {
        if (this.parent) {
            if (k != undefined) {
                return _.extend(this.parent.getContext(k), this.context[k])
            } else {
                return _.extend(this.parent.getContext(), this.context)
            }
        } else {
            if (k != undefined) {
                return this.context[k]
            } else {
                return this.context
            }
        }
    }
    setContext(k, v) {
        this.context[k] = v
    }
    setStyle(s) {
        this.rootView.style(s)
        return this
    }
    addClass(c) {
        this.rootView.addClass(c)
        return this
    }
    removeClass(c) {
        this.rootView.removeClass(c)
    }
    addTo(c: Component, listen?) {
        this.parent = c
        this.parent.addChild(this,listen)
        return this
    }
    addChild(nc: Component,listen?) {
        if (!this.children) {
            this.children = {}
        }
        nc.parent = this
        if(listen ===undefined||listen==true){
            nc.observe(this)
        }
        this.children[nc.id] = nc
        nc.rootView.getNode$().appendTo(this.rootView.getNode$())
        return this
    }
    remove() {
        if (this.parent) {
            this.parent.removeChild(this)
        }
        this.rootView.remove()
        super.destroy()
    }
    removeChild(c: Component|string) {
        if(_.isString(c)||_.isNumber(c)){
            if(this.children[c]){
                this.children[c].remove()
            }
            this.children[c]=undefined
        }else{
            if(this.children[c.id]){
                this.children[c.id].remove()
            }
            this.children[c.id]=undefined
        }
        return this
    }
    setBusy(b) {
        this.rootView.setBusy(b)
    }
}
export interface IComponentConfig {
    className: string,
    class: string,
    $el: JQuery | null
    el: any | null,
    style: {
        position: string | null | undefined,
        left: string | null | undefined,
        right: string | null | undefined,
        top: string | null | undefined,
        bottom: string | null | undefined,
        width: string | null | undefined,
        height: string | null | undefined
    }
}