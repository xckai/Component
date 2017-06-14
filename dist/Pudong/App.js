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
define(["require", "exports", "../Jigsaw/App", "../BlueDark/Map/Map", "../BlueDark/Bar/NavBar", "./Side/LeftSide"], function (require, exports, App_1, Map_1, NavBar_1, LeftSide_1) {
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
        // rightSide:Side
        MainApp.prototype.Main = function () {
            var _this = this;
            this.router.navigate("Pudong/", { trigger: false, replace: true });
            this.mapComponent = new Map_1.Map({ style: {
                    top: "3rem"
                } });
            this.mapComponent.addTo(this);
            $.get("/dist/Pudong/mapConfig.json", function (c) {
                console.log(c);
                _this.mapComponent.map.setMapSetting(c);
            });
            this.bar = new NavBar_1.NavBar();
            this.bar.addTo(this);
            this.side = new LeftSide_1.LeftSide({ style: {
                    top: "3rem",
                    width: "40rem",
                    bottom: "0px",
                    "z-index": 2000
                },
                className: "left-api"
            });
            this.side.addTo(this);
            // this.rightSide=new Side({style:{
            //         top:"3rem",
            //         left:null,
            //         right:"0px",
            //         width:"40rem",
            //         bottom:"0px",
            //         "z-index":2000
            // },className:"right-api",direction:"right"})
            // this.rightSide.addTo(this)
        };
        return MainApp;
    }(App_1.App));
    exports.MainApp = MainApp;
});
