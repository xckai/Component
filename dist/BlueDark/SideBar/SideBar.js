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
define(["require", "exports", "../../Jigsaw/Component", "../../Jigsaw/Controller", "../../Jigsaw/View"], function (require, exports, Component_1, Controller_1, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SideBarView = (function (_super) {
        __extends(SideBarView, _super);
        function SideBarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SideBarView.prototype.setTitle = function (s) {
            this.title = s;
            this.render();
        };
        SideBarView.prototype.render = function () {
            this.$el.html("<span>" + this.title + "</span>");
            return this;
        };
        return SideBarView;
    }(View_1.View));
    var Title = (function (_super) {
        __extends(Title, _super);
        function Title(str) {
            var _this = _super.call(this) || this;
            _this.view = new SideBarView();
            _this.setConfig({
                class: ["SideBar"],
                style: {
                    position: "absolute",
                    left: "0px",
                    right: null,
                    top: null,
                    bottom: null
                }
            });
            _this.setTitle(str);
            return _this;
        }
        Title.prototype.setTitle = function (str) {
            this.view.setTitle(str);
            return this;
        };
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
                    height: "3rem"
                },
                class: ["navbar"]
            });
            _this.title = new Title("Pudong Smart Traffic");
            _this.title.renderAt(_this.view.getNode$());
            return _this;
        }
        return NavBar;
    }(Component_1.Component));
    exports.NavBar = NavBar;
});
