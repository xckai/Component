import {Component} from"../../Jigsaw/Component"
import {Controller} from"../../Jigsaw/Controller"
import { View } from "../../Jigsaw/View"
class Title extends Controller{
    
}
export class NavBar extends Component{
    constructor(conf?){
        super(conf)
        this.setConfig({
           style:{
                display:"flex",
                bottom:null,
                heigth:"3rem"
           },
           class:["NavBar"]
        })
        
    }
}
