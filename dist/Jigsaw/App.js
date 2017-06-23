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
define(["require", "exports", "Backbone", "underscore", "./Component"], function (require, exports, Backbone, _, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function (_super) {
        __extends(App, _super);
        function App(conf) {
            var _this = _super.call(this, conf) || this;
            _this.id = _.uniqueId("App");
            return _this;
        }
        App.prototype.defaultConfig = function () {
            return {
                el: "body",
                $el: null,
                className: "app",
                style: {
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                    top: "0px",
                    bottom: "0px",
                    width: null,
                    height: null
                }
            };
        };
        App.prototype.start = function () {
            Backbone.history.start();
        };
        App.prototype.addRule = function (str, name, fn) {
            if (this.router == undefined) {
                this.router = new Backbone.Router();
            }
            this.router.route(str, name, fn);
        };
        App.prototype.proxy = function (fnStr) {
            var self = this;
            return this[fnStr].bind(self);
        };
        return App;
    }(Component_1.Component));
    exports.App = App;
});
