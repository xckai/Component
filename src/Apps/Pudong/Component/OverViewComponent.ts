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
        this.mainView=new OverViewPanal({position:"absolute",left:"0px",right:"0px",top:"0px",height:"30%"})
        this.addContent(this.mainView)

        this.busView=new BusPanel({position:"absolute",left:"0px",top:"30%",bottom:"0",width:"calc(33.3333% - 2rem)"})
        this.addContent(this.busView)
        this.busView.setActive()

        this.busView2=new BusPanel({position:"absolute",left:"33.3333%",top:"30%",bottom:"0",width:"calc(33.3333% - 2rem)"})
        this.addContent(this.busView2)

        this.busView3=new BusPanel({position:"absolute",left:"66.6666%",top:"30%",bottom:"0",width:"calc(33.3333% - 2rem)"})
        this.addContent(this.busView3)
    }
}