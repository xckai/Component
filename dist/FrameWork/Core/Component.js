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
define(["require", "exports", "./Controller", "./View", "underscore"], function (require, exports, Controller_1, View_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(conf) {
            var _this = _super.call(this, conf) || this;
            _this.children = [];
            if (conf && conf.id) {
                _this.id = conf.id;
            }
            else {
                _this.id = _.uniqueId("Component");
            }
            _this.view = new View_1.View({ el: "<section></section>" });
            _this.setConfig(conf);
            return _this;
        }
        Component.prototype.addTo = function (c, listen) {
            this.parent = c;
            this.parent.add(this, listen);
            return this;
        };
        Component.prototype.add = function (nc, listen) {
            var i = _.findIndex(this.children, function (c) { return c.id == nc.id; });
            nc.parent = this;
            if (i == -1) {
                this.children.push(nc);
            }
            else {
                this.children[i] = nc;
            }
            nc.view.getNode$().appendTo(this.view.getNode$());
            return this;
        };
        return Component;
    }(Controller_1.Controller));
    exports.Component = Component;
});
