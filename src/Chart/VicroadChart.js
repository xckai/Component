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
define("Core/Util", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var Util;
    (function (Util) {
        function isEndWith(s, ed) {
            var ss = s.toString();
            var matcher = new RegExp(ed + "$");
            return matcher.test(ss);
        }
        Util.isEndWith = isEndWith;
        function toPixel(s, ctx) {
            if (_.isNumber(s)) {
                return s;
            }
            if (isEndWith(s, "px")) {
                return parseFloat(s);
            }
            if (isEndWith(s, "rem")) {
                var font = window.getComputedStyle(document.body).getPropertyValue('font-size') || "16px";
                return parseFloat(s) * parseFloat(font);
            }
            if (isEndWith(s, "%")) {
                return parseFloat(s) * toPixel(ctx) / 100;
            }
            return 0;
        }
        Util.toPixel = toPixel;
        function isBeginWith(s, bs) {
            var ss = s.toString();
            var matcher = new RegExp("^" + bs);
            return matcher.test(ss);
        }
        Util.isBeginWith = isBeginWith;
        function isContaint(s, ss) {
            var matcher = new RegExp(ss);
            return matcher.test(s.toString());
        }
        Util.isContaint = isContaint;
        function max(nums, key) {
            var n = Number.MIN_VALUE;
            if (key && nums) {
                nums = nums.map(function (n) { return n[key]; });
            }
            if (nums) {
                nums.forEach(function (num) {
                    n = isNaN(num) ? n : n > num ? n : num;
                });
            }
            n = n == Number.MIN_VALUE ? 0 : n;
            return n;
        }
        Util.max = max;
        function min(ns, key) {
            var n = Number.MAX_VALUE;
            if (key && ns) {
                ns = ns.map(function (n) { return n[key]; });
            }
            if (ns) {
                ns.forEach(function (num) {
                    n = isNaN(num) ? n : n < num ? n : num;
                });
            }
            n = n == Number.MAX_VALUE ? 0 : n;
            return n;
        }
        Util.min = min;
        Util.d3Invoke = curry(function (method, obj) {
            return function (d3Selection) {
                _.each(obj, function (v, k) {
                    if (v != undefined) {
                        d3Selection[method](k, v);
                    }
                });
                return d3Selection;
            };
        });
        // var stringCache={cla:null,font_size:0,length:0,r:{width:0,height:0}} 
        function getStringRect(str, cla, font_size) {
            var d = window.document.createElement("div");
            var p = window.document.createElement("span");
            var r = { width: 0, height: 0 };
            d.style.transform = "translate3d(0, 0, 0)";
            d.style.visibility = "hidden";
            d.className = "getStringRect";
            p.innerHTML = str;
            if (cla) {
                p.className = cla;
            }
            if (font_size) {
                p.style["font-size"] = font_size + "px";
            }
            if (!str) {
                return r;
            }
            p.style.display = "inline-block";
            d.appendChild(p);
            window.document.body.appendChild(d);
            var rec = p.getBoundingClientRect();
            r.width = rec.width;
            r.height = rec.height;
            d.remove();
            return r;
        }
        Util.getStringRect = getStringRect;
        function CacheAble(fn, keyFn) {
            var _key = function () {
                return arguments2Array(arguments).join("-");
            };
            var cache = {};
            _key = keyFn ? keyFn : _key;
            return function () {
                var args = arguments2Array(arguments);
                if (cache[_key.apply(null, args)]) {
                    return cache[_key.apply(null, args)];
                }
                else {
                    return cache[_key.apply(null, args)] = fn.apply(null, args);
                }
            };
        }
        Util.CacheAble = CacheAble;
        function curry(f) {
            var arity = f.length;
            return function f1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (args.length < arity) {
                    var f2 = function () {
                        var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
                        return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
                    };
                    return f2;
                }
                else {
                    return f.apply(null, args); //all parameters are provided call the origin function
                }
            };
        }
        Util.curry = curry;
        function arguments2Array(args) {
            var r = [];
            for (var i = 0; i < args.length; ++i) {
                r.push(args[i]);
            }
            return r;
        }
        function deepExtend(des) {
            var _this = this;
            var source = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                source[_i - 1] = arguments[_i];
            }
            if (des == undefined || des == null) {
                des = {};
            }
            _.each(source, function (s) {
                if (_.isArray(s)) {
                    var args = [des].concat(s);
                    deepExtend.apply(_this, args);
                }
                else {
                    _.each(s, function (v, k) {
                        if (_.isObject(v)) {
                            if (_.isUndefined(des[k])) {
                                des[k] = {};
                            }
                            deepExtend(des[k], v);
                        }
                        else {
                            des[k] = v;
                        }
                    });
                }
            });
            return des;
        }
        Util.deepExtend = deepExtend;
        function enableAutoResize(dom, fn) {
            function getComputedStyle(element, prop) {
                if (element.currentStyle) {
                    return element.currentStyle[prop];
                }
                if (window.getComputedStyle) {
                    return window.getComputedStyle(element, null).getPropertyValue(prop);
                }
                return element.style[prop];
            }
            if (getComputedStyle(dom, 'position') == 'static') {
                dom.style.position = 'relative';
            }
            for (var i = 0; i < dom.childNodes.length; ++i) {
                if (dom.childNodes[i].className == "autoResier") {
                    dom.removeChild(dom.childNodes[i]);
                }
            }
            var oldWidth = dom.offsetWidth, oldHeight = dom.offsetHeight, refId = 0;
            var d1 = window.document.createElement("div");
            var d2 = window.document.createElement("div");
            var d3 = window.document.createElement("div");
            d1.className = "autoResier";
            d1.setAttribute("style", " position: absolute; left: 0; top: 0; right: 0; overflow:hidden; visibility: hidden; bottom: 0; z-index: -1");
            d2.setAttribute("style", "position: absolute; left: 0; top: 0; right: 0; overflow:scroll; bottom: 0; z-index: -1");
            d3.setAttribute("style", "position: absolute; left: 0; top: 0; transition: 0s ;height: 100000px;width:100000px");
            d2.appendChild(d3);
            d1.appendChild(d2);
            dom.appendChild(d1);
            d2.scrollLeft = 100000;
            d2.scrollTop = 100000;
            d2.onscroll = function (e) {
                d2.scrollLeft = 100000;
                d2.scrollTop = 100000;
                if ((dom.offsetHeight != oldHeight || dom.offsetWidth != oldWidth) && refId === 0) {
                    refId = requestAnimationFrame(onresize);
                }
            };
            function onresize() {
                refId = 0;
                if (fn) {
                    fn({ oldHeight: oldHeight, oldWidth: oldWidth, height: dom.offsetHeight, width: dom.offsetWidth });
                }
                oldWidth = dom.offsetWidth, oldHeight = dom.offsetHeight;
            }
        }
        Util.enableAutoResize = enableAutoResize;
    })(Util = exports.Util || (exports.Util = {}));
});
define("Core/Evented", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var Evented = (function () {
        function Evented() {
            this.events = {};
        }
        Evented.prototype.on = function (t, fn, ctx) {
            var _this = this;
            var st = t.split(" ");
            st.forEach(function (tt) {
                _this._on(tt, fn, ctx);
            });
            return this;
        };
        Evented.prototype._on = function (t, fn, ctx) {
            if (this.events[t]) {
                if (_.some(this.events[t], function (e) { return e.fn == fn && e.ctx == ctx; })) {
                    return;
                }
                else {
                    var obj = {};
                    obj.fn = fn;
                    obj.ctx = ctx;
                    this.events[t].push(obj);
                }
            }
            else {
                this.events[t] = [];
                var obj = {};
                obj.fn = fn;
                obj.ctx = ctx;
                this.events[t].push(obj);
            }
        };
        Evented.prototype._off = function (t, fn, ctx) {
            if (!this.events[t]) {
                return this;
            }
            else {
                var nEs_1 = [];
                if (fn) {
                    this.events[t].forEach(function (o) {
                        if (o.fn != fn && o.ctx != ctx) {
                            nEs_1.push(o);
                        }
                    });
                }
                this.events[t] = nEs_1;
            }
        };
        Evented.prototype.off = function (t, fn) {
            var _this = this;
            var st = t.split(" ");
            st.forEach(function (s) { return _this._off(s, fn); });
            return this;
        };
        Evented.prototype.fire = function (t, obj) {
            if (this.events[t]) {
                this.events[t].forEach(function (o) { return o.fn.call(o.ctx, obj); });
            }
            var p = this.parent;
            if (p) {
                p.fire(t, obj);
            }
            if (t != "*") {
                this.fire("*", obj);
            }
            return this;
        };
        Evented.prototype.listen = function (o, estr, fn) {
            o.on(estr, fn);
            return this;
        };
        Evented.prototype.listenTo = function (e) {
            e.parent = this;
            return this;
        };
        Evented.prototype.clear = function () {
            this.events = {};
            this.parent = null;
        };
        return Evented;
    }());
    exports.Evented = Evented;
});
define("Core/View", ["require", "exports", "d3", "Core/Evented", "Core/Util"], function (require, exports, d3, Evented_1, Util_1) {
    "use strict";
    exports.__esModule = true;
    var styles = Util_1.Util.d3Invoke("style");
    var attrs = Util_1.Util.d3Invoke("attr");
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            var confs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                confs[_i] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            _this.config = Util_1.Util.deepExtend(_this.defaultConfig(), confs);
            _this.initView();
            return _this;
        }
        View.prototype.defaultConfig = function () {
            return { tagName: "div", className: "view", style: null };
        };
        View.prototype.initView = function () {
            if (this.config.tagName == "svg") {
                this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            }
            else {
                this.el = document.createElementNS("http://www.w3.org/1999/xhtml", this.config.tagName);
            }
            this.elD3 = d3.select(this.el);
            this.elD3.classed(this.config.className, true);
            this.style(this.config.style);
            return this;
        };
        View.prototype.appendTo = function (dom) {
            dom.node().appendChild(this.el);
            return this;
        };
        View.prototype.style = function (s) {
            this.elD3.call(styles(s));
            return this;
        };
        View.prototype.attr = function (a) {
            this.elD3.call(attrs(a));
            return this;
        };
        View.prototype.render = function (ctx) {
            return this;
        };
        View.prototype.addClass = function (c) {
            this.elD3.classed(c, true);
            return this;
        };
        View.prototype.removeClass = function (c) {
            this.elD3.classed(c, false);
            return this;
        };
        return View;
    }(Evented_1.Evented));
    exports.View = View;
});
define("Chart/TimeAdjust/TimeAdjust", ["require", "exports", "d3", "underscore", "Core/Util", "Core/View"], function (require, exports, d3, _, Util_2, View_1) {
    "use strict";
    exports.__esModule = true;
    var TimeAdjust = (function (_super) {
        __extends(TimeAdjust, _super);
        function TimeAdjust(id) {
            var confs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                confs[_i - 1] = arguments[_i];
            }
            var _this = _super.call(this, confs) || this;
            _this.id = id == undefined ? _.uniqueId("layer") : id;
            return _this;
        }
        TimeAdjust.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "timeAdjust",
                style: {
                    top: "100px",
                    left: "50px",
                    bottom: "null",
                    right: "null",
                    position: "absolute",
                    "z-index": 0,
                    width: "50rem",
                    height: "10rem"
                },
                rangeMin: "6",
                rangeMax: "18",
                focusTime: "12",
                padding: 20,
                timeParse: "%H",
                timeFormat: "%H:%M"
            };
        };
        TimeAdjust.prototype.setConfig = function (c) {
            this.config = Util_2.Util.deepExtend(this.config, c);
        };
        TimeAdjust.prototype.drawer = function (svgNode) {
            var gradientColor = svgNode.append("defs").append("radialGradient").attr("id", "radialColor")
                .attr("cx", "50%").attr("cy", "50%")
                .attr("r", "50%")
                .attr("fx", "50%").attr("fy", "50%");
            gradientColor.append("stop").attr("offset", "0%").attr("style", "stop-color:aqua;stop-opacity:1");
            gradientColor.append("stop").attr("offset", "100%").attr("style", "stop-color:steelblue;stop-opacity:1");
            svgNode.append("rect").attr("class", "panel")
                .attr("x", this.config.padding)
                .attr("y", this.config.padding)
                .attr("width", Util_2.Util.toPixel(this.config.style.width) - this.config.padding * 2)
                .attr("height", Util_2.Util.toPixel(this.config.style.height) - this.config.padding * 2)
                .attr("fill", "url(#radialColor)");
            var self = this;
            var parseTime = d3.timeParse(this.config.timeParse);
            var formatTime = d3.timeFormat(this.config.timeFormat);
            var focusTime = parseTime(this.config.focusTime);
            var xScale = d3.scaleTime()
                .domain([parseTime(this.config.rangeMin), parseTime(this.config.rangeMax)])
                .range([this.config.padding, Util_2.Util.toPixel(this.config.style.width) - this.config.padding]);
            var xAxis = d3.axisBottom(xScale).tickFormat(formatTime).ticks(2);
            svgNode.append("g").attr("class", "axis xAxis")
                .attr("transform", "translate(0," + (Util_2.Util.toPixel(this.config.style.height) - this.config.padding) + ")")
                .call(xAxis);
            var drag = d3.drag()
                .on("start", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("drag", function () {
                if (xScale.invert(d3.event.x) >= parseTime(self.config.rangeMin) && xScale.invert(d3.event.x) <= parseTime(self.config.rangeMax)) {
                    var focusText = svgNode.select(".focusText"), focusLine = svgNode.select(".focusLine");
                    var oldLineX = Number(focusLine.attr("x1")), oldTextX = Number(focusText.attr("x"));
                    d3.select(this).attr("transform", "translate(" + (d3.event.x - oldLineX) + ",0)");
                    if (d3.event.x > Util_2.Util.toPixel(self.config.style.width) / 2)
                        focusText.text(formatTime(xScale.invert(d3.event.x))).attr("x", d3.event.x - 40);
                    else
                        focusText.text(formatTime(xScale.invert(d3.event.x))).attr("x", d3.event.x + 40);
                    self.fire("dragLine", { time: xScale.invert(d3.event.x) });
                }
            })
                .on("end", function () {
                svgNode.style("cursor", "default");
            });
            svgNode.append("text").attr("class", "focusText")
                .text(formatTime(parseTime(this.config.focusTime)))
                .attr("x", (xScale(focusTime) + 40))
                .attr("y", (Util_2.Util.toPixel(this.config.style.height) / 2));
            var focusGroup = svgNode.append("g").attr("class", "focusGroup")
                .on("mouseenter", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("mouseleave", function () {
                svgNode.style("cursor", "default");
            })
                .call(drag);
            focusGroup.append("line").attr("class", "focusLine")
                .attr("x1", xScale(focusTime)).attr("y1", this.config.padding)
                .attr("x2", xScale(focusTime)).attr("y2", Util_2.Util.toPixel(this.config.style.height) - this.config.padding);
            var focusButton = focusGroup.append("g").attr("class", "focusButton");
            focusButton.append("rect").attr("class", "focusRect")
                .attr("x", xScale(focusTime) - 6)
                .attr("y", (Util_2.Util.toPixel(this.config.style.height) / 2 - 10))
                .attr("rx", "3").attr("ry", "3")
                .attr("width", "12")
                .attr("height", "20");
            focusButton.append("line").attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", (Util_2.Util.toPixel(this.config.style.height) / 2 - 5))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", (Util_2.Util.toPixel(this.config.style.height) / 2 - 5));
            focusButton.append("line").attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", (Util_2.Util.toPixel(this.config.style.height) / 2))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", (Util_2.Util.toPixel(this.config.style.height) / 2));
            focusButton.append("line").attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", (Util_2.Util.toPixel(this.config.style.height) / 2 + 5))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", (Util_2.Util.toPixel(this.config.style.height) / 2 + 5));
        };
        TimeAdjust.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        TimeAdjust.prototype.renderAt = function (dom) {
            dom.appendChild(this.el);
            this.render();
        };
        return TimeAdjust;
    }(View_1.View));
    exports.TimeAdjust = TimeAdjust;
});
define("VicroadChart", ["require", "exports", "Chart/TimeAdjust/TimeAdjust"], function (require, exports, TimeAdjust_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    exports.__esModule = true;
    __export(TimeAdjust_1);
});
