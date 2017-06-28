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
define(["require", "exports", "./View", "underscore", "./Utils/Util", "./Evented"], function (require, exports, View_1, _, Util_1, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getProperty = Util_1.Util.getProperty;
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(conf) {
            var _this = _super.call(this) || this;
            _this.children = [];
            _this.id = _.uniqueId("Component");
            _this.config = _this.defaultConfig();
            _this.rootView = new View_1.View(_.extend({}, _.pick(_this.defaultConfig(), "tagName", "el", "className", "$el"), conf));
            _this.setConfig(conf);
            return _this;
        }
        Component.prototype.defaultConfig = function () {
            return {
                el: null,
                $el: null,
                className: "",
                class: "",
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
            this.rootView.addClass(this.config.class);
        };
        Component.prototype.mergeConfig = function (c) {
            if (c) {
                this.config = _.extend(this.defaultConfig(), _.pick(c, "className", "el", "$el", "tagName", "class"));
                this.config.style = _.extend(this.defaultConfig().style, getProperty(this.config, "style"), c["style"]);
            }
            return this;
        };
        Component.prototype.style = function (c) {
            this.config.style = _.extend(this.defaultConfig().style, getProperty(this.config, "style"), c);
            this.updateStyle();
        };
        Component.prototype.addClass = function (c) {
            this.rootView.addClass(c);
            return this;
        };
        Component.prototype.removeClass = function (c) {
            this.rootView.removeClass(c);
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
            _super.prototype.destroy.call(this);
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
