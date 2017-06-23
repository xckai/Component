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
define(["require", "exports", "./View", "underscore", "./Evented"], function (require, exports, View_1, _, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(conf) {
            var _this = _super.call(this) || this;
            _this.children = [];
            _this.id = _.uniqueId("Component");
            _this.config = _this.defaultConfig();
            _this.mergeConfig(conf);
            _this.rootView = new View_1.View(_this.getViewConfig(conf));
            _this.updateStyle();
            return _this;
        }
        Component.prototype.defaultConfig = function () {
            return {
                el: null,
                $el: null,
                className: "",
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
        Component.prototype.setConfig = function (c) {
            this.mergeConfig(c);
            this.updateConfig();
        };
        Component.prototype.updateConfig = function () {
            this.updateStyle();
            this.rootView.setClass(this.config.className);
        };
        Component.prototype.mergeConfig = function (c) {
            if (c) {
                this.config = _.extend(this.defaultConfig(), _.pick(c, "className", "el", "$el", "tagName"));
                this.config.style = _.extend(this.defaultConfig().style, c["style"]);
            }
            return this;
        };
        Component.prototype.getViewConfig = function (c) {
            return _.extend({}, _.pick(this.defaultConfig(), "tagName", "el", "className", "$el"), c);
        };
        Component.prototype.style = function (c) {
            this.config.style = _.extend(this.defaultConfig().style, c);
        };
        Component.prototype.updateStyle = function () {
            this.rootView.style(this.config.style);
            this.rootView.setClass(this.config.className);
        };
        Component.prototype.addTo = function (c, listen) {
            this.parent = c;
            this.parent.add(this, listen);
            return this;
        };
        Component.prototype.add = function (nc, listen) {
            var i = _.findIndex(this.children, function (c) { return c.id == nc.id; });
            nc.parent = this;
            this.observe(nc);
            if (i == -1) {
                this.children.push(nc);
            }
            else {
                this.children[i] = nc;
            }
            nc.rootView.getNode$().appendTo(this.rootView.getNode$());
            return this;
        };
        Component.prototype.remove = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.rootView.remove();
            this.destroy();
        };
        Component.prototype.removeChild = function (c) {
        };
        Component.prototype.setBusy = function (b) {
            this.rootView.setBusy(b);
        };
        return Component;
    }(Evented_1.EventBus));
    exports.Component = Component;
});
