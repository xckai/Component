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
define(["require", "exports", "../Core/Component", "./MapController"], function (require, exports, Component_1, MapController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map(conf) {
            var _this = _super.call(this, conf) || this;
            _this.map = new MapController_1.MapController();
            _this.view.render();
            _this.map.renderAt(_this.view.getNode$());
            return _this;
        }
        return Map;
    }(Component_1.Component));
    exports.Map = Map;
});
