import { Controller } from "../../Core/Controller";
import {  IControllerView } from "../../Core/IView";

export class ControllerView extends Controller implements IControllerView {
    id:string
    initView(){
        return this
    }
    getNode$(){
        return this.view.getNode$()
    }
    render(){
        this.view.render()
        return this
    }
    style(k,v){
        this.view.style(k,v)
        return this
    }
    addClass(c){
        this.view.addClass(c)
        return this
    }
    removeClass(c){
        this.view.removeClass(c)
        return this
    }
    setBusy(b:boolean){
        this.view.setBusy(b)
        return this
    }
}