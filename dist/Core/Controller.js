define(["require", "exports", "./View", "underscore"], function (require, exports, View_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = (function () {
        function Controller(conf) {
            this.config = {
                class: [],
                style: {
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                    top: "0px",
                    bottom: "0px",
                    display: "inhert",
                    width: null,
                    height: null
                }
            };
            this.view = new View_1.View({ el: "div" });
            this.setConfig(conf);
        }
        Controller.prototype.setConfig = function (c) {
            this.config = _.extend(this.config, c);
            this.updataConfig();
            return this;
        };
        Controller.prototype.updataConfig = function () {
            this.view.setClass(this.config.class);
            this.view.style(this.config.style);
            return this;
        };
        Controller.prototype.renderAt = function (dom) {
            this.view.render();
            this.view.getNode$().appendTo(dom);
        };
        return Controller;
    }());
    exports.Controller = Controller;
});
