define(["require", "exports", "./View", "underscore", "./Util"], function (require, exports, View_1, _, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = (function () {
        function Component(conf) {
            this.children = [];
            this.config = {
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
                this.id = conf.id;
            }
            else {
                this.id = _.uniqueId("Component");
            }
            this.rootView = new View_1.View({ tagName: "section" });
            this.setConfig(conf);
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
            if (i == -1) {
                this.children.push(nc);
            }
            else {
                this.children[i] = nc;
            }
            nc.rootView.getNode$().appendTo(this.rootView.getNode$());
            return this;
        };
        return Component;
    }());
    exports.Component = Component;
});
