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
define(["require", "exports", "../../Jigsaw/Model", "../../Jigsaw/View", "underscore", "../../BlueDark/Side/Side"], function (require, exports, Model_1, View_1, _, Side_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LeftSide = (function (_super) {
        __extends(LeftSide, _super);
        function LeftSide(conf) {
            var _this = _super.call(this, conf) || this;
            _this.kpiPanelView = new KpiPanelView();
            var kpi = new KpiModel();
            _this.kpiPanelView.setModel(kpi);
            _this.kpiPanelView.renderAt(_this.getContentContainer());
            kpi.set({ "title": "全城KPI",
                regionValue: [{ name: "Pudong", value: 40 }] });
            _this.kpiPanelView.render();
            return _this;
        }
        return LeftSide;
    }(Side_1.Side));
    exports.LeftSide = LeftSide;
    var KpiPanelView = (function (_super) {
        __extends(KpiPanelView, _super);
        function KpiPanelView(conf) {
            return _super.call(this, _.extend({ className: "KpiPanal" }, conf)) || this;
        }
        KpiPanelView.prototype.render = function () {
            this.$el.html("\n                        <section>\n                            <header>" + this.model.get("title") + "</header>\n                            <div class=\"content\"> \n                                <div class='info'> </div>\n                                <div class='ragions'> \n                                <table>\n                                        " + _.map(this.model.get("regionValue"), function (n) {
                return "<tr><td class='name'>" + n.name + "</td><td class='value'>" + n.value + "</td></tr>";
            }).join('') + "\n                                </table>\n                                    </div>\n                            </div >\n                        </section>\n                        ");
            return this;
        };
        return KpiPanelView;
    }(View_1.View));
    var KpiModel = (function (_super) {
        __extends(KpiModel, _super);
        function KpiModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return KpiModel;
    }(Model_1.Model));
});
