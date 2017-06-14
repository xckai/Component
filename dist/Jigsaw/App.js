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
define(["require", "exports", "Backbone", "./View", "underscore", "./Component", "./Util"], function (require, exports, Backbone, View_1, _, Component_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function (_super) {
        __extends(App, _super);
        function App(conf) {
            var _this = _super.call(this, conf) || this;
            if (conf && conf.id) {
                _this.id = conf.id;
            }
            else {
                _this.id = _.uniqueId("App");
            }
            if (conf && conf.el) {
                _this.rootView = new View_1.View({ el: conf.el });
            }
            else {
                _this.rootView = new View_1.View({ el: "body" });
            }
            _this.setConfig(Util_1.Util.deepExtend({ className: "app" }, conf));
            return _this;
        }
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
