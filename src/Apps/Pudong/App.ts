import {App} from "../../Jigsaw/Core/App"
import {NavBar} from "../../Jigsaw/Controller/Bar/NavBar"

export class MainApp extends App{
    constructor(conf?){
        super(conf)
        this.initApp()
    }
    initApp(){
        this.addRule("*path","Main",this.proxy("Main"))
    }
    bar:NavBar
   // rightSide:Side
    Main(){
        this.router.navigate("Pudong/",{trigger: false, replace: true})
        this.bar=new NavBar()
        this.rootView.$el.append(this.bar.view.$el)
    }

}