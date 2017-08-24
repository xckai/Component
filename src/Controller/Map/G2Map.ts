import { JController, IJControllerConfig } from '../../Jigsaw/Core/JController';
import _ = require("lodash")
import { W } from './DS';
import L= require("leaflet")
import { Layer,layerFactor } from './Layers';

export class Style {
    constructor(id,options?,defaultStyle?){
         this._id = id;
         this._symbolizers = [];
         this._defaultStyle = defaultStyle;
         if (options) {
             this._filter = options.filter;
         }
    }
    _id:string
    _symbolizers:any[]
    _defaultStyle:any
    _filter:any
    get(feature, cxt) {
             if (_.isFunction(this._filter)) {
                 if (!this._filter(W.unionPropertyOf(feature, cxt), feature, cxt))
                     return [];
             }
             return _.chain(this._symbolizers)
                 .filter(function (s) {

                     var filter = s.filter;
                     if (_.isFunction(filter)) {
                         return filter(W.unionPropertyOf(feature, cxt), feature, cxt);
                     } else {
                         return true;
                     }

                 }).value();
         }
    filter (f) {
             this._filter = f;
             return this;
         }


    add(type, opt?, extension?) {
             var obj = {
                 symbolizer: type
             };
            var self = this;
            if(_.isObject(type)){
                 this._symbolizers.push(type)
             }
             else if (_.isString(opt)) { // type, refId, extension

                 this._symbolizers.push(_.extend(obj, this._defaultStyle[opt], extension));
             } else if (_.isArray(opt)) { // type, refIds, extension
                 obj = _.chain(opt).reduce(function (memo, o) {
                     return _.extend(memo, self._defaultStyle[o]);
                 }, obj).value();
                 this._symbolizers.push(_.extend(obj, extension));
             }
            else { // type, option

                 this._symbolizers.push(_.extend(obj, opt));
             }
             return this;
        }
    line(opt, options2?) {
             return this.add("line", opt, options2);

         }
    circle (opt, options2?) {
             return this.add("circle", opt, options2);
         }
    polygon (opt, options2?) {
             return this.add("polygon", opt, options2);

         }
    text (opt, options2?) {
             return this.add("text", opt, options2);
         }
    marker (opt, options2?) {
             return this.add("marker", opt, options2);
         }
}
export interface ILayerConfig{
    selectable?:boolean,
    url?:string,
    name?:string
    leafletLayerOption?:L.LayerOptions
    visible?:boolean
    layerType?:string
    renderer?:string
}
export interface IMap{
    getLeaflet():L.Map
    getMapContext():any
   // getLeafletControl():L.Control.Layers
    addToLeafletControl(layer,id,type?):any
    removeFromLeafletControl(layer):any
}
export interface IMapSetting{
    center?: { lat: number, lng: number },
    zoom?: number,
    scrollWheelZoom?:boolean
}
export interface IMapConfig extends IJControllerConfig,IMapSetting{
     zoomControl?:boolean
}
export class G2Map  extends JController implements IMap{
     constructor(conf?:IMapConfig){
        super(conf)
        this.view.render()
        this.initMap()
        // this.config=_.extend({zoomControl:true},conf)
        // this.view=new MapView(this.config)
    }
    initMap(){
        this.leaflet=L.map(this.getNode$()[0],_.pick(this.config,"scrollWheelZoom","zoomControl"))
        this.control=new AutoHideLayerControl
        this.control.addTo(this.leaflet)
        this.control.updataStyle()
        this.leaflet.setView(this.config.center,this.config.zoom)
        setTimeout(()=>{
             this.leaflet.invalidateSize()
        })
    }
    leaflet:L.Map
    control:AutoHideLayerControl
    id:string
    defaultConfig():IMapConfig{
        return _.extend(super.defaultConfig(),{
            center:{lat:0,lng:0},zoom:8,scrollWheelZoom:true,zoomControl:true,id:_.uniqueId("map")
        })
    }
    getMapContext(){

    }
    config:IMapConfig
    getLeaflet(){
        return this.leaflet
    }

    // getLeafletControl(){
    //     return this.map.control
    // }
    layer(id,options?:ILayerConfig){
        let l=_.find(this.layers,(l)=>l._id==id)
        if(!l){
           l=layerFactor(this,id,options)
           this.layers.push(l)
        }
        return l
    }
    private layers:Layer []=[]
    addToLeafletControl(layer,id,layertype){
        if(layertype=="baselayer"){
            this.control.addBaseLayer(layer,id)
        }else{
             this.control.addOverlay(layer,id)
        }
        this.control.updataStyle()
       
    }
    removeFromLeafletControl(layer){
        this.control.removeLayer(layer)
        this.control.updataStyle()
    }
    
}
//  class MapView extends BackboneView {
//     constructor(conf?){
//         super(conf)
//         this.mapSetting=conf
//     }
//     mapSetting: IMapSetting
//     leaflet: L.Map
//     control:AutoHideLayerControl
//     render() {
//         this.leaflet=L.map(this.el,_.pick(this.mapSetting,"scrollWheelZoom","zoomControl"))
//         this.control=new AutoHideLayerControl
//         this.control.addTo(this.leaflet)
//         this.control.updataStyle()
//         this.leaflet.setView(this.mapSetting.center,this.mapSetting.zoom)
//         setTimeout(()=>{
//              this.leaflet.invalidateSize()
//         })
//         return this
//     }
//     setMapSetting(s:IMapSetting){
//         this.mapSetting=_.extend({},this.mapSetting,s)
//         this.leaflet.setView(this.mapSetting.center,this.mapSetting.zoom)
//          this.leaflet.invalidateSize()
//         return this
//     }
// }
class AutoHideLayerControl extends L.Control.Layers{
    updataStyle(){
        if(this._layers&&this._layers.length<=0){
            this.getContainer().style.display="none"
        }else{
            this.getContainer().style.display="initial"
        }
    }
    _layers:any []
}