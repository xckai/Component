import { Evented} from "../../Jigsaw/Core/Evented";
import L=require("leaflet")
export class BaseDrawer extends Evented{
    map:L.Map
    interactiveLayer:L.Layer 
    drawing:boolean
    drawOn(m:L.Map){
        this.map=m
        this.fire("begindraw")
        return this
    }
    setMap(m:L.Map){
        this.map=m
    }
    setInteractiveLayer(l:L.Layer){
        this.interactiveLayer=l
        return this
    }
}
export class PointDrawer extends BaseDrawer{
    constructor(){
        super()
        this.on("begindraw",this.begin,this)
    }
    latlngs:L.LatLng[]=[]
    begin(){
        if(this.interactiveLayer){
            this.drawing=true;
            this.interactiveLayer.on("click",this.onClick,this);
            this.interactiveLayer.on("dblclick",this.onDbclick,this);
            this.interactiveLayer.on("mousemove",this.onMouseMove,this);
            this.map.dragging.disable();
            this.map.doubleClickZoom.disable(); 
        }
    }
    cancel(){
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
        if(!cancled){
             this.fire("drawend",{latlngs:this.latlngs});
        }
        this.interactiveLayer.off("click",this.onClick,this);
        this.interactiveLayer.off("dblclick",this.onDbclick,this);
        this.interactiveLayer.off("mousemove",this.onMouseMove,this);
        this.latlngs=[];
        this.drawing=false;
        this.map.dragging.enable();
        this.map.doubleClickZoom.enable(); 
        // var self=this;
        // setTimeout(function(){
        //     self.map.doubleClickZoom.enable(); 
        // },100)
        
    }
}
export class RoadPicker extends BaseDrawer{
    baseUrl:string
    oldLatlng:any
    latlng:any
    marker:L.Marker
    path:L.Polygon
    paths:any[]
    begin(){
       if(this.interactiveLayer){
            this.interactiveLayer.on("click",this.onclick,this)
       }
    }
    end(){
        if(this.interactiveLayer){
            this.interactiveLayer.off("click",this.onclick,this)
        }
    }
    cancel(){
        if(this.interactiveLayer){
            this.interactiveLayer.off("click",this.onclick,this)
        }
    }
    private onclick(e:L.MouseEvent){
        this.drawing=true
        this.fire("drawing",e)
        this.oldLatlng=e.latlng
        this.fetch()
    }
    fetch(){
        this.fire("fetching")
        $.get(this.baseUrl+`lng=${this.oldLatlng.lng}&lat=${this.oldLatlng.lat}`)
        .done((d)=>{
            this.fire("drawend",d)
            
        })
        .fail((d)=>{
            this.fire("cancel",null)
        })
    }
}
