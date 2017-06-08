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
define(["require", "exports", "Backbone"], function (require, exports, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var personView = (function (_super) {
        __extends(personView, _super);
        function personView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.template = "ahahahh";
            return _this;
        }
        personView.prototype.render = function () {
            this.$el.html(this.template);
            return this;
        };
        return personView;
    }(Backbone.View));
    var p = new personView({ el: "#app" });
});
