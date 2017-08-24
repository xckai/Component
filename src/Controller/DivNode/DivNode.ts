import {JController } from "../../Jigsaw/Core/JController";
import { Evented } from "../../Jigsaw/Core/Evented";
import _=require("lodash")
export class DivNode extends JController {
    constructor(c?){
        super(c)
    }
    defaultConfig(){
        return _.extend(super.defaultConfig(), {tagName:"div"})
    }
    
}
    