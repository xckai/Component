import {BaseDrawer,PointDrawer}from '../../../Jigsaw/Component/Map/MapDrawer'
import { API } from "../APIConfig";
export class RouterPicker extends PointDrawer {
    begin(){
        if(this.interactiveLayer){
            this.drawing=true;
            this.interactiveLayer.on("click",this.onClick,this);
            this.interactiveLayer.on("dblclick",this.onDbclick,this);
            this.interactiveLayer.on("mousemove",this.onMouseMove,this);
            //this.map.dragging.disable();
            this.map.doubleClickZoom.disable(); 
        }
    }
    onClick(e:L.MouseEvent){

        if(this.latlngs && this.latlngs.length>0){
            this.latlngs.push(e.latlng);
            this.fire("to",{latlngs:this.latlngs});
            this.endDraw()
        }else{
            this.latlngs=[];
            this.latlngs.push(e.latlng);
            this.fire("from",{latlngs:this.latlngs});
            this.fire("drawbegin",{latlngs:this.latlngs});
        }
    }
}
export class RoadPicker extends BaseDrawer{
    baseUrl:string
    oldLatlng:any
    latlng:any
    marker:L.Marker
    path:L.Polyline
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
        API.getRoad(this.oldLatlng.lat,this.oldLatlng.lng).done((d)=>{
            if(!d.point||!d.path){
                this.fire("fail")
            }else{
                this.fire("drawend",d)
            }
        }).fail(()=>{
            this.fire("fail")
        })
        // $.get(this.baseUrl+`lng=${this.oldLatlng.lng}&lat=${this.oldLatlng.lat}`)
        // .done((d)=>{
        //     let f=new FeatureCollection(d)
        //     if(_.isEmpty(f.getPoint())||_.isEmpty(f.getPolyline())){
        //         this.fire("fail")
        //     }else{
        //         this.fire("drawend",{
        //             point:_.first(f.getPoint()).getleafletCoorinates(),
        //             path:_.first(f.getPolyline()).getleafletCoorinates(),
        //             roadNum:_.first(f.getPolyline()).getProperty("properties/AVGLANES"),
        //             name:_.first(f.getPolyline()).getProperty("properties/NAME"),
        //             id:_.first(f.getPolyline()).getProperty("properties/ID"),
        //         })
        //     }
           
        // })
        // .fail((d)=>{
        //     this.fire("fail",null)
        // })
    }
}