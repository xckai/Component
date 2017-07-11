import _ = require('underscore');
import { W } from './DS';
import L= require("leaflet")
import {View} from "../../Core/View"
import {Component,IComponentConfig} from "../../Core/Component"
import { Layer,layerFactor } from './Layers';
export class Style{
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
    line(opt, options2) {
             return this.add("line", opt, options2);

         }
    circle (opt, options2) {
             return this.add("circle", opt, options2);
         }
    polygon (opt, options2) {
             return this.add("polygon", opt, options2);

         }
    text (opt, options2) {
             return this.add("text", opt, options2);
         }
    marker (opt, options2) {
             return this.add("marker", opt, options2);
         }
}
export interface ILayerConfig{
    selectable:boolean,
    url:string,
    name:string
    leafletLayerOption:L.LayerOptions
    visible:boolean
}
export interface IMap{
    getLeaflet():L.Map
    getContext():any
    getLeafletControl():L.Control.Layers
    addToLeafletControl(layer,id):any
  
}
export class G2Map  extends Component implements IMap{
     constructor(conf?){
        super(conf)
        this.config=_.extend({zoomControl:true},conf)
        this.map=new MapView(this.config)
        this.rootView.render()
        this.map.appendAt(this.rootView.getNode$())
    }
    config:IMapConfig
    map:MapView
    getLeaflet(){
        return this.map.leaflet
    }
    getContext(){
        return {}
    }
    getLeafletControl(){
        return this.map.control
    }
    layer(id,options?){
        let l=_.find(this.layers,(l)=>l._id==id)
        if(!l){
           l=layerFactor(this,id,options)
        }
        return l
    }
    private layers:Layer []
    addToLeafletControl(layer,id){
        this.map.control.addOverlay(layer,id)
        this.map.control.addTo(this.map.leaflet)
    }
    setMapSetting(s){
        this.map.setMapSetting(s)
        return this
    }
    
}
 class MapView extends View {
    constructor(conf?){
        super(conf)
        if(conf){
              this.mapSetting=_.extend({center:{lat:0,lng:0},zoom:8,scrollWheelZoom:true},conf)
        }else{
              this.mapSetting=_.extend({center:{lat:0,lng:0},zoom:8,scrollWheelZoom:true})
        }
      
        this.style({
            position: "absolute",
            left: "0px",
            right: "0px",
            top: "0px",
            bottom: "0px"
        })
    }
    mapSetting: IMapSetting
    leaflet: L.Map
    control:L.Control.Layers
    onAfterRender() {
        this.leaflet=L.map(this.el,_.pick(this.mapSetting,"scrollWheelZoom","zoomControl"))
        this.control=L.control.layers()
        this.leaflet.setView(this.mapSetting.center,this.mapSetting.zoom)
    }
    setMapSetting(s){
        this.leaflet.invalidateSize()
        this.mapSetting=_.extend({},this.mapSetting,s)
        this.leaflet.setView(this.mapSetting.center,this.mapSetting.zoom)
        return this
    }
}
interface IMapConfig {
    zoomControl:boolean
}
interface IMapSetting {
    center: { lat: number, lng: number },
    zoom: number,
    scrollWheelZoom:boolean
}