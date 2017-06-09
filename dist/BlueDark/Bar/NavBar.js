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
define(["require", "exports", "../../Jigsaw/Component", "../../Jigsaw/Controller"], function (require, exports, Component_1, Controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Title = (function (_super) {
        __extends(Title, _super);
        function Title() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Title;
    }(Controller_1.Controller));
    var NavBar = (function (_super) {
        __extends(NavBar, _super);
        function NavBar(conf) {
            var _this = _super.call(this, conf) || this;
            _this.setConfig({
                style: {
                    display: "flex",
                    bottom: null,
                    heigth: "3rem"
                },
                class: ["NavBar"]
            });
            return _this;
        }
        return NavBar;
    }(Component_1.Component));
    exports.NavBar = NavBar;
});
