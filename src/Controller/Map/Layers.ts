import { Style, ILayerConfig, IMap } from './G2Map';

import _ = require("lodash")
import { W } from './DS';
import * as leaflet from 'leaflet';
import { Painter, CanvasBrush, IBrush } from "./Painter";
export class Layer {
    constructor(map, id, options?) {
        this.map = map

        this._styles = {}
        this._id = id
        this._config = _.extend({}, this.defaultConfig(), options)
        this.initLayer()
    }
    setContext(c) {
        this._cxt = _.extend(this._cxt, c)
    }
    getContext(c?) {
        let mapContext = this.map ? this.map.getMapContext() : {}
        return _.extend({}, mapContext, this._cxt, c)
    }
    defaultConfig() {
        return {
            selectable: false,
            url: "",
            name: "layer",
            leafletLayerOption: {}
        }
    }
    _id: string
    _styles: { [k: string]: Style }
    _defaultStyle: Style
    _config: ILayerConfig
    _cxt: any = {}
    map: IMap
    _features = {}
    _leafletLayer: L.Layer
    _leaflet: L.Map
    _data: any
    _controlLayersNum = 0
    setData(d) {
        this._data = d
    }
    getData() {
        return JSON.parse(JSON.stringify(this._data))
    }
    visible() {
        if (this.map.getLeaflet()) {
            return this.map.getLeaflet().hasLayer(this._leafletLayer);
        } else {
            return false;
        }
    }
    show() {
        if (!this.visible()) {
            this._leafletLayer.addTo(this.map.getLeaflet())
        }
        return this
    }
    hide() {
        if (this.visible()) {
            this._leafletLayer.remove();
        }
        return this
    }
    removeFromControl() {
        this.map.removeFromLeafletControl(this._leafletLayer)
        return this
    }
    addToControl(layerType?) {
        this.map.addToLeafletControl(this._leafletLayer, this._id, layerType)
        return this
    }
    redraw(isShow?: boolean) {
        if (this.visible()) {
            this._leafletLayer.remove()

            this.show()
        }
        if (isShow) {
            this.show()
        }

    }
    // features(){
    //     return this._data
    // }
    getFeatures() {

    }
    features(tag?) {
        if (tag != undefined) {
            if (this._features[tag] == undefined) {
                this._features[tag] = []
            }
            return this._features[tag]
        } else {
            return this._features
        }
    }
    render(data, cxt: { extent: any[], zoom: any }, brush: IBrush) {
        var mercator = W.mercator(256);
        var transform = function (pt) {
            return mercator.lonLat2Pixel(pt, cxt.extent, cxt.zoom);

        };
        let pd = W.projectToPixel(W.decompressFeatureCollection(data), W.mercator(256), cxt)
        //let pd=W.toGeometries(data,cxt.extent,cxt.zoom)
        var splitted = W.splitByTags(pd.features);

        //  splitted = _.reduce(this.features(), function (memo, fc:any) {
        //      var mapped = fc.map(function (feature) {
        //          return feature.clone()
        //              .paths(_.map(feature.paths(), function (i) {
        //                  return _.map(i, transform);
        //              })).value();
        //      });
        //      memo.push({
        //          tag: fc.tag(),
        //          items: mapped
        //      });
        //      return memo;
        //  }, splitted);
        var self = this;


        var i;
        for (i = 0; i < 2; i++) {
            _.each(splitted, (l, ix) => {
                _.chain(l.items)
                    .reduce((memo:{g:any,s:any,z:number}[], g) => {
                        var style = this.style(l.tag);
                        if (!style)
                            return memo;
                        var symbols = style.get(g, cxt);
                        _.chain(symbols)
                            .filter(function (s) {
                                return (i === 0) ? s.symbolizer !== "text" : s.symbolizer === "text";
                            })
                            .each(function (style) {
                                var s = new W.Wrapper<Style, any>(style, W.unionPropertyOf(g, cxt), g, cxt)
                                memo.push({
                                    g: g,
                                    s: s,
                                    z: s.value("z", 0)
                                })
                            }).value()
                        return memo
                    }, []).sortBy("z").each((instruction:any) => {
                        Painter.paint(brush, instruction.g, instruction.s)
                    }).value()
                // _.chain(r.value()).sortBy("z")
                //     .each(function (instruction) {
                //         Painter.paint(brush, instruction.g, instruction.s);
                //     }).value()

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
    initLayer() {
        this._leaflet = this.map.getLeaflet()
        this._leafletLayer = this.createLeafletLayer()
        if (this._config.visible) {
            this._leafletLayer.addTo(this._leaflet)
        }
        if (this._config.selectable) {
            this.addToControl(this._config.layerType)

        }
    }
    createLeafletLayer(): L.Layer {
        return L.tileLayer(W.buildUrl(this._config.url, this.getContext()), this._config.leafletLayerOption)
    }

}
export class PngLayer extends Layer {
    createLeafletLayer(): L.Layer {
        return L.tileLayer(W.buildUrl(this._config.url, this.getContext()), this._config.leafletLayerOption)
    }
}
export class CanvasTileLayer extends Layer {
    getBrush(canvas) {
        return new CanvasBrush(canvas.getContext("2d"))
    }
    createLeafletLayer(): L.Layer {
        let l = this
        let CanvasTile = class CanvasTile extends L.GridLayer {
            createTile(tilePoint, done) {

                // create a <canvas> element for drawing
                var canvasTile = L.DomUtil.create('canvas', 'leaflet-tile');
                // setup tile width and height according to the options
                var tileSize = this.getTileSize();
                canvasTile.setAttribute("width", tileSize.x.toString())
                canvasTile.setAttribute("height", tileSize.y.toString())


                var zoom = tilePoint.z;
                // draw something asynchronously and pass the tile to the done() callback

                var ext = W.tile2bounds(tilePoint.x, tilePoint.y, tilePoint.z);
                let ctx = { zoom, extent: ext }
                //cxt.putAll(self.parameters);
                if (!l._config.url) {
                    setTimeout(() => {
                        l.render({}, l.getContext(ctx), l.getBrush(canvasTile))
                        done(false, canvasTile)
                    }, 10)
                } else {
                    W.doGet(l._config.url, l.getContext(ctx)).done((data) => {
                        data = JSON.parse(data)

                        l.render(data, l.getContext(ctx), l.getBrush(canvasTile))
                        done(false, canvasTile)
                    })
                }
                return canvasTile;
            }
        }
        return new CanvasTile
    }
}
export class CanvasLayer extends CanvasTileLayer {

    createLeafletLayer(): L.Layer {
        let l = this
        let leafletCanvasLayer = class LeafletCanvasLayerL extends L.Layer {
            canvas: any
            options: any
            map: L.Map
            getExtent() {
                if (this.map) {
                    let b = this.map.getBounds();
                    return [b.getSouthWest().lng, b.getSouthWest().lat, b.getNorthEast().lng, b.getNorthEast().lat];
                }
            }
            onAdd(map: L.Map) {
                this.map = map
                let pane = map.getPane(this.options.pane)
                this.canvas = L.DomUtil.create("canvas", "custom_canvas_layer")
                pane.appendChild(this.canvas)
                this.canvas.style.width = map.getSize().x + "px"
                this.canvas.style.height = map.getSize().y + "px"
                this.canvas.setAttribute("width", map.getSize().x)
                this.canvas.setAttribute("height", map.getSize().y)
                this.update()
                this.map.on("move", this.update, this)
                this.map.on("zoom", this.update, this)
                return this
            }
            update() {

                var pos = L.DomUtil.getPosition(this.map.getPane("mapPane"));
                L.DomUtil.setTransform(this.canvas, pos.multiplyBy(-1), 0);
                let ctx = { zoom: this.map.getZoom(), extent: this.getExtent() }
                this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height)
                if (!l._config.url) {
                    setTimeout(() => {
                        l.render(l.getData(), l.getContext(ctx), l.getBrush(this.canvas))

                    }, 10)
                } else {
                    W.doGet(l._config.url, l.getContext(ctx)).done((data) => {
                        if (data) {
                            data = JSON.parse(data)
                            let fs = data
                            fs = W.toPixelFeatureCollection(W.decompressFeatureCollection(fs), this.getExtent(), this.map.getZoom())
                            console.log(fs)
                            // W.toGeometries(data,ctx.extent,ctx.zoom)
                            l.render(fs, l.getContext(ctx), l.getBrush(this.canvas))
                        }
                    })
                }

            }
            onRemove(map: L.Map) {
                L.DomUtil.remove(this.canvas)
                this.map.off("move", this.update, this)
                this.map.off("zoom", this.update, this)
                return this
            }
        }
        return new leafletCanvasLayer
    }
}
export function layerFactor(map, id, options:ILayerConfig) {
    if (options.renderer == "canvastile") {
        return new CanvasTileLayer(map, id, options)
    } else if (options.renderer == "png") {
        return new PngLayer(map, id, options)
    } else if (options.renderer == "canvas") {
        return new CanvasTileLayer(map, id, options)
    } else if (options.renderer == "canvasOnMap") {
        return new CanvasLayer(map, id, options)
    }
}