import Backbone = require('backbone');
import _ = require("lodash")
import { Util } from "../Utils/Util"
import { IEvented } from "./Evented";
export interface IViewConfig {
    tagName?: string | null | undefined,
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
    initView(c?:IViewConfig):this
    render():any
    getNode$():JQuery
    style(k,v?):this
    addClass(c:string):this
    removeClass(c:string):this
}
export interface IControllerView extends IView{
    setBusy(busy:boolean):this
}
