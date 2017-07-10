import { Style ,ILayerConfig,IMap} from './G2Map';

import _ = require('underscore');
import { W } from './DS';
import * as leaflet from 'leaflet';
export class Layer{
    constructor(map,id,options?){
        this.map=map
        
        this._styles = {}
        this._id=id
        this._config=_.extend({},this.defaultConfig(),options)
        this.initLayer()
    }
    setContext(c){
        this._cxt=_.extend(this._cxt,c)
    }
    getContext(c?){
        let mapContext=this.map?this.map.getContext():{}
        return _.extend({},mapContext,this._cxt,c)
    }
    defaultConfig(){
        return {
            selectable:false,
            url:"",
            name:"layer",
            leafletLayerOption:{}
        }
    }
    _id:string
    _styles:{[k:string]:Style}
    _defaultStyle:Style
    _config:ILayerConfig
    _cxt:any={}
    map:IMap
    _leafletLayer:L.Layer
    _leaflet:L.Map
    _data:any
    setData(d){
        this._data=d
    }
    getData(){
        return this._data
    }
    visible(){
        if (this.map.getLeaflet()) {
                 return this.map.getLeaflet().hasLayer(this._leafletLayer);
            } else {
                 return false;
            }
    }
    show(){
        if(!this.visible()){
            this._leafletLayer.addTo(this.map.getLeaflet())
        }
    }
    hide(){
        if (this.visible()) {
                 this._leafletLayer.remove();
        }
    }
    // features(){
    //     return this._data
    // }
    render(data,cxt:{extent:any [],zoom:any},painter){
             var mercator = W.mercator(256);
             var transform = function (pt) {
                 return mercator.lonLat2Pixel(pt,cxt.extent, cxt.zoom);

             };
             var splitted = W.splitByTags(data.features);
             splitted = _.reduce(this.getData(), function (memo, fc:any) {
                 var mapped = fc.map(function (feature) {
                     return feature.clone()
                         .paths(_.map(feature.paths(), function (i) {
                             return _.map(i, transform);
                         })).value();
                 });
                 memo.push({
                     tag: fc.tag(),
                     items: mapped
                 });
                 return memo;
             }, splitted);
             var self = this;
        

             var i;
             for (i = 0; i < 2; i++) {
                 _.each(splitted,  (l:any, ix)=>{
                     let r=_.chain(l.items)
                         .reduce((memo, g)=>{
                                var style = this.style(l.tag);
                                if (!style)
                                    return memo;
                                var symbols = style.get(g, cxt);
                                _.chain(symbols)
                                    .filter(function (s) {
                                        return (i === 0) ? s.symbolizer !== "text" : s.symbolizer === "text";
                                    })
                                    .each(function (style) {

                                       var s=new W.Wrapper<Style,any>(style,W.unionPropertyOf(g,cxt),g,cxt)
                                        memo.push({
                                            g: g,
                                            s: s,
                                            z: s.value("z",0)
                                        })
                                    });
                                return memo
                         }, [])
                         _.chain(r.value()).sortBy("z")
                                            .each(function (instruction) {
                                                painter.paint(instruction.g, instruction.s, cxt);
                                            })

                 });
             }
    }
    style(id?, p?) {
             var self = this;
             if (!id) {
                 return this._styles["*"];
             } else if (id && !_.isString(id)) { //default style
                 this._defaultStyle = id;
             } else {
                 if (!_.has(this._styles, id)) {
                     if (_.isString(p)) {
                         this._styles[id] = this._styles[p];
                     } else {

                         this._styles[id] = new Style(id, p, this._defaultStyle);
                     }
                 } else if (_.isObject(p)) {
                     this._styles[id].add(p);
                 } else if (p) { // reference
                     this._styles[id] = this._styles[p];
                 }
                 return this._styles[id];
             }
         }
    initLayer(){
        this._leaflet=this.map.getLeaflet()
        this._leafletLayer=this.createLeafletLayer()
        if(this._config.visible){
            this._leafletLayer.addTo(this._leaflet)
        }
        if(this._config.selectable){
           this.map.addToLeafletControl(this._leafletLayer,this._id)
          
        }
    }
    createLeafletLayer():L.Layer{
        return L.tileLayer(W.buildUrl(this._config.url,this.getContext()),this._config.leafletLayerOption)
    }

}
export class PngLayer extends Layer{
    createLeafletLayer():L.Layer{
        return L.tileLayer(W.buildUrl(this._config.url,this.getContext()),this._config.leafletLayerOption)
    }
}
export class CanvasLayer extends Layer {
    painter(canvasDom){
        return null
    }
    createLeafletLayer(){
            let l=this
            let CanvasTile =  class CanvasTile extends L.GridLayer{
            createTile(tilePoint,done){
               
                     // create a <canvas> element for drawing
                     var canvasTile = L.DomUtil.create('canvas', 'leaflet-tile');
                     // setup tile width and height according to the options
                     var tileSize = this.getTileSize();
                     canvasTile.style.width = tileSize.x+"px";
                     canvasTile.style.height = tileSize.y+"px";
                     var zoom = tilePoint.z;
                     // draw something asynchronously and pass the tile to the done() callback

                     var ext = W.tile2bounds(tilePoint.x, tilePoint.y, tilePoint.z);
                     let ctx={zoom,extent:ext}
                     //cxt.putAll(self.parameters);
                     if(!l._config.url){
                         setTimeout(()=>{
                             l.render({},l.getContext(ctx),l.painter(canvasTile))
                              done(false,canvasTile)
                         },10)
                     }else{
                         W.doGet(l._config.url,l.getContext(ctx)).done((data)=>{
                           let fs= W.toGeometries(data,ext,zoom)
                           l.render(fs,l.getContext(ctx),l.painter(canvasTile))
                           done(false,canvasTile)
                         })
                     }
                     return canvasTile;
                 } 
            }
            return new CanvasTile
        }          
}
export function layerFactor(map,id,options){
    if(options.renderer=="canvas"){
        return new CanvasLayer(map,id,options)
    }else if(options.renderer=="png"){
        return new PngLayer(map,id,options)
    }
}