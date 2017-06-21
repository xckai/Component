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
define(["require", "exports", "../../Jigsaw/Component", "../../Jigsaw/View", "../../Jigsaw/Util", "underscore"], function (require, exports, Component_1, View_1, Util_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SideView = (function (_super) {
        __extends(SideView, _super);
        function SideView(conf) {
            var _this = _super.call(this, conf) || this;
            _this.config = _.extend({}, _this.config, { direction: "left" }, conf);
            _this.render();
            return _this;
        }
        SideView.prototype.events = function () {
            return {
                "click .toggle": "toggle"
            };
        };
        SideView.prototype.toggle = function (e) {
            if (this.$el.hasClass("toggle-hidden")) {
                ///close
                this.open();
            }
            else {
                //open
                this.hidden();
            }
        };
        SideView.prototype.open = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.$el.css("transform", "");
                _this.$el.find(".fa").removeClass("fa-rotate-180");
                _this.removeClass("toggle-hidden");
                _this.addClass("toggle-show");
            });
        };
        SideView.prototype.hidden = function () {
            switch (this.config.direction) {
                case "left": {
                    this.$el.css("transform", "translate(-100%, 0)");
                    this.$el.find(".fa").addClass("fa-rotate-180");
                    break;
                }
                case "right": {
                    this.$el.css("transform", "translate(100%, 0)");
                    this.$el.find(".fa").addClass("fa-rotate-180");
                }
            }
            this.addClass("toggle-hidden");
            this.removeClass("toggle-show");
        };
        SideView.prototype.render = function () {
            this.$el.html("\n                        <content></content>\n                        <div class='toggle " + this.config.direction + "'>\n                            <span class='fa fa-angle-double-" + this.config.direction + " fa-rotate-180'></span>\n                        </div>");
            return this;
        };
        return SideView;
    }(View_1.View));
    var Side = (function (_super) {
        __extends(Side, _super);
        function Side(conf) {
            var _this = _super.call(this, conf) || this;
            _this.rootView = new SideView(_.extend({ tagName: "section", className: "side" }, conf));
            _this.setConfig(Util_1.Util.deepExtend({
                style: {
                    bottom: null,
                    right: null
                }
            }, conf));
            _this.rootView.hidden();
            return _this;
            // this.Content=new Content("Pudong Smart Traffic")
            // this.title.renderAt(this.view.getNode$())
        }
        Side.prototype.getContentContainer = function () {
            return this.rootView.$("content");
        };
        Side.prototype.show = function () {
            this.rootView.open();
        };
        Side.prototype.hidden = function () {
            this.rootView.hidden();
        };
        Side.prototype.toggle = function () {
            this.rootView.toggle();
        };
        return Side;
    }(Component_1.Component));
    exports.Side = Side;
});
