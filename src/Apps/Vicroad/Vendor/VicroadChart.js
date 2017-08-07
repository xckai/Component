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
define("Core/Util", ["require", "exports", "lodash"], function (require, exports, _) {
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
        function toPixel(str, ctx) {
            var string2Pixel = function (s) {
                if (_.isNumber(s)) {
                    return s;
                }
                else if (isEndWith(s, "px")) {
                    return parseFloat(s);
                }
                else if (isEndWith(s, "rem")) {
                    var font = window.getComputedStyle(document.body).getPropertyValue('font-size') || "16px";
                    return parseFloat(s) * parseFloat(font);
                }
                else if (isEndWith(s, "%")) {
                    return parseFloat(s) * toPixel(ctx) / 100;
                }
                else {
                    return 0;
                }
            };
            if (_.isNumber(str)) {
                return string2Pixel(str);
            }
            else if (_.isUndefined(str) || _.isNull(str)) {
                return str;
            }
            else if (_.isFunction(str)) {
                return toPixel(str.call(null));
            }
            else {
                if (str.split("+").length >= 2) {
                    return toPixel(str.split("+").slice(0, 1).join("")) + toPixel(str.split("+").slice(1).join("+"));
                }
                else if (str.split("-").length >= 2) {
                    return toPixel(str.split("-").slice(0, 1).join("")) - toPixel(str.split("-").slice(1).join("-"));
                }
                else {
                    return string2Pixel(str);
                }
            }
        }
        Util.toPixel = toPixel;
        var operation;
        (function (operation) {
            function add(str1, str2) {
                return toPixel(str1 + "+" + str2);
            }
            operation.add = add;
            function sub(s1, s2) {
                return toPixel(s1 + "-" + s2);
            }
            operation.sub = sub;
        })(operation = Util.operation || (Util.operation = {}));
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
                        if (_.isObject(v) && !_.isElement(v) && !_.isFunction(v)) {
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
define("Core/Evented", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var Evented = (function () {
        function Evented() {
            this.eventObj = {};
            this.eventId = _.uniqueId("event-");
            this.setEventSplitter(" ");
            this.setEventSuffixSplitter(":");
        }
        Evented.prototype.offKeyMatcher = function (objkey, key) {
            if (key == "*" || key == "all") {
                return true;
            }
            else {
                var reg = new RegExp("^" + key + ":{1}|^" + key + "$");
                return reg.test(objkey);
            }
        };
        Evented.prototype.triggerKeyMatcher = function (objkey, key) {
            if (key == "*" || key == "all" || objkey == "*" || objkey == "all") {
                return true;
            }
            else {
                key = key.split(this.eventSuffixSplitter)[0].trim();
                objkey = objkey.split(this.eventSuffixSplitter)[0].trim();
                return key == objkey;
            }
        };
        Evented.prototype.setEventSplitter = function (s) {
            this.eventSplitter = s;
            return this;
        };
        Evented.prototype.setEventSuffixSplitter = function (s) {
            this.eventSuffixSplitter = s;
            return this;
        };
        Evented.eachEvent = function (iteratee, eventObj, name, callback, context, args) {
            var names = name.split(eventObj.eventSplitter);
            for (var i = 0; i < names.length; ++i) {
                iteratee(eventObj, eventObj.eventObj, names[i], callback, context, args);
            }
        };
        Evented.onApi = function (eventObj, eventsDataObj, name, callback, context) {
            if (_.isFunction(callback)) {
                var handlers = eventsDataObj[name] || (eventsDataObj[name] = []);
                var handler = {
                    callback: callback, context: context
                };
                var isFind = _.some(handlers, function (h) { return h.callback == callback && h.context == context; });
                if (isFind) {
                    return eventObj;
                }
                else {
                    handlers.push(handler);
                    return eventObj;
                }
            }
        };
        Evented.offApi = function (eventObj, eventsDataObj, key, callback, context) {
            _.each(eventsDataObj, function (v, k) {
                if (eventObj.offKeyMatcher(k, key)) {
                    if (_.isFunction(callback)) {
                        eventsDataObj[k] = _.reject(v, function (handle) { return handle.callback == callback && handle.context == context; });
                    }
                    else {
                        eventsDataObj[k] = [];
                    }
                }
            });
            return eventObj;
        };
        Evented.onceApi = function (eventObj, eventsDataObj, key, callback, context) {
            if (_.isFunction(callback)) {
                var newCallback = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    callback.apply(context, args);
                    eventObj.off(key, callback, context);
                };
                eventObj.on(key, newCallback, null);
            }
        };
        Evented.triggerApi = function (eventObj, eventsDataObj, key, callback, context, args) {
            _.each(eventsDataObj, function (v, k) {
                if (eventObj.triggerKeyMatcher(k, key)) {
                    _.each(v, function (v) { return v.callback.apply(v.context, args); });
                }
            });
        };
        Evented.prototype.on = function (keys, callback, context) {
            Evented.eachEvent(Evented.onApi, this, keys, callback, context);
            return this;
        };
        Evented.prototype.off = function (keys, callback, context) {
            Evented.eachEvent(Evented.offApi, this, keys, callback, context);
            return this;
        };
        Evented.prototype.once = function (keys, callback, context) {
            Evented.eachEvent(Evented.onceApi, this, keys, callback, context);
            return this;
        };
        Evented.prototype.trigger = function (keys) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            Evented.eachEvent(Evented.triggerApi, this, keys, null, null, args);
            return this;
        };
        Evented.prototype.fire = function (keys) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            Evented.eachEvent(Evented.triggerApi, this, keys, null, null, args);
            return this;
        };
        Evented.prototype.proxyEvents = function (e) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _.each(args, function (arg) { return e.on(arg, function () {
                var targs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    targs[_i] = arguments[_i];
                }
                _this.fire.apply(_this, [arg].concat(targs));
            }); });
        };
        return Evented;
    }());
    exports.Evented = Evented;
});
define("Core/View", ["require", "exports", "d3", "lodash", "Core/Evented", "Core/Util"], function (require, exports, d3, _, Evented_1, Util_1) {
    "use strict";
    exports.__esModule = true;
    var styles = Util_1.Util.d3Invoke("style");
    var attrs = Util_1.Util.d3Invoke("attr");
    var View = (function (_super) {
        __extends(View, _super);
        function View(conf) {
            var _this = _super.call(this) || this;
            _this.config = Util_1.Util.deepExtend(_this.defaultConfig(), conf);
            _this.initView();
            return _this;
        }
        View.prototype.defaultConfig = function () {
            return { tagName: "div", className: "view" };
        };
        View.prototype.setConfig = function (c) {
            this.config = _.extend(this.defaultConfig(), this.config, c);
            return this;
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
            return this;
        };
        View.prototype.appendTo = function (dom) {
            dom.node().appendChild(this.el);
            return this;
        };
        View.prototype.append = function (element) {
            this.el.appendChild(element);
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
define("Core/BaseLayer", ["require", "exports", "lodash", "Core/Util", "Core/View"], function (require, exports, _, Util_2, View_1) {
    "use strict";
    exports.__esModule = true;
    var BaseLayer = (function (_super) {
        __extends(BaseLayer, _super);
        function BaseLayer(id, conf) {
            var _this = _super.call(this, conf) || this;
            _this.rendered = false;
            _this.id = id == undefined ? _.uniqueId("layer") : id;
            _this.updateStyle();
            return _this;
        }
        BaseLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "layer",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "300px",
                    height: "300px"
                }
            };
        };
        BaseLayer.prototype.setConfig = function (c) {
            this.config = Util_2.Util.deepExtend(this.config, c);
            this.render();
            return this;
        };
        BaseLayer.prototype.setStyle = function (s) {
            this.config.style = _.extend(this.config.style, s);
            this.updateStyle();
        };
        BaseLayer.prototype.evaluateStyle = function () {
            return {
                top: Util_2.Util.toPixel(this.config.style.top) + "px",
                left: Util_2.Util.toPixel(this.config.style.left) + "px",
                bottom: Util_2.Util.toPixel(this.config.style.bottom) + "px",
                right: Util_2.Util.toPixel(this.config.style.right) + "px",
                width: Util_2.Util.toPixel(this.config.style.width) + "px",
                height: Util_2.Util.toPixel(this.config.style.height) + "px",
                zindex: this.config.style.zindex,
                position: this.config.style.position
            };
        };
        BaseLayer.prototype.updateStyle = function () {
            var s = this.evaluateStyle();
            s["z-index"] = s.zindex;
            this.style(s);
        };
        BaseLayer.prototype.addTo = function (c) {
            c.addLayer(this);
            return this;
        };
        BaseLayer.prototype._onAdd = function (c) {
            this.chart = c;
            this.chart.whenReady(this.renderAtMap, this);
            this.fire("addToChart", { map: c });
        };
        BaseLayer.prototype.render = function () {
            this.el.innerHTML = "";
            return this;
        };
        BaseLayer.prototype.renderAtMap = function (dom) {
            this.chart.getLayerContainer().append(this.el);
            this.render();
        };
        BaseLayer.prototype.clear = function () {
            this.el.remove();
            this.el = null;
            _super.prototype.off.call(this, "*");
        };
        BaseLayer.prototype.getNode = function () {
            return this.el;
        };
        BaseLayer.prototype.update = function () {
            this.updateStyle();
            this.render();
        };
        return BaseLayer;
    }(View_1.View));
    exports.BaseLayer = BaseLayer;
});
define("Core/BaseChart", ["require", "exports", "d3", "lodash", "Core/Evented", "Core/Util", "Core/View"], function (require, exports, d3, _, Evented_2, Util_3, View_2) {
    "use strict";
    exports.__esModule = true;
    var BaseChart = (function (_super) {
        __extends(BaseChart, _super);
        function BaseChart(conf) {
            var _this = _super.call(this) || this;
            _this.isRender = false;
            _this.layers = [];
            _this.config = Util_3.Util.deepExtend(_this.defaultConfig(), conf);
            _this.rootView = new View_2.View({ tagName: "div", className: _this.config.className });
            _this.rootView.style(_this.config.style);
            if (_this.config.el) {
                _this.renderAt(_this.config.el);
            }
            return _this;
        }
        BaseChart.prototype.getLayerContainer = function () {
            return this.rootView;
        };
        BaseChart.prototype.addClass = function (c) {
            this.rootView.addClass(c);
            this.fire("classchange");
            return this;
        };
        BaseChart.prototype.removeClass = function (c) {
            this.rootView.removeClass(c);
            this.fire("classchange");
            return this;
        };
        BaseChart.prototype.defaultConfig = function () {
            return {
                style: {
                    width: "300px",
                    height: "300px",
                    position: "relative"
                },
                className: "chart",
                el: null
            };
        };
        BaseChart.prototype.setStyle = function (c) {
            this.config.style = _.extend(this.config.style, c);
            this.fire("style_change", { style: this.config.style });
        };
        BaseChart.prototype.renderAt = function (dom) {
            if (_.isString(dom)) {
                var n = d3.select(dom).node();
                n.appendChild(this.rootView.el);
            }
            else {
                dom.appendChild(this.rootView.el);
            }
            this.fire("rendered");
            this.isRender = true;
        };
        BaseChart.prototype.toElement = function () {
            if (this.isRender) {
                return this.rootView.el;
            }
            this.fire("rendered");
            this.isRender = true;
            return this.rootView.el;
        };
        // loadMeasures(measures:any[]) {
        //     _.each(measures, (d)=>{
        //         let measure = new Measure(d.id, d.data, d.type)
        //         let i=_.findIndex(this.measures,(mm)=>mm.id==d.id)
        //         if(i!=-1){
        //             this.measures[i]=d
        //         }else{
        //             this.measures.push(d)
        //         }
        //     })
        //     this.fire("measure_change")
        // }
        // addMeasure(m:Measure){
        //     let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
        //     if(i!=-1){
        //         this.measures[i]=m
        //     }else{
        //         this.measures.push(m)
        //     }
        //     this.fire("measure_change")
        // }
        BaseChart.prototype.addLayer = function (l) {
            var i = _.findIndex(this.layers, function (ll) { return ll.id == l.id; });
            if (i != -1) {
                this._clearLayer(this.layers[i]);
                this.layers[i] = l;
            }
            else {
                this.layers.push(l);
            }
            l._onAdd(this);
            this.fire("layer_add layer_change", l);
            return this;
        };
        BaseChart.prototype.removeLayer = function (id) {
            if (_.isObject(id)) {
                var i = _.findIndex(this.layers, function (ll) { return ll.id == id.id; });
                if (i != -1) {
                    this._clearLayer(this.layers[i]);
                    this.layers = _.filter(this.layers, function (ll) { return ll.id != id.id; });
                }
                this.fire("layer_remove layer_change", { layer: this.layers[i] });
            }
            else {
                var i = _.findIndex(this.layers, function (ll) { return ll.id == id; });
                if (i != -1) {
                    this._clearLayer(this.layers[i]);
                    this.layers = _.filter(this.layers, function (ll) { return ll.id != id; });
                }
                this.fire("layer_remove layer_change", { layer: this.layers[i] });
            }
            return this;
        };
        BaseChart.prototype._clearLayer = function (l) {
            l.clear();
            //clear callback
            return this;
        };
        // stringRectCache:any=Util.CacheAble(Util.getStringRect,(s,cls,fontSize)=>s.toString().length+" "+cls+fontSize)
        // getStringRect(s,cls?,fontSize?){
        //     let rect=this.stringRectCache(s,cls,fontSize)
        //     return {width:rect.width,height:rect.height}
        // }
        // getColor(color?){
        //     if(color === undefined)
        //         return d3.schemeCategory20[Math.round(Math.random()*20)]
        //     else if(typeof(color) == "number")
        //         return d3.schemeCategory20[color]
        //     else 
        //         return color
        // }
        BaseChart.prototype.whenReady = function (callback, ctx) {
            if (this.isRender) {
                callback.call(ctx, null);
            }
            this.on("rendered", callback, ctx);
        };
        return BaseChart;
    }(Evented_2.Evented));
    exports.BaseChart = BaseChart;
    var SingleDataChart = (function (_super) {
        __extends(SingleDataChart, _super);
        function SingleDataChart() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SingleDataChart.prototype.getData = function () {
            return this.data;
        };
        SingleDataChart.prototype.setData = function (d) {
            this.fire("data_change", { data: d, oldData: this.data = d });
            this.data = d;
        };
        return SingleDataChart;
    }(BaseChart));
    exports.SingleDataChart = SingleDataChart;
});
define("Component/SingleDataChart/TimeAdjust/TimeAdjust", ["require", "exports", "d3", "lodash", "Core/Util", "Core/BaseChart", "Core/BaseLayer"], function (require, exports, d3, _, Util_4, BaseChart_1, BaseLayer_1) {
    "use strict";
    exports.__esModule = true;
    var TimeAdjustLayer = (function (_super) {
        __extends(TimeAdjustLayer, _super);
        function TimeAdjustLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change data_change", function () {
                    _this.updateStyle();
                    _this.render();
                });
            });
            return _this;
        }
        TimeAdjustLayer.prototype.parseData = function (d) {
            return _.extend({
                rangeMin: "2017/07/01 06:00",
                rangeMax: "2017/07/01 18:00",
                focusTime: "2017/07/01 12:00",
                axisHeight: "20px",
                timeFormat: "%H:%M",
                lineTextPadding: "20px",
                timeRound: 15
            }, d);
        };
        TimeAdjustLayer.prototype.drawer = function (svgNode) {
            var data = this.parseData(this.chart.getData());
            var width = Util_4.Util.toPixel(this.evaluateStyle().width);
            var height = Util_4.Util.toPixel(this.evaluateStyle().height);
            svgNode.append("rect").attr("class", "panel")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height - Util_4.Util.toPixel(data.axisHeight));
            var self = this;
            var formatTime = d3.timeFormat(data.timeFormat);
            var focusTime = new Date(data.focusTime);
            var xScale = d3.scaleTime()
                .domain([new Date(data.rangeMin), new Date(data.rangeMax)])
                .range([6, width - 6]);
            svgNode.append("rect")
                .attr("class", "axisBackground")
                .attr("x", "0")
                .attr("y", height - Util_4.Util.toPixel(data.axisHeight))
                .attr("width", width)
                .attr("height", Util_4.Util.toPixel(data.axisHeight));
            var axis = svgNode.append("g")
                .attr("class", "axis xAxis")
                .attr("transform", "translate(0," + (Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) + ")");
            axis.append("path")
                .attr("class", "domain")
                .attr("stroke", "#000")
                .attr("stroke-width", "1")
                .attr("d", "M 0.5,0 H " + (Util_4.Util.toPixel(this.config.style.width) - 0.5));
            var tick1 = axis.append("g")
                .attr("class", "tick")
                .attr("transform", "translate(0.5,0)");
            tick1.append("text")
                .attr("dy", "3")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "start")
                .text(formatTime(new Date(data.rangeMin)));
            var tick2 = axis.append("g")
                .attr("class", "tick")
                .attr("transform", "translate(" + Util_4.Util.toPixel(this.config.style.width) / 2 + ", 0)");
            tick2.append("text")
                .attr("dy", "3")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "middle")
                .text(formatTime(xScale.invert(Util_4.Util.toPixel(this.config.style.width) / 2)));
            var tick3 = axis.append("g")
                .attr("class", "tick")
                .attr("transform", "translate(" + (Util_4.Util.toPixel(this.config.style.width) - 0.5) + ", 0)");
            tick3.append("text")
                .attr("dy", "3")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "end")
                .text(formatTime(new Date(data.rangeMax)));
            var drag = d3.drag()
                .on("start", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("drag", function () {
                if (d3.event.x >= xScale(new Date(data.rangeMin)) && d3.event.x <= xScale(new Date(data.rangeMax))) {
                    var currentTime = xScale.invert(d3.event.x);
                    svgNode.select(".focusLine").attr("x1", d3.event.x).attr("x2", d3.event.x);
                    svgNode.select(".focusRect").attr("x", d3.event.x - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", d3.event.x - 4).attr("x2", d3.event.x + 4);
                    if (d3.event.x > Util_4.Util.toPixel(self.config.style.width) / 2)
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) - Util_4.Util.toPixel(data.lineTextPadding))).attr("class", "focusText leftSide");
                    else
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) + Util_4.Util.toPixel(data.lineTextPadding))).attr("class", "focusText rightSide");
                    self.fire("draging", { dateTime: currentTime });
                }
            })
                .on("end", function () {
                var currentTime;
                if (d3.event.x >= xScale(new Date(data.rangeMin)) && d3.event.x <= xScale(new Date(data.rangeMax))) {
                    currentTime = xScale.invert(d3.event.x);
                    currentTime.setSeconds(0, 0);
                    var currentMinutes = currentTime.getMinutes();
                    var remainderTime = currentMinutes % data.timeRound;
                    if (remainderTime != 0) {
                        if (remainderTime <= data.timeRound / 2) {
                            currentTime.setMinutes(currentMinutes - remainderTime);
                        }
                        else {
                            currentTime.setMinutes(currentMinutes + data.timeRound - remainderTime);
                        }
                    }
                    self.currentTime = currentTime;
                    svgNode.select(".focusLine").attr("x1", xScale(currentTime)).attr("x2", xScale(currentTime));
                    svgNode.select(".focusRect").attr("x", xScale(currentTime) - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", xScale(currentTime) - 4).attr("x2", xScale(currentTime) + 4);
                    if (d3.event.x > Util_4.Util.toPixel(self.config.style.width) / 2)
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) - Util_4.Util.toPixel(data.lineTextPadding))).attr("class", "focusText leftSide");
                    else
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) + Util_4.Util.toPixel(data.lineTextPadding))).attr("class", "focusText rightSide");
                }
                else if (d3.event.x < xScale(new Date(data.rangeMin))) {
                    currentTime = new Date(data.rangeMin);
                    self.currentTime = currentTime;
                    svgNode.select(".focusLine").attr("x1", xScale(currentTime)).attr("x2", xScale(currentTime));
                    svgNode.select(".focusRect").attr("x", xScale(currentTime) - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", xScale(currentTime) - 4).attr("x2", xScale(currentTime) + 4);
                    svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) + Util_4.Util.toPixel(data.lineTextPadding))).attr("class", "focusText rightSide");
                }
                else if (d3.event.x > xScale(new Date(data.rangeMax))) {
                    currentTime = new Date(data.rangeMax);
                    self.currentTime = currentTime;
                    svgNode.select(".focusLine").attr("x1", xScale(currentTime)).attr("x2", xScale(currentTime));
                    svgNode.select(".focusRect").attr("x", xScale(currentTime) - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", xScale(currentTime) - 4).attr("x2", xScale(currentTime) + 4);
                    svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) - Util_4.Util.toPixel(data.lineTextPadding))).attr("class", "focusText leftSide");
                }
                svgNode.style("cursor", "default");
                self.fire("dragend", { dateTime: self.currentTime });
            });
            svgNode.append("text")
                .attr("class", (xScale(focusTime) > Util_4.Util.toPixel(this.config.style.width) / 2) ? "focusText leftSide" : "focusText rightSide")
                .text(formatTime(new Date(data.focusTime)))
                .attr("x", (xScale(focusTime) > Util_4.Util.toPixel(this.config.style.width) / 2) ? (xScale(focusTime) - Util_4.Util.toPixel(data.lineTextPadding)) : (xScale(focusTime) + Util_4.Util.toPixel(data.lineTextPadding)))
                .attr("y", (Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2);
            var focusGroup = svgNode.append("g")
                .attr("class", "focusGroup")
                .on("mouseenter", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("mouseleave", function () {
                svgNode.style("cursor", "default");
            })
                .call(drag);
            focusGroup.append("line")
                .attr("class", "focusLine")
                .attr("x1", xScale(focusTime))
                .attr("y1", 0)
                .attr("x2", xScale(focusTime))
                .attr("y2", Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight));
            var focusButton = focusGroup.append("g").attr("class", "focusButton");
            focusButton.append("rect")
                .attr("class", "focusRect")
                .attr("x", xScale(focusTime) - 6)
                .attr("y", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2 - 10))
                .attr("rx", "3").attr("ry", "3")
                .attr("width", "12")
                .attr("height", "20");
            focusButton.append("line")
                .attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2 - 5))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2 - 5));
            focusButton.append("line")
                .attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2));
            focusButton.append("line")
                .attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2 + 5))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", ((Util_4.Util.toPixel(this.config.style.height) - Util_4.Util.toPixel(data.axisHeight)) / 2 + 5));
        };
        TimeAdjustLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return TimeAdjustLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TimeAdjustLayer = TimeAdjustLayer;
    var TimeAdjust = (function (_super) {
        __extends(TimeAdjust, _super);
        function TimeAdjust(conf) {
            var _this = _super.call(this, conf) || this;
            _this.timelayer = new TimeAdjustLayer("timelayer", {
                style: {
                    width: function () { return _this.config.style.width; },
                    height: function () { return _this.config.style.height; }
                }
            });
            _this.timelayer.addTo(_this);
            _this.proxyEvents(_this.timelayer, "draging", "dragend");
            return _this;
        }
        TimeAdjust.prototype.defaultConfig = function () {
            return {
                style: {
                    width: "300px",
                    height: "300px",
                    position: "relative"
                },
                className: "timeAdjuster",
                el: null
            };
        };
        TimeAdjust.prototype.setData = function (d) {
            this.data = d;
            this.fire("data_change");
        };
        return TimeAdjust;
    }(BaseChart_1.SingleDataChart));
    exports.TimeAdjust = TimeAdjust;
});
define("Core/BaseMeasure", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var BaseMeasure = (function () {
        function BaseMeasure(id, data, type, style) {
            this.id = id == undefined ? _.uniqueId("measure") : id;
            this.data = data || [];
            this.type = type || "line";
            this.style = style || {};
        }
        return BaseMeasure;
    }());
    exports.BaseMeasure = BaseMeasure;
});
define("Component/MultiDataChart/MultiTypeMeasure", ["require", "exports", "Core/BaseMeasure", "lodash"], function (require, exports, BaseMeasure_1, _) {
    "use strict";
    exports.__esModule = true;
    var MultiDataMeasure = (function (_super) {
        __extends(MultiDataMeasure, _super);
        function MultiDataMeasure() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MultiDataMeasure.prototype.max = function (k) {
            return _.max(_.map(this.data, k));
        };
        MultiDataMeasure.prototype.min = function (k) {
            return _.min(_.map(this.data, k));
        };
        MultiDataMeasure.prototype.getDomain = function (k) {
            return [this.min(k), this.max(k)];
        };
        return MultiDataMeasure;
    }(BaseMeasure_1.BaseMeasure));
    exports.MultiDataMeasure = MultiDataMeasure;
});
define("Component/MultiDataChart/MultiDataChart", ["require", "exports", "d3", "lodash", "Core/BaseChart", "Component/MultiDataChart/MultiTypeMeasure"], function (require, exports, d3, _, BaseChart_2, MultiTypeMeasure_1) {
    "use strict";
    exports.__esModule = true;
    var MultiDataChart = (function (_super) {
        __extends(MultiDataChart, _super);
        function MultiDataChart() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.measures = [];
            _this.colorManager = {};
            _this.colorIndex = 0;
            return _this;
        }
        MultiDataChart.prototype.addMeasure = function (m) {
            var i = _.findIndex(this.measures, function (mm) { return mm.id == m.id; });
            if (i != -1) {
                this.measures[i] = m;
            }
            else {
                this.measures.push(m);
            }
            this.fire("measure_change measure_add", { measure: m });
            return this;
        };
        MultiDataChart.prototype.clearMeasure = function () {
            this.measures = [];
            this.fire("measure_change measure_clear");
        };
        MultiDataChart.prototype.loadMeasures = function (ms) {
            var _this = this;
            _.each(ms, function (d) {
                var m = new MultiTypeMeasure_1.MultiDataMeasure(d.id, d.data, d.type);
                var i = _.findIndex(_this.measures, function (mm) { return mm.id == m.id; });
                if (i != -1) {
                    _this.measures[i] = m;
                }
                else {
                    _this.measures.push(m);
                }
            });
            this.fire("measure_change");
            return this;
        };
        MultiDataChart.prototype.removeMeasure = function (m) {
            if (_.isString(m)) {
                if (_.some(this.measures, function (mm) { return mm.id == m; })) {
                    var rm = _.find(this.measures, { id: m });
                    this.measures = _.filter(this.measures, function (mm) { return mm.id != m; });
                    this.fire("measure_change measure_remove", {
                        measure: rm
                    });
                }
                else if (_.some(this.measures, function (mm) { return mm.type == m; })) {
                    this.measures = _.filter(this.measures, function (mm) { return mm.type != m; });
                    this.fire("measure_change measure_remove");
                }
            }
            else {
                if (_.some(this.measures, function (mm) { return mm.id == m.id; })) {
                    this.measures = _.filter(this.measures, function (mm) { return mm.id != m.id; });
                    this.fire("measure_change measure_remove", {
                        measure: m
                    });
                }
            }
            return this;
        };
        MultiDataChart.prototype.getMeasure = function (type) {
            return _.filter(this.measures, function (mm) { return mm.type == type; });
        };
        MultiDataChart.prototype.getAllMeasure = function () {
            return this.measures;
        };
        MultiDataChart.prototype.getDomain = function (k) {
            return [this.min(k), this.max(k)];
        };
        MultiDataChart.prototype.strToTimeMeasure = function () {
            var ms;
            var temp = [];
            ms = this.measures;
            this.measures = [];
            _.each(ms, function (d, i) {
                var tempData = [];
                _.each(d.data, function (v, k) {
                    if (typeof (v.x) == "string")
                        tempData.push({ x: new Date(v.x), y: v.y });
                    else
                        tempData.push({ x: v.x, y: v.y });
                });
                temp.push(new MultiTypeMeasure_1.MultiDataMeasure(d.id, tempData, d.type));
            });
            this.measures = temp;
            return this;
        };
        MultiDataChart.prototype.max = function (k) {
            var max;
            _.each(this.measures, function (mm) {
                var _max = mm.max(k);
                if (!max) {
                    max = _max;
                }
                else {
                    if (_max > max) {
                        max = _max;
                    }
                }
            });
            return max;
        };
        MultiDataChart.prototype.min = function (k) {
            var min;
            _.each(this.measures, function (mm) {
                var _min = mm.min(k);
                if (!min) {
                    min = _min;
                }
                else {
                    if (_min < min) {
                        min = _min;
                    }
                }
            });
            return min;
        };
        MultiDataChart.prototype.getColor = function (id) {
            if (this.colorManager[id]) {
                return this.colorManager[id];
            }
            else {
                this.colorManager[id] = d3.schemeCategory10[this.colorIndex++ % 10];
                return this.colorManager[id];
            }
        };
        return MultiDataChart;
    }(BaseChart_2.BaseChart));
    exports.MultiDataChart = MultiDataChart;
});
define("Component/MultiDataChart/BarChart/BarData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("Component/MultiDataChart/AxisLayer", ["require", "exports", "d3", "lodash", "Core/Util", "Core/BaseLayer"], function (require, exports, d3, _, Util_5, BaseLayer_2) {
    "use strict";
    exports.__esModule = true;
    var AxisLayer = (function (_super) {
        __extends(AxisLayer, _super);
        function AxisLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        AxisLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "axis",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "200rem",
                    height: "100rem"
                },
                axis: {
                    format: { x: null, y: null },
                    key: { x: "x", y: "y" },
                    ticks: { x: null, y: null }
                },
                borderPadding: 6,
                padding: {
                    top: "10px",
                    right: "20px",
                    bottom: "40px",
                    left: "50px"
                },
                type: "line",
                verticalGridLine: false,
                horizontalGridLine: true,
                yAxisTitleType: "time"
            };
        };
        AxisLayer.prototype.render = function () {
            var _this = this;
            this.el.innerHTML = "";
            var maxX = this.chart.max(this.config.axis.key.x), maxY = this.chart.max(this.config.axis.key.y);
            var xScale, yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([(Util_5.Util.toPixel(this.config.style.height) - Util_5.Util.toPixel(this.config.padding.bottom)),
                Util_5.Util.toPixel(this.config.padding.top)]);
            if (this.config.type == "line") {
                xScale = d3.scaleLinear()
                    .domain([0, this.chart.max(this.config.axis.key.x)])
                    .range([Util_5.Util.toPixel(this.config.padding.left),
                    (Util_5.Util.toPixel(this.config.style.width) - Util_5.Util.toPixel(this.config.padding.right))]);
            }
            else if (this.config.type == "ordinal") {
                var domain_1 = [], ds = this.chart.measures[0].data;
                _.each(ds, function (d, i) {
                    domain_1.push(d.x);
                });
                xScale = d3.scaleBand()
                    .domain(domain_1)
                    .range([Util_5.Util.toPixel(this.config.padding.left),
                    Util_5.Util.toPixel(this.config.style.width) - Util_5.Util.toPixel(this.config.padding.right)])
                    .paddingInner(0.1)
                    .paddingOuter(0.2);
            }
            else if (this.config.type == "time") {
                xScale = d3.scaleTime()
                    .domain([this.chart.min(this.config.axis.key.x), (this.chart.max(this.config.axis.key.x))])
                    .range([Util_5.Util.toPixel(this.config.padding.left),
                    Util_5.Util.toPixel(this.config.style.width) - Util_5.Util.toPixel(this.config.padding.right)]);
            }
            if (this.config.verticalGridLine) {
                var xGridLine = d3.axisBottom(xScale)
                    .tickSize(Util_5.Util.toPixel(this.config.style.height) - Util_5.Util.toPixel(this.config.padding.top) - Util_5.Util.toPixel(this.config.padding.bottom))
                    .tickFormat(function (d, i) { return ""; });
                this.elD3.append("g")
                    .call(xGridLine)
                    .attr("transform", "translate(0, " + Util_5.Util.toPixel(this.config.padding.top) + ")")
                    .attr("class", "grid-line");
            }
            if (this.config.horizontalGridLine) {
                var yGridLine = d3.axisLeft(yScale)
                    .tickSize(Util_5.Util.toPixel(this.config.style.width) - Util_5.Util.toPixel(this.config.padding.left) - Util_5.Util.toPixel(this.config.padding.right))
                    .tickFormat(function (d, i) { return ""; });
                this.elD3.append("g")
                    .call(yGridLine)
                    .attr("transform", "translate(" + (Util_5.Util.toPixel(this.config.style.width) - Util_5.Util.toPixel(this.config.padding.right)) + ", 0)")
                    .attr("class", "grid-line");
            }
            var xAxis = d3.axisBottom(xScale)
                .tickFormat(this.config.axis.format.x)
                .ticks(this.config.axis.ticks.x);
            this.elD3.append("g")
                .classed("xAxis axis", true)
                .call(xAxis)
                .attr("transform", "translate(0," + (Util_5.Util.toPixel(this.config.style.height) - Util_5.Util.toPixel(this.config.padding.bottom)) + ")");
            var yAxisTitle, yAxisTickFormat;
            if (this.config.yAxisTitleType == "time") {
                if (maxY <= 60) {
                    yAxisTitle = "seconds";
                    yAxisTickFormat = function (d) {
                        return d.toString();
                    };
                }
                else if (maxY <= 3600) {
                    yAxisTitle = "minutes";
                    yAxisTickFormat = function (d) {
                        return d3.format(".1f")(d / 60);
                    };
                }
                else {
                    yAxisTitle = "hours";
                    yAxisTickFormat = function (d) {
                        return d3.format(".1f")(d / 3600);
                    };
                }
            }
            else if (this.config.yAxisTitleType == "speed") {
                yAxisTitle = "km/h";
                yAxisTickFormat = function (d) {
                    return d3.format(".1f")(d);
                };
            }
            var yAxis = d3.axisLeft(yScale)
                .ticks(this.config.axis.ticks.y)
                .tickFormat(yAxisTickFormat);
            this.elD3.append("g")
                .classed("yAxis axis", true)
                .call(yAxis)
                .attr("transform", "translate(" + Util_5.Util.toPixel(this.config.padding.left) + ",0)");
            this.elD3.append("text")
                .classed("yAxisTitle", true)
                .attr("x", -70)
                .attr("y", 0)
                .attr("transform", "rotate(-90)")
                .attr("alignment-baseline", "hanging")
                .text(yAxisTitle);
            var zoomed = function () {
                var zoomScale = d3.event.transform.rescaleY(yScale);
                yAxis = d3.axisLeft(zoomScale);
                yAxis.tickFormat(yAxisTickFormat);
                _this.elD3.select(".yAxis").call(yAxis);
            };
            this.chart.on("lineZooming", zoomed);
            return this;
        };
        return AxisLayer;
    }(BaseLayer_2.BaseLayer));
    exports.AxisLayer = AxisLayer;
});
define("Component/Layer/TooltipLayer", ["require", "exports", "d3", "lodash", "Core/Util", "Core/BaseLayer"], function (require, exports, d3, _, Util_6, BaseLayer_3) {
    "use strict";
    exports.__esModule = true;
    var TooltipLayer = (function (_super) {
        __extends(TooltipLayer, _super);
        function TooltipLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change data_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        TooltipLayer.prototype.defaultConfig = function () {
            return {
                tagName: "div",
                className: "tooltipContainer",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "150px",
                    height: "100px"
                }
            };
        };
        TooltipLayer.prototype.getSingleTooltipContent = function (ds) {
            var textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>" + ds.xMark + "</th></tr>";
            var text = "<tr><td class='name'><span style='background-color:" + this.chart.getColor(ds.series) + "'></span>" + ds.series + "</td><td class='value'>" + ds.value + "</td></tr>";
            var textEnd = "</tbody></table>";
            return textStart + text + textEnd;
        };
        TooltipLayer.prototype.getGroupTooltipContent = function (ds) {
            var _this = this;
            var textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>" + ds.xMark + "</th></tr>";
            var text = "";
            _.each(ds.data, function (d) {
                text += "<tr><td class='name'><span style='background-color:" + _this.chart.getColor(d.id) + "'></span>" + d.id + "</td><td class='value'>" + d.value + "</td></tr>";
            });
            var textEnd = "</tbody></table>";
            return textStart + text + textEnd;
        };
        TooltipLayer.prototype.render = function () {
            var _this = this;
            this.el.innerHTML = "";
            var tooltipBox = this.elD3.append("div");
            this.chart.on("showSingleTooltip", function (d) {
                tooltipBox.style("display", "block")
                    .html(_this.getSingleTooltipContent(d));
            });
            this.chart.on("showGroupTooltip", function (d) {
                tooltipBox.style("display", "block")
                    .html(_this.getGroupTooltipContent(d));
            });
            this.chart.on("moveTooltip", function () {
                if (d3.mouse(_this.el)[0] > Util_6.Util.toPixel(_this.config.style.width) / 2) {
                    tooltipBox.style("top", d3.mouse(_this.el)[1] + "px")
                        .style("left", d3.mouse(_this.el)[0] - Util_6.Util.toPixel(tooltipBox.style("width")) + "px")
                        .style("position", "absolute");
                }
                else {
                    tooltipBox.style("top", d3.mouse(_this.el)[1] + "px")
                        .style("left", d3.mouse(_this.el)[0] + "px")
                        .style("position", "absolute");
                }
            });
            this.chart.on("hideTooltip", function () {
                tooltipBox.style("display", "none");
            });
            return this;
        };
        return TooltipLayer;
    }(BaseLayer_3.BaseLayer));
    exports.TooltipLayer = TooltipLayer;
});
define("Component/MultiDataChart/LegendLayer", ["require", "exports", "lodash", "Core/BaseLayer"], function (require, exports, _, BaseLayer_4) {
    "use strict";
    exports.__esModule = true;
    var LegendLayer = (function (_super) {
        __extends(LegendLayer, _super);
        function LegendLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        LegendLayer.prototype.defaultConfig = function () {
            return {
                tagName: "div",
                className: "legend",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "20rem",
                    height: "2rem"
                }
            };
        };
        LegendLayer.prototype.render = function () {
            var _this = this;
            this.el.innerHTML = "";
            var ds = this.chart.getAllMeasure();
            var legendGroup = this.elD3.append("div").attr("class", "legendGroup");
            _.each(ds, function (d, i) {
                var legendUnit = legendGroup.append("div").attr("class", "legendUnit legendUnit" + i);
                legendUnit.append("span").style("background-color", _this.chart.getColor(d.id)).classed("iconSpan", true);
                legendUnit.append("span").text(d.id).classed("textSpan", true);
            });
            return this;
        };
        return LegendLayer;
    }(BaseLayer_4.BaseLayer));
    exports.LegendLayer = LegendLayer;
});
define("Component/Layer/TitleLayer", ["require", "exports", "Core/BaseLayer"], function (require, exports, BaseLayer_5) {
    "use strict";
    exports.__esModule = true;
    var TitleLayer = (function (_super) {
        __extends(TitleLayer, _super);
        function TitleLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TitleLayer.prototype.defaultConfig = function () {
            return {
                tagName: "div",
                className: "title",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "40rem",
                    height: "2rem"
                },
                value: ""
            };
        };
        TitleLayer.prototype.setTitle = function (t) {
            this.config.value = t;
            this.render();
        };
        TitleLayer.prototype.render = function () {
            var t = this.config.value;
            var node = this.elD3.select("p");
            if (node.empty()) {
                node = this.elD3.append("p");
            }
            node.text(t);
            return this;
        };
        return TitleLayer;
    }(BaseLayer_5.BaseLayer));
    exports.TitleLayer = TitleLayer;
});
define("Component/MultiDataChart/LineChart/LineChart", ["require", "exports", "d3", "lodash", "Core/Util", "Component/MultiDataChart/MultiDataChart", "Core/BaseLayer", "Component/MultiDataChart/AxisLayer", "Component/Layer/TooltipLayer", "Component/MultiDataChart/LegendLayer", "Component/Layer/TitleLayer", "Component/MultiDataChart/MultiTypeMeasure"], function (require, exports, d3, _, Util_7, MultiDataChart_1, BaseLayer_6, AxisLayer_1, TooltipLayer_1, LegendLayer_1, TitleLayer_1, MultiTypeMeasure_2) {
    "use strict";
    exports.__esModule = true;
    var LineChartMeasure = (function (_super) {
        __extends(LineChartMeasure, _super);
        function LineChartMeasure(id, data, type, style) {
            var _this = _super.call(this, id, data, type, style) || this;
            _this.parseMeasure();
            return _this;
        }
        LineChartMeasure.prototype.parseMeasure = function () {
            _.each(this.data, function (v, k) {
                if (typeof (v.x) == "string")
                    v.x = new Date(v.x);
            });
            return this;
        };
        return LineChartMeasure;
    }(MultiTypeMeasure_2.MultiDataMeasure));
    exports.LineChartMeasure = LineChartMeasure;
    var LineLayer = (function (_super) {
        __extends(LineLayer, _super);
        function LineLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.curveTypeMap = {
                linear: d3.curveLinear,
                basis: d3.curveBasis,
                cardinal: d3.curveCardinal,
                step: d3.curveStep
            };
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        LineLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "lineChart",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "400rem",
                    height: "200rem"
                },
                borderPadding: 6,
                curveType: "linear",
                hasDot: true,
                hasArea: false,
                hasTooltip: true,
                hasTimeAdjust: true,
                yAxisTitleType: "time"
            };
        };
        LineLayer.prototype.getScale = function () {
            var ds = this.chart.getMeasure("line");
            if (!ds || typeof (ds) == undefined || ds.length == 0 || !ds[0].data || ds[0].data.length == 0) {
                return;
            }
            if (typeof (ds[0].data[0].x) == "string") {
                this.chart.strToTimeMeasure();
            }
            var maxX = this.chart.max("x"), minX = this.chart.min("x"), maxY = this.chart.max("y");
            var width = Util_7.Util.toPixel(this.config.style.width), height = Util_7.Util.toPixel(this.config.style.height);
            var xScale;
            if (typeof (ds[0].data[0].x) == "string") {
                xScale = d3.scaleTime()
                    .domain([minX, maxX])
                    .range([this.config.borderPadding, width - this.config.borderPadding]);
            }
            else {
                xScale = d3.scaleLinear()
                    .domain([minX, maxX])
                    .range([this.config.borderPadding, width - this.config.borderPadding]);
            }
            ds = this.chart.getMeasure("line");
            var yScale = d3.scaleLinear()
                .domain([0, maxY * 1.1])
                .range([height - this.config.borderPadding, this.config.borderPadding]);
            return { xScale: xScale, yScale: yScale };
        };
        LineLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var self = this;
            var ds = this.chart.getMeasure("line");
            if (!ds || typeof (ds) == undefined || ds.length == 0 || !ds[0].data || ds[0].data.length == 0) {
                return;
            }
            if (typeof (ds[0].data[0].x) == "string") {
                this.chart.strToTimeMeasure();
            }
            ds = this.chart.getMeasure("line");
            var series = ds.length;
            var maxX = this.chart.max("x"), minX = this.chart.min("x"), maxY = this.chart.max("y");
            var width = Util_7.Util.toPixel(this.config.style.width), height = Util_7.Util.toPixel(this.config.style.height);
            var xScale = this.getScale().xScale, yScale = this.getScale().yScale;
            var line = d3.line()
                .x(function (v) { return xScale(v.x); })
                .y(function (v) { return yScale(v.y); })
                .curve(this.curveTypeMap[this.config.curveType]);
            _.each(ds, function (d, i) {
                var group = svgNode.append("svg:g")
                    .attr("class", "lineSeries")
                    .attr("id", "lineSeries" + i);
                group.append("path")
                    .attr("class", "line" + i)
                    .attr("d", line(d.data))
                    .attr("stroke", _this.chart.getColor(d.id));
                if (_this.config.hasDot) {
                    _.each(d.data, function (v, k) {
                        group.append("circle")
                            .attr("class", "circle" + i + k)
                            .attr("cx", xScale(v.x))
                            .attr("cy", yScale(v.y))
                            .attr("r", "4")
                            .attr("fill", _this.chart.getColor(d.id));
                    });
                }
                if (_this.config.hasArea) {
                    var area = d3.area()
                        .x(function (d) { return xScale(d.x); })
                        .y0(Util_7.Util.toPixel(_this.config.style.height))
                        .y1(function (d) { return yScale(d.y); });
                    group.append("g")
                        .attr("class", "lineArea")
                        .append("path")
                        .attr("d", area(d.data))
                        .attr("fill", _this.chart.getColor(d.id));
                }
            });
            if (this.config.hasTooltip) {
                var allRect_1 = [], allRectX_1 = [], allRectInterval = [];
                _.each(ds, function (d, i) {
                    allRectX_1 = _.union(allRectX_1, _.map(d.data, "x"));
                });
                allRectX_1 = allRectX_1.sort(function (a, b) {
                    return a > b ? 1 : -1;
                });
                var re = [allRectX_1[0]];
                for (var i = 1; i < allRectX_1.length; i++) {
                    if (allRectX_1[i].toString() != allRectX_1[i - 1].toString())
                        re.push(allRectX_1[i]);
                }
                allRectX_1 = re;
                for (var i = 1; i < allRectX_1.length; i++) {
                    allRectInterval.push(allRectX_1[i] - allRectX_1[i - 1]);
                }
                var rectWidth_1 = ((_.min(allRectInterval)) / (maxX - minX)) * (width - this.config.borderPadding) / 3 * 2;
                _.each(allRectX_1, function (x) {
                    var data = [];
                    _.each(ds, function (d) {
                        var value = _.filter(d.data, function (dd) { return dd.x.toString() == x.toString(); })[0];
                        if (value != undefined) {
                            if (_this.config.yAxisTitleType == "time") {
                                data.push({ id: d.id, value: d3.format(".1f")(value.y) + "s" });
                                // if(maxY<=60)
                                //     data.push({id:d.id, value:d3.format(".1f")(value.y)+"s"})
                                // else if(maxY <= 3600)
                                //     data.push({id:d.id, value:d3.format(".1f")(value.y/60)+"min"})
                                // else 
                                //     data.push({id:d.id, value:d3.format(".1f")(value.y/3600)+"h"})
                            }
                            else if (_this.config.yAxisTitleType == "speed") {
                                data.push({ id: d.id, value: d3.format(".1f")(value.y) + "km/h" });
                            }
                        }
                    });
                    allRect_1.push({ xMark: x, data: data });
                });
                var focusLine_1 = svgNode.append("line").attr("class", "focusLine");
                var overlay_1 = svgNode.append("g").attr("class", "overlay");
                _.each(allRect_1, function (d, i) {
                    overlay_1.append("rect")
                        .attr("class", "eventRect" + i)
                        .attr("x", xScale(d.xMark) - rectWidth_1 / 2)
                        .attr("y", _this.config.borderPadding)
                        .attr("width", rectWidth_1)
                        .attr("height", height - _this.config.borderPadding * 2)
                        .on("mouseenter", function () {
                        focusLine_1.style("display", null);
                        self.chart.fire("showGroupTooltip", { xMark: d3.timeFormat("%H:%M")(d.xMark), data: d.data });
                    })
                        .on("mousemove", function () {
                        focusLine_1.attr("x1", xScale(d.xMark))
                            .attr("y1", self.config.borderPadding)
                            .attr("x2", xScale(d.xMark))
                            .attr("y2", height - self.config.borderPadding);
                        self.chart.fire("moveTooltip");
                    })
                        .on("mouseleave", function () {
                        focusLine_1.style("display", "none");
                        self.chart.fire("hideTooltip");
                    });
                });
            }
            if (this.config.hasTimeAdjust) {
                var adjustLine = svgNode.append("line")
                    .attr("class", "adjustLine")
                    .attr("x1", xScale(minX))
                    .attr("y1", this.config.borderPadding)
                    .attr("x2", xScale(minX))
                    .attr("y2", height - self.config.borderPadding);
            }
            var zoomed = function () {
                var zoomScale = d3.event.transform.rescaleY(yScale);
                line = d3.line()
                    .x(function (v) { return xScale(v.x); })
                    .y(function (v) { return zoomScale(v.y); });
                _.each(ds, function (d, i) {
                    svgNode.select(".line" + i)
                        .attr("d", line(d.data));
                    _.each(d.data, function (v, k) {
                        svgNode.select(".circle" + i + k)
                            .attr("cy", zoomScale(v.y));
                    });
                });
                _this.chart.fire("lineZooming");
            };
            var zoom = d3.zoom()
                .scaleExtent([1, 5])
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", zoomed);
            svgNode.call(zoom);
            return this;
        };
        LineLayer.prototype.setTime = function (time) {
            var xScale = this.getScale().xScale;
            if (typeof (time) == "string") {
                time = new Date(time);
            }
            d3.select(".adjustLine")
                .attr("x1", xScale(time))
                .attr("x2", xScale(time));
        };
        LineLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return LineLayer;
    }(BaseLayer_6.BaseLayer));
    exports.LineLayer = LineLayer;
    var LineChart = (function (_super) {
        __extends(LineChart, _super);
        function LineChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.on("meaure_change", _this.strToTimeMeasure);
            _this.chartTitleLayer = new TitleLayer_1.TitleLayer("chartTitle", {
                className: "chartTitle",
                style: {
                    width: function () { return _this.config.style.width; }
                },
                value: "Line Chart" //conf.chartTitle.value||"Line Chart"
            });
            _this.chartTitleLayer.addTo(_this);
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", {
                style: {
                    top: function () { return _this.config.chartTitle.style.height; },
                    width: function () { return _this.config.style.width; },
                    height: function () { return Util_7.Util.toPixel(_this.config.style.height) - Util_7.Util.toPixel(_this.config.legend.style.height) - Util_7.Util.toPixel(_this.config.chartTitle.style.height); }
                },
                axis: {
                    format: {
                        x: d3.timeFormat("%H:%M")
                    }
                },
                type: "time"
            });
            _this.axisLayer.addTo(_this);
            _this.lineLayer = new LineLayer("line", {
                style: {
                    top: function () { return Util_7.Util.toPixel(_this.config.axis.padding.top) - _this.config.axis.borderPadding + Util_7.Util.toPixel(_this.config.chartTitle.style.height); },
                    left: function () { return Util_7.Util.toPixel(_this.config.axis.padding.left) - _this.config.axis.borderPadding; },
                    width: function () { return Util_7.Util.toPixel(_this.config.style.width) - Util_7.Util.toPixel(_this.config.axis.padding.left) - Util_7.Util.toPixel(_this.config.axis.padding.right) + _this.config.axis.borderPadding * 2; },
                    height: function () { return Util_7.Util.toPixel(_this.config.style.height) - Util_7.Util.toPixel(_this.config.axis.padding.top) - Util_7.Util.toPixel(_this.config.axis.padding.bottom) - Util_7.Util.toPixel(_this.config.legend.style.height) - Util_7.Util.toPixel(_this.config.chartTitle.style.height) + _this.config.axis.borderPadding * 2; }
                }
            });
            _this.lineLayer.addTo(_this);
            if (_this.config.line.hasTooltip) {
                _this.tooltipLayer = new TooltipLayer_1.TooltipLayer("tooltip", {
                    style: {
                        top: function () { return Util_7.Util.toPixel(_this.config.axis.padding.top) - _this.config.axis.borderPadding + Util_7.Util.toPixel(_this.config.chartTitle.style.height); },
                        left: function () { return Util_7.Util.toPixel(_this.config.axis.padding.left) - _this.config.axis.borderPadding; },
                        width: function () { return Util_7.Util.toPixel(_this.config.style.width) - Util_7.Util.toPixel(_this.config.axis.padding.left) - Util_7.Util.toPixel(_this.config.axis.padding.right) + _this.config.axis.borderPadding * 2; },
                        height: function () { return Util_7.Util.toPixel(_this.config.style.height) - Util_7.Util.toPixel(_this.config.axis.padding.top) - Util_7.Util.toPixel(_this.config.axis.padding.bottom) - Util_7.Util.toPixel(_this.config.legend.style.height) - Util_7.Util.toPixel(_this.config.chartTitle.style.height) + _this.config.axis.borderPadding * 2; }
                    }
                });
                _this.tooltipLayer.addTo(_this);
            }
            _this.legendLayer = new LegendLayer_1.LegendLayer("legend", {
                style: {
                    top: function () { return Util_7.Util.toPixel(_this.config.style.height) - Util_7.Util.toPixel(_this.config.legend.style.height); },
                    left: function () { return _this.config.axis.padding.left; },
                    width: function () { return Util_7.Util.toPixel(_this.config.style.width) - Util_7.Util.toPixel(_this.config.axis.padding.left) - Util_7.Util.toPixel(_this.config.axis.padding.right); }
                }
            });
            _this.legendLayer.addTo(_this);
            return _this;
        }
        LineChart.prototype.defaultConfig = function () {
            return {
                className: "chart",
                style: {
                    width: "40rem",
                    height: "30rem",
                    position: "relative"
                },
                el: null,
                line: {
                    tagName: "svg",
                    className: "lineChart",
                    style: {
                        top: "0px",
                        left: "0px",
                        bottom: null,
                        right: null,
                        position: "absolute",
                        zindex: 0,
                        width: "40rem",
                        height: "30rem"
                    },
                    borderPadding: 6,
                    curveType: "linear",
                    hasDot: true,
                    hasArea: false,
                    hasTooltip: true,
                    hasTimeAdjust: true,
                    yAxisTitleType: "time"
                },
                axis: {
                    tagName: "svg",
                    className: "axis",
                    style: {
                        top: "0px",
                        left: "0px",
                        bottom: null,
                        right: null,
                        position: "absolute",
                        zindex: 0,
                        width: "40rem",
                        height: "30rem"
                    },
                    axis: {
                        format: { x: null, y: null },
                        key: { x: "x", y: "y" },
                        ticks: { x: null, y: null }
                    },
                    borderPadding: 6,
                    padding: {
                        top: "10px",
                        right: "20px",
                        bottom: "40px",
                        left: "50px"
                    },
                    type: "line",
                    verticalGridLine: false,
                    horizontalGridLine: true,
                    yAxisTitleType: "time"
                },
                tooltip: {
                    tagName: "div",
                    className: "tooltipContainer",
                    style: {
                        top: "0px",
                        left: "0px",
                        bottom: null,
                        right: null,
                        position: "absolute",
                        zindex: 0,
                        width: "40rem",
                        height: "30rem"
                    }
                },
                legend: {
                    tagName: "div",
                    className: "legend",
                    style: {
                        top: "0px",
                        left: "0px",
                        bottom: null,
                        right: null,
                        position: "absolute",
                        zindex: 0,
                        width: "40rem",
                        height: "2rem"
                    }
                },
                chartTitle: {
                    tagName: "div",
                    className: "title",
                    style: {
                        top: "0px",
                        left: "0px",
                        bottom: null,
                        right: null,
                        position: "absolute",
                        zindex: 0,
                        width: "40rem",
                        height: "2rem"
                    },
                    value: ""
                }
            };
        };
        LineChart.prototype.loadMeasures = function (ms) {
            var _this = this;
            _.each(ms, function (d) {
                var m = new LineChartMeasure(d.id, d.data, d.type);
                var i = _.findIndex(_this.measures, function (mm) { return mm.id == m.id; });
                if (i != -1) {
                    _this.measures[i] = m;
                }
                else {
                    _this.measures.push(m);
                }
            });
            this.fire("measure_change");
            return this;
        };
        LineChart.prototype.setConfig = function (c) {
            this.lineLayer.setConfig(_.toArray(_.pick(c, "line")));
            this.axisLayer.setConfig(_.toArray(_.pick(c, "axis")));
            this.legendLayer.setConfig(_.toArray(_.pick(c, "legend")));
            this.tooltipLayer.setConfig(_.toArray(_.pick(c, "tooltip")));
            this.chartTitleLayer.setConfig(_.toArray(_.pick(c, "chartTitle")));
        };
        LineChart.prototype.setTimeAdjust = function (time) {
            this.lineLayer.setTime(time);
        };
        return LineChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.LineChart = LineChart;
});
define("CustomizedChart/Vicroad/VicroadChart", ["require", "exports", "Component/SingleDataChart/TimeAdjust/TimeAdjust", "Component/MultiDataChart/LineChart/LineChart"], function (require, exports, TimeAdjust_1, LineChart_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    exports.__esModule = true;
    __export(TimeAdjust_1);
    __export(LineChart_1);
});
