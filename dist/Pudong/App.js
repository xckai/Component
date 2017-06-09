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
define(["require", "exports", "../Jigsaw/Core/App", "../Jigsaw/Map/Map", "../Jigsaw/Bar/NavBar"], function (require, exports, App_1, Map_1, NavBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainApp = (function (_super) {
        __extends(MainApp, _super);
        function MainApp(conf) {
            var _this = _super.call(this, conf) || this;
            _this.initApp();
            return _this;
        }
        MainApp.prototype.initApp = function () {
            this.addRule("*path", "Main", this.proxy("Main"));
        };
        MainApp.prototype.Main = function () {
            var _this = this;
            this.router.navigate("Pudong/", { trigger: false, replace: true });
            this.mapComponent = new Map_1.Map();
            this.mapComponent.addTo(this);
            $.get("/dist/Pudong/mapConfig.json", function (c) {
                console.log(c);
                _this.mapComponent.map.setMapSetting(c);
            });
            this.bar = new NavBar_1.NavBar();
        };
        return MainApp;
    }(App_1.App));
    exports.MainApp = MainApp;
});
