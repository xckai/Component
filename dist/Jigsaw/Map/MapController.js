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
define(["require", "exports", "../Core/Controller", "../Core/View", "underscore", "leaflet"], function (require, exports, Controller_1, View_1, _, L) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapView = (function (_super) {
        __extends(MapView, _super);
        function MapView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapView.prototype.render = function () {
            this.mapNode$ = $("<div></div>").css({
                position: "absolute",
                left: "0px",
                right: "0px",
                top: "0px",
                bottom: "0px",
            }).appendTo(this.$el);
            return this;
        };
        MapView.prototype.getMapNode = function () {
            return this.mapNode$.get(0);
        };
        return MapView;
    }(View_1.View));
    var MapController = (function (_super) {
        __extends(MapController, _super);
        function MapController(conf) {
            var _this = _super.call(this, conf) || this;
            _this.view = new View_1.View({ el: "<div></div>" });
            _this.updataConfig();
            return _this;
        }
        MapController.prototype.onAfterRender = function () {
            this.leaflet = L.map(this.view.el, { scrollWheelZoom: true });
        };
        MapController.prototype.setMapSetting = function (s) {
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
        return MapController;
    }(Controller_1.Controller));
    exports.MapController = MapController;
});
