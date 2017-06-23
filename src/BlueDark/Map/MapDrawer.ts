import { Evented} from "../../Jigsaw/Evented";
import L=require("leaflet")
class BaseDrawer extends Evented{
    map:L.Map
    drawing:boolean
    drawOn(m:L.Map){
        this.map=m
        this.fire("begindraw")
        return this
    }
    setMap(m:L.Map){
        this.map=m
    }
}
export class PointDrawer extends BaseDrawer{
    constructor(){
        super()
        this.on("begindraw",this.beginDraw.bind(this))
    }
    latlngs:L.LatLng[]=[]
    beginDraw(){
        if(this.map){
            this.drawing=true;
            this.map.on("click",this.onClick,this);
            this.map.on("dblclick",this.onDbclick,this);
            this.map.on("mousemove",this.onMouseMove,this);
            this.map.dragging.disable();
            this.map.doubleClickZoom.disable(); 
        }
    }
    cancelDraw(){
        this.fire("cancel")
        this.endDraw(true)
    }
    protected onClick(e:L.MouseEvent){
        if(this.latlngs && this.latlngs.length>0){
            this.latlngs.push(e.latlng);
            this.fire("drawing",{latlngs:this.latlngs});
        }else{
            this.latlngs=[];
            this.latlngs.push(e.latlng);
            this.fire("drawbegin",{latlngs:this.latlngs});
        }
    }
   protected onDbclick(e:L.MouseEvent){
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
        this.endDraw();
    }
    protected  onMouseMove(e:L.MouseEvent){
         if(this.latlngs.length>0){
           this.fire("drawing",{latlngs:this.latlngs.concat(e.latlng)})
        }
    }
    endDraw(cancled?){
        this.map.off("click",this.onClick,this);
        this.map.off("dblclick",this.onDbclick,this);
        this.map.off("mousemove",this.onMouseMove,this);
        this.latlngs=[];
        this.drawing=false;
        this.map.dragging.enable();
        this.map.doubleClickZoom.enable(); 
        // var self=this;
        // setTimeout(function(){
        //     self.map.doubleClickZoom.enable(); 
        // },100)
        if(!cancled){
             this.fire("drawend",{latlngs:this.latlngs});
        }
    }
}
