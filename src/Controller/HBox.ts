import { JController, IJControllerConfig } from './../Jigsaw/Core/JController';
import _=require("lodash")
export interface HBoxConfig extends IJControllerConfig{
    content?:JController[]
}
export class HBox extends JController {
        constructor(c?:HBoxConfig,parent?:JController){
            super(c,parent)
            if(c.content){
                _.each(c.content,c=>this.addContent(c))
            }
            this.view.addClass("hbox-container")
        }
}