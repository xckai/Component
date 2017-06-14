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
define(["require", "exports", "../../Jigsaw/Component", "../../Jigsaw/View", "../../Jigsaw/Model"], function (require, exports, Component_1, View_1, Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TitleModel = (function (_super) {
        __extends(TitleModel, _super);
        function TitleModel(conf) {
            return _super.call(this, conf) || this;
        }
        return TitleModel;
    }(Model_1.Model));
    var TitleView = (function (_super) {
        __extends(TitleView, _super);
        function TitleView(conf) {
            var _this = _super.call(this, { className: "title" }) || this;
            _this.model = new TitleModel();
            _this.listenTo(_this.model, "all", _this.render);
            return _this;
            //this.model.set("title","Title")
        }
        TitleView.prototype.setTitle = function (s) {
            this.model.set("title", s);
        };
        TitleView.prototype.render = function () {
            this.$el.html("<span>" + this.model.get("title") + "</span>");
            return this;
        };
        return TitleView;
    }(View_1.View));
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
                className: "navbar"
            });
            _this.title = new TitleView();
            _this.title.setTitle("Pudong Smart Traffic");
            _this.title.renderAt(_this.rootView.getNode$());
            return _this;
        }
        return NavBar;
    }(Component_1.Component));
    exports.NavBar = NavBar;
});
