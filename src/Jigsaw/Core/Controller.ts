import _ = require("lodash")
import { Evented, IEvented } from "./Evented";
import { View, IViewConfig } from "./View";
export interface IControllerConfig{
    id?:string,
    class?:string
}
export interface IController extends IEvented{
    id:string|number
    defaultConfig():IControllerConfig
    getNode():HTMLElement|SVGAElement
    setBusy(b:boolean):this
    remove():this
    render():this
}
