var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../../Jigsaw/View", "underscore", "leaflet"], function (require, exports, View_1, _, L) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapView = (function (_super) {
        __extends(MapView, _super);
        function MapView(conf) {
            var _this = _super.call(this, conf) || this;
            _this.setConfig(conf);
            _this.style({
                position: "absolute",
                left: "0px",
                right: "0px",
                top: "0px",
                bottom: "0px"
            });
            return _this;
        }
        MapView.prototype.setConfig = function (c) {
            this.config = _.extend({}, this.config, c);
        };
        MapView.prototype.onAfterRender = function () {
            this.leaflet = L.map(this.el, _.extend({ scrollWheelZoom: true }, _.pick(this.config, "zoomControl")));
        };
        MapView.prototype.setMapSetting = function (s) {
            if (this.mapSetting) {
                this.mapSetting = _.extend(this.mapSetting, s);
            }
            else {
                this.mapSetting = _.extend({}, s);
            }
            this.leaflet.setView(this.mapSetting.center, this.mapSetting.zoom);
            var l = L.tileLayer(this.mapSetting.baseLayer.mapUrl, {
                maxZoom: this.mapSetting.baseLayer.maxZoom
            });
            l.addTo(this.leaflet);
            return this;
        };
        return MapView;
    }(View_1.View));
    exports.MapView = MapView;
});
