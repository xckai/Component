import {MainApp} from "./App"
declare var  window:any
let a=new MainApp({el:"#app"})
a.start()
 if(window.initLoader){
    window.initLoader.removeLoader()
}