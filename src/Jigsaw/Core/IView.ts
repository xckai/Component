import _ = require("lodash")
import { IEvented } from "./Evented";
export interface IViewConfig {
    tagName?:string
    class?: string
    position?: string,
    left?: string,
    right?: string,
    top?: string,
    bottom?: string
    width?: string
    height?: string
}
export interface IView extends IEvented{
    updateView(c?:IViewConfig):this
    render():any
    getNode$():JQuery
    style(k,v?):this
    attr(k,v?):this
    addClass(c:string):this
    removeClass(c:string):this
}

