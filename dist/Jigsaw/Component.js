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
define(["require", "exports", "./View", "underscore", "./Util", "./Evented"], function (require, exports, View_1, _, Util_1, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(conf) {
            var _this = _super.call(this) || this;
            _this.children = [];
            _this.config = {
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
            if (conf && conf.id) {
                _this.id = conf.id;
            }
            else {
                _this.id = _.uniqueId("Component");
            }
            _this.rootView = new View_1.View({ tagName: "section" });
            _this.setConfig(conf);
            return _this;
        }
        Component.prototype.setConfig = function (c) {
            this.config = Util_1.Util.deepExtend(this.config, c);
            this.updataConfig();
            return this;
        };
        Component.prototype.updataConfig = function () {
            this.rootView.setClass(this.config.className);
            this.rootView.style(this.config.style);
            return this;
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
            this.rootView.remove();
        };
        return Component;
    }(Evented_1.EventBus));
    exports.Component = Component;
});
