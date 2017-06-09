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
define(["require", "exports", "Backbone", "underscore"], function (require, exports, Backbone, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var View = (function (_super) {
        __extends(View, _super);
        function View(conf) {
            return _super.call(this, _.extend({ el: "<div></div>" }, conf)) || this;
        }
        View.prototype.getNode$ = function () {
            return this.$el;
        };
        View.prototype.attr = function (obj) {
            this.$el.attr(obj);
            return this;
        };
        View.prototype.style = function (obj) {
            var _this = this;
            _.each(obj, function (v, k) {
                if (v) {
                    _this.$el.css(k, v);
                }
                else {
                    _this.$el.css(k, "");
                }
            });
            return this;
        };
        View.prototype.setClass = function (cls) {
            var _this = this;
            this.$el.removeClass();
            if (_.isArray(cls)) {
                _.each(cls, function (v) {
                    _this.$el.addClass(v);
                });
            }
            if (_.isString(cls)) {
                this.$el.addClass(cls);
            }
        };
        return View;
    }(Backbone.View));
    exports.View = View;
});
