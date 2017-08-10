import { IControllerConfig, Controller, } from "../../Core/Controller";
import { Evented } from "../../Core/Evented";
import _=require("lodash")
export class DivNode extends Controller {
    constructor(c?){
        super(c)
        this.id=_.uniqueId("icon-")
    }
    defaultConfig(){
        return {tagName:"div"}
    }
    
}
    