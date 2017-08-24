import { JComponent } from './../../../Jigsaw/Core/JComponent';
import { BusPanel } from './../Controller/BusPanal';
import { OverViewPanal } from './../Controller/OverViewPanal';
import _ = require("lodash")
export class OverViewComponent extends JComponent{
    mainView:OverViewPanal
    busView:BusPanel
    busView2:BusPanel
    busView3:BusPanel
    init(){
        this.view.addClass("overview-component")
        this.mainView=new OverViewPanal({position:"absolute",left:"0px",right:"0px",top:"0px",height:"24rem"},this)
    }
}