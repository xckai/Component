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
define("Jigsaw/Utils/FP", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    function curry2(f) {
        function curriedFunction(t1, t2) {
            switch (arguments.length) {
                case 1:
                    return function (t2) {
                        return f(t1, t2);
                    };
                case 2:
                    return f(t1, t2);
            }
        }
        return curriedFunction;
    }
    exports.curry2 = curry2;
    function curry3(f) {
        function curriedFunction(t1, t2, t3) {
            switch (arguments.length) {
                case 1:
                    return curry2(function (t2, t3) {
                        return f(t1, t2, t3);
                    });
                case 2:
                    return function (t3) {
                        return f(t1, t2, t3);
                    };
                case 3:
                    return f(t1, t2, t3);
            }
        }
        return curriedFunction;
    }
    exports.curry3 = curry3;
    function curry4(f) {
        function curriedFunction(t1, t2, t3, t4) {
            switch (arguments.length) {
                case 1:
                    return curry3(function (t2, t3, t4) {
                        return f(t1, t2, t3, t4);
                    });
                case 2:
                    return curry2(function (t3, t4) {
                        return f(t1, t2, t3, t4);
                    });
                case 3:
                    return function (t4) {
                        return f(t1, t2, t3, t4);
                    };
                case 4:
                    return f(t1, t2, t3, t4);
            }
        }
        return curriedFunction;
    }
    exports.curry4 = curry4;
    function curry(f) {
        var argsLength = f.length;
        switch (argsLength) {
            case 0:
                return f;
            case 1:
                return f;
            case 2:
                return curry2(f);
            case 3:
                return curry3(f);
            case 4:
                return curry4(f);
            default:
                throw new SyntaxError("More than 4 args in " + f.toString());
        }
    }
    exports.curry = curry;
    function checkIteratorCollection() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (t1, key, collection) {
            var r = false;
            for (var i = 0; i < args.length; ++i) {
                if (!args[i](t1, key, collection)) {
                    r = false;
                    break;
                }
                else {
                    r = true;
                }
            }
            return r;
        };
    }
    exports.checkIteratorCollection = checkIteratorCollection;
});
define("Jigsaw/Utils/Util", ["require", "exports", "underscore", "Jigsaw/Utils/FP"], function (require, exports, _, FP_1) {
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
            if (key) {
                nums = nums.map(function (n) { return n[key]; });
            }
            nums.forEach(function (num) {
                n = isNaN(num) ? n : n > num ? n : num;
            });
            n = n == Number.MIN_VALUE ? 0 : n;
            return n;
        }
        Util.max = max;
        function min(ns, key) {
            var n = Number.MAX_VALUE;
            if (key) {
                ns = ns.map(function (n) { return n[key]; });
            }
            ns.forEach(function (num) {
                n = isNaN(num) ? n : n < num ? n : num;
            });
            n = n == Number.MAX_VALUE ? 0 : n;
            return n;
        }
        Util.min = min;
        Util.d3Invoke = FP_1.curry(function (method, obj) {
            return function (d3Selection) {
                _.each(obj, function (v, k) {
                    d3Selection[method](k, v);
                });
                return d3Selection;
            };
        });
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
                    console.log("not cached", args);
                    return cache[_key.apply(null, args)] = fn.apply(null, args);
                }
            };
        }
        Util.CacheAble = CacheAble;
        function getProperty(obj, paths) {
            var spliter = "/";
            var path = paths.split("/");
            var r = obj;
            for (var i = 0; i < path.length; ++i) {
                if (_.has(r, path[i])) {
                    r = r[path[i]];
                }
                else {
                    r = undefined;
                }
            }
            return r;
        }
        Util.getProperty = getProperty;
        function arguments2Array(args) {
            var r = [];
            for (var i = 0; i < args.length; ++i) {
                r.push(args[i]);
            }
            return r;
        }
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
        var loader;
        (function (loader) {
            function addKeyFrames(frameData) {
                var frameName = frameData.name || "";
                var css = "";
                css += ("@-webkit-keyframes " + frameName + "{");
                for (var key in frameData) {
                    if (key !== "name" && key !== "media" && key !== "complete") {
                        css += key + " {";
                        for (var property in frameData[key]) {
                            css += property + ":" + frameData[key][property] + ";";
                        }
                        css += "}";
                    }
                }
                css += "}";
                var ssDom = $("style#" + frameName);
                if (ssDom.length > 0) {
                    ssDom.html(css);
                }
                else {
                    ssDom = $("<style></style>").attr({ "id": frameName, type: "text/css" })
                        .html(css).appendTo("head");
                }
            }
            loader.addKeyFrames = addKeyFrames;
            function genBallBusy(size, num) {
                var i = num == undefined ? 3 : num;
                var $div = $("<div class='busyContainer'></div>").css({
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    left: "0px",
                    right: "0px",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "z-index": 10000
                });
                var c = $("<div></div>").css({
                    display: "inline-flex"
                });
                var w = size;
                for (var ii = 0; ii < i; ++ii) {
                    var t = $("<div class='ball'></div>");
                    t.css({
                        width: w + "rem",
                        height: w + "rem",
                        margin: 0.6 * w + "rem",
                        "border-radius": "100%",
                        animation: "shake 1s ease-in-out+" + 2 * ii / i + "s infinite  alternate"
                    });
                    c.append(t);
                }
                var beginkey = 100 / i + "%", endkey = 300 / i + "%", frame = {
                    name: "shake",
                    from: { "-webkit-transform": "scale(1); " },
                    "to": { "-webkit-transform": "scale(2); " }
                };
                // frame[beginkey]={ "-webkit-transform":"scale(2); "}
                // frame[endkey]={ "-webkit-transform":"scale(1); "}
                addKeyFrames(frame);
                $div.append(c);
                return $div.get(0);
            }
            loader.genBallBusy = genBallBusy;
            var ProgressBarLoader = (function () {
                function ProgressBarLoader(w, h, str) {
                    this.width = w || 300;
                    this.height = h || 300;
                    this.loadingText = str || "Loading...";
                }
                ProgressBarLoader.prototype.makeSVG = function (tag, attributes) {
                    var SVG_NS = "http://www.w3.org/2000/svg";
                    var elem = document.createElementNS(SVG_NS, tag);
                    for (var attribute in attributes) {
                        var name = attribute;
                        var value = attributes[attribute];
                        elem.setAttribute(name, value);
                    }
                    return elem;
                };
                ProgressBarLoader.prototype.toHtml = function () {
                    var container = this.container = $("<div class='progressContainer'></div>").css({
                        position: "absolute",
                        top: "0px",
                        bottom: "0px",
                        left: "0px",
                        right: "0px",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        "z-index": 10000,
                        "transform": "translate(-100%,0)",
                        transition: "transform 1s linear"
                    })[0], svgNode;
                    this.svgNode = svgNode = this.makeSVG("svg", { width: this.width, height: this.height });
                    var defs = this.makeSVG("defs", {});
                    var linearGradient = this.makeSVG("linearGradient", { id: "color-gradient", x1: "0", y1: "0%", x2: "99.33%", y2: "0%", gradientUnits: "userSpaceOnUse" });
                    var stop1 = this.makeSVG("stop", { offset: "0%", style: "stop-color:yellow" });
                    var stop2 = this.makeSVG("stop", { offset: "100%", style: "stop-color:aqua" });
                    linearGradient.appendChild(stop1);
                    linearGradient.appendChild(stop2);
                    defs.appendChild(linearGradient);
                    svgNode.appendChild(defs);
                    var lineBase = this.makeSVG("line", { "stroke-width": 30,
                        stroke: "#fff",
                        "stroke-dasharray": "5.5",
                        x1: "0", y1: this.height / 3,
                        x2: "100%", y2: this.height / 3 + 0.001,
                        "class": "linebase" });
                    var lineColor = this.barLineNode = this.makeSVG("line", { transition: "all 0.5s ease",
                        "stroke-width": 30,
                        "stroke-dasharray": "5.5",
                        x1: "0", y1: this.height / 3,
                        x2: "0%", y2: this.height / 3 + 0.001,
                        "class": "linecolor" });
                    svgNode.appendChild(lineBase);
                    svgNode.appendChild(lineColor);
                    var text = this.makeSVG("text", { transform: "translate(" + this.width / 2 + "," + this.height / 3 * 2 + ")",
                        "font-size": "20px",
                        "text-anchor": " middle",
                        fill: "#fff",
                        "stroke-width": 0,
                        "class": "texts"
                    });
                    var str = this.loadingText;
                    for (var i = 0; i < str.length; i++) {
                        var tspan = this.makeSVG("tspan", {});
                        tspan.textContent = str.charAt(i);
                        var animateSize = this.makeSVG("animate", { id: "ani" + i, attributeName: "font-size", values: "20;24;20", begin: (i == 0 ? "0s" : ("ani" + (i - 1) + ".end")), dur: "0.5s", repeatCount: "indefinite" });
                        var animateColor = this.makeSVG("animate", { attributeName: "fill", from: "yellow", to: "aqua", begin: (i == 0 ? "0s" : ("ani" + (i - 1) + ".end")), dur: "0.5s", repeatCount: "indefinite" });
                        tspan.appendChild(animateSize);
                        tspan.appendChild(animateColor);
                        text.appendChild(tspan);
                    }
                    svgNode.appendChild(text);
                    container.appendChild(svgNode);
                    return container;
                };
                ProgressBarLoader.prototype.setProgress = function (v) {
                    if (this.barLineNode) {
                        this.barLineNode.setAttribute("x2", v + "%");
                    }
                };
                ProgressBarLoader.prototype.show = function () {
                    var _this = this;
                    setTimeout(function () {
                        _this.container.style.transform = "translate(0,0)";
                    }, 10);
                };
                ProgressBarLoader.prototype.remove = function () {
                    var _this = this;
                    if (this.container.parent) {
                        this.container.style.transform = "translate(-100%,0)";
                        setTimeout(function () {
                            _this.container.parent.removeChild(_this.container);
                        }, 1000);
                    }
                };
                return ProgressBarLoader;
            }());
            loader.ProgressBarLoader = ProgressBarLoader;
            function genBusyDiv(width, height, i, color) {
                var $div = $("<div class='busyContainer'></div>").css({
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    left: "0px",
                    right: "0px",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "z-index": 10000
                });
                var c = $("<div></div>").css({
                    display: "inline-flex"
                });
                var w = Math.min(width, height) / 10;
                for (var ii = 0; ii < i; ++ii) {
                    var t = $("<div></div>");
                    t.css({
                        width: w + "rem",
                        height: w + "rem",
                        background: color || "blue",
                        margin: 0.6 * w + "rem",
                        "border-radius": "100%",
                        animation: "shake 1s ease-in-out+" + 2 * ii / i + "s infinite  alternate"
                    });
                    c.append(t);
                }
                var beginkey = 100 / i + "%", endkey = 300 / i + "%", frame = {
                    name: "shake",
                    from: { "-webkit-transform": "scale(1); " },
                    "to": { "-webkit-transform": "scale(2); " }
                };
                // frame[beginkey]={ "-webkit-transform":"scale(2); "}
                // frame[endkey]={ "-webkit-transform":"scale(1); "}
                addKeyFrames(frame);
                $div.append(c);
                return $div.get(0);
            }
            loader.genBusyDiv = genBusyDiv;
            function BounceBusyDiv(width, height, i, color, str) {
                var $div = $("<div class='busyContainer'></div>").css({
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    left: "0px",
                    right: "0px",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "z-index": 1000,
                    background: "linear-gradient(to left, #76b852 , #8DC26F)"
                });
                var cc = $("<div></div>").css({
                    display: "inline"
                });
                var ball = $("<div></div>"), shadow = $("<div></div>");
                ball.css({
                    width: "30px",
                    height: "30px",
                    "border-radius": "100%",
                    "z-index": 20,
                    position: "relative",
                    animation: "bounce 1.5s ease-in-out 0s infinite",
                    margin: "0px auto"
                }).addClass("ball");
                shadow.css({
                    width: "30px",
                    height: "15px",
                    "border-radius": "100%",
                    "z-index": 1,
                    position: "relative",
                    top: "-10px",
                    animation: "scaleout 1.5s ease-in-out 0s infinite"
                }).addClass("shadow");
                addKeyFrames({
                    name: "bounce",
                    from: { "-webkit-transform": "translate(0px,0px); " },
                    "50%": { "-webkit-transform": "translate(0px,-40px)" },
                    "to": { "-webkit-transform": "translate(0px,0px);" }
                });
                addKeyFrames({
                    name: "scaleout",
                    from: { "-webkit-transform": "scale(0) translate(0px ,0px); " },
                    "50%": { "-webkit-transform": "scale(1) translate(0px ,2px); " },
                    "to": { "-webkit-transform": "scale(0) translate(0px ,0px); " }
                });
                // let c=$("<div></div>").css({
                //     display:"inline-flex"
                // })
                // let w=Math.min(width,height)/10
                // for(let ii=0;ii<i;++ii){
                //     let t=$("<div></div>")
                //     t.css({
                //         width:w+"px",
                //         height:w+"px",
                //         background:color||"blue",
                //         margin:0.6*w+"px",
                //         "border-radius":"100%",
                //         animation:"bounce+"+i/2+"s linear+"+ii/2+"s infinite"
                //     })
                //     c.append(t)
                // }
                // let beginkey=50/i +"%",endkey=150/i +"%",frame={
                //         name:"bounce",
                //         from:{"-webkit-transform":"scale(1); "},
                //         "to":{ "-webkit-transform":"scale(1); "}
                //     }
                // frame[beginkey]={ "-webkit-transform":"scale(2); "}
                // //frame[endkey]={ "-webkit-transform":"scale(1); "}
                // addKeyFrames(frame)
                cc.append(ball).append(shadow).appendTo($div);
                if (str) {
                    var text = $("<div></div>").appendTo($div).css({
                        margin: "0px 40px",
                        "padding-bottom": "20px"
                    }).addClass("textloader");
                    var h1_1 = $("<h1></h1>").appendTo(text);
                    _.each(str, function (s) {
                        h1_1.append("<span>" + s + "</span>");
                    });
                }
                return $div.get(0);
            }
            loader.BounceBusyDiv = BounceBusyDiv;
        })(loader = Util.loader || (Util.loader = {}));
    })(Util = exports.Util || (exports.Util = {}));
});
define("Jigsaw/Core/Evented", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    var EventBus = (function () {
        function EventBus() {
            this.eventId = _.uniqueId("eventbus");
            this.eventBusChildren = [];
            this.events = {};
        }
        EventBus.prototype.on = function (str, callback, ctx) {
            var _this = this;
            _.each(str.split(" "), function (t) {
                _this._on(t, callback, ctx);
            });
        };
        EventBus.prototype.off = function (str, callback, ctx) {
            var _this = this;
            _.each(str.split(" "), function (t) {
                _this._off(t, callback, ctx);
            });
        };
        EventBus.prototype._on = function (t, callback, ctx) {
            if (this.events[t] != undefined) {
                if (_.some(this.events[t], function (e) { return e.callback.toString() == callback.toString() && e.ctx == ctx; })) {
                    return this;
                }
                else {
                    var obj = {};
                    obj.callback = callback;
                    obj.ctx = ctx;
                    this.events[t].push(obj);
                }
            }
            else {
                this.events[t] = [];
                var obj = {};
                obj.callback = callback;
                obj.ctx = ctx;
                this.events[t].push(obj);
            }
            return this;
        };
        EventBus.prototype._off = function (t, callback, ctx) {
            if (t == "*") {
                this.events = {};
            }
            else if (this.events[t] == undefined) {
                return this;
            }
            else {
                if (callback == undefined) {
                    return this._offAllKey(t);
                }
                else {
                    var newEvents = [];
                    newEvents = _.reject(this.events[t], function (e) { return e.callback.toString() == callback.toString() && e.ctx == ctx; });
                    this.events[t] = newEvents;
                    return this;
                }
            }
        };
        EventBus.prototype.send = function (t) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var message = {
                eventId: this.eventId,
                eventKey: t,
                args: args
            };
            this.fire(t, args);
            this.setToParent(message);
        };
        EventBus.prototype.setToParent = function (e) {
            if (this.eventBusParent) {
                this.eventBusParent.setToParent(e);
            }
            else {
                this.handleEventMessage(e);
            }
        };
        EventBus.prototype.setToChildren = function (e) {
            _.chain(this.eventBusChildren).filter(function (c) { return e.eventId != c.eventId; }).each(function (c) { return c.handleEventMessage(e); });
        };
        EventBus.prototype.handleEventMessage = function (e) {
            this.fire(e.eventKey, e.args);
            this.setToChildren(e);
        };
        EventBus.prototype.fire = function (t, args) {
            _.each(this.events[t], function (e) {
                e.callback.apply(e.ctx, args);
            });
        };
        EventBus.prototype.destroy = function () {
            _.each(this.eventBusChildren, function (c) { return c.eventBusParent = null; });
            if (this.eventBusParent) {
                this.eventBusParent.removeChildrenEventBus(this);
            }
        };
        EventBus.prototype.listenTo = function (c) {
            c.eventBusParent = this;
            this.addChildrenEventBus(c);
        };
        EventBus.prototype.observe = function (c) {
            c.eventBusParent = this;
            this.addChildrenEventBus(c);
        };
        EventBus.prototype.addChildrenEventBus = function (c) {
            if (_.some(this.eventBusChildren, function (i) { return c.eventId == i.eventId; })) {
                return;
            }
            else {
                this.eventBusChildren.push(c);
            }
        };
        EventBus.prototype.removeChildrenEventBus = function (c) {
            this.eventBusChildren = _.reject(this.eventBusChildren, function (e) { return e.eventId == c.eventId; });
            c.eventBusParent = null;
        };
        EventBus.prototype._offAllKey = function (t) {
            this.events[t] = [];
            return this;
        };
        EventBus.prototype.proxyEvents = function (obj) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _.each(args, function (k) {
                obj.on(k, function () {
                    var objs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        objs[_i] = arguments[_i];
                    }
                    _this.send.apply(_this, [k].concat(objs));
                });
            });
        };
        return EventBus;
    }());
    exports.EventBus = EventBus;
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
                if (_.some(this.events[t], function (e) { return e.fn.toString() == fn.toString() && e.ctx == ctx; })) {
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
            if (t == "*") {
                this.events = {};
            }
            if (!this.events[t]) {
                return this;
            }
            else {
                var nEs_1 = [];
                if (fn) {
                    this.events[t].forEach(function (o) {
                        if (o.fn.toString() != fn.toString() && o.ctx != ctx) {
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
        Evented.prototype.fire = function (t) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _.each(this.events[t], function (e) {
                e.fn.apply(e.ctx, args);
            });
            return this;
        };
        Evented.prototype.listenTo = function (e) {
            e.event_parent = this;
            return this;
        };
        return Evented;
    }());
    exports.Evented = Evented;
});
define("Jigsaw/Core/View", ["require", "exports", "Backbone", "underscore", "Jigsaw/Utils/Util"], function (require, exports, Backbone, _, Util_1) {
    "use strict";
    exports.__esModule = true;
    var defaultConfig = {
        tagName: "div",
        el: undefined,
        $el: undefined,
        className: undefined,
        style: {
            position: "absolute",
            left: "0px",
            right: "0px",
            top: "0px",
            bottom: "0px",
            width: null,
            height: null
        }
    };
    var View = (function (_super) {
        __extends(View, _super);
        function View(conf) {
            var _this = _super.call(this, _.extend({}, defaultConfig, conf)) || this;
            _this.style(_.extend({}, defaultConfig.style, (conf || {}).style));
            return _this;
        }
        View.prototype.getNode$ = function () {
            return this.$el;
        };
        View.prototype.getNode = function () {
            return this.el;
        };
        View.prototype.getContentNode = function () {
            return this.el;
        };
        View.prototype.getContentNode$ = function () {
            return this.$el;
        };
        View.prototype.attr = function (obj) {
            this.$el.attr(obj);
            return this;
        };
        View.prototype.setDate = function (o, v) {
            if (_.isString(o)) {
                this.model.set(o, v);
            }
            if (_.isObject(o)) {
                this.model.set(o);
            }
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
            //this.$el.removeClass()
            if (_.isArray(cls)) {
                _.each(cls, function (v) {
                    _this.$el.addClass(v);
                });
            }
            if (_.isString(cls)) {
                this.$el.addClass(cls);
            }
        };
        View.prototype.addClass = function (cls) {
            if (cls) {
                this.$el.addClass(cls);
            }
            return this;
        };
        View.prototype.removeClass = function (cls) {
            this.$el.removeClass(cls);
            return this;
        };
        View.prototype.toogleClass = function (cls) {
            this.$el.toggleClass(cls);
            return this;
        };
        View.prototype.appendAt = function (dom) {
            this.invokeBeforeRender();
            this.render();
            this.getNode$().appendTo(dom);
            this.invokeAterRender();
        };
        View.prototype.onAfterRender = function () { };
        View.prototype.onBeforeRender = function () { };
        View.prototype.invokeAterRender = function () {
            if (this.onAfterRender) {
                this.onAfterRender();
            }
            return this;
        };
        View.prototype.invokeBeforeRender = function () {
            var _this = this;
            if (this.onBeforeRender) {
                setTimeout(function () {
                    _this.onBeforeRender();
                });
            }
        };
        View.prototype.setModel = function (m) {
            this.model = m;
            this.listenTo(this.model, "change", this.render);
            return this;
        };
        View.prototype.doRender = function () {
            this.invokeBeforeRender();
            this.render();
            this.invokeAterRender();
        };
        View.prototype.setBusy = function (busy, size) {
            if (busy) {
                this.$el.append(Util_1.Util.loader.genBallBusy(size || .5));
            }
            else {
                this.$(".busyContainer").remove();
            }
        };
        return View;
    }(Backbone.View));
    exports.View = View;
});
define("Jigsaw/Core/Component", ["require", "exports", "Jigsaw/Core/View", "underscore", "Jigsaw/Utils/Util", "Jigsaw/Core/Evented"], function (require, exports, View_1, _, Util_2, Evented_1) {
    "use strict";
    exports.__esModule = true;
    var getProperty = Util_2.Util.getProperty;
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(conf) {
            var _this = _super.call(this) || this;
            _this.children = [];
            _this.context = {};
            _this.id = _.uniqueId("Component");
            _this.initRootView(conf);
            return _this;
        }
        Component.prototype.initRootView = function (conf) {
            this.rootView = new View_1.View(_.extend({ tagName: "section" }, conf));
            this.rootView.addClass("componentContainer");
        };
        Component.prototype.deepExtend = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Util_2.Util.deepExtend.apply(null, args);
        };
        Component.prototype.getContext = function (k) {
            if (this.parent) {
                if (k != undefined) {
                    return _.extend(this.parent.getContext(k), this.context[k]);
                }
                else {
                    return _.extend(this.parent.getContext(), this.context);
                }
            }
            else {
                if (k != undefined) {
                    return this.context[k];
                }
                else {
                    return this.context;
                }
            }
        };
        Component.prototype.setContext = function (k, v) {
            this.context[k] = v;
        };
        Component.prototype.setStyle = function (s) {
            this.rootView.style(s);
            return this;
        };
        Component.prototype.addClass = function (c) {
            this.rootView.addClass(c);
            return this;
        };
        Component.prototype.removeClass = function (c) {
            this.rootView.removeClass(c);
        };
        Component.prototype.addTo = function (c, listen) {
            this.parent = c;
            this.parent.add(this, listen);
            return this;
        };
        Component.prototype.add = function (nc, listen) {
            var i = _.findIndex(this.children, function (c) { return c.id == nc.id; });
            nc.parent = this;
            this.observe(nc);
            if (i == -1) {
                this.children.push(nc);
            }
            else {
                this.children[i] = nc;
            }
            nc.rootView.getNode$().appendTo(this.rootView.getNode$());
            return this;
        };
        Component.prototype.remove = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.rootView.remove();
            _super.prototype.destroy.call(this);
        };
        Component.prototype.removeChild = function (c) {
        };
        Component.prototype.setBusy = function (b) {
            this.rootView.setBusy(b);
        };
        return Component;
    }(Evented_1.EventBus));
    exports.Component = Component;
});
define("Jigsaw/Core/App", ["require", "exports", "Backbone", "underscore", "Jigsaw/Core/Component"], function (require, exports, Backbone, _, Component_1) {
    "use strict";
    exports.__esModule = true;
    var App = (function (_super) {
        __extends(App, _super);
        function App(conf) {
            var _this = _super.call(this, _.extend({ el: "body" }, conf)) || this;
            _this.id = _.uniqueId("App");
            return _this;
        }
        App.prototype.start = function () {
            Backbone.history.start();
        };
        App.prototype.addRule = function (str, name, fn) {
            if (this.router == undefined) {
                this.router = new Backbone.Router();
            }
            this.router.route(str, name, fn);
        };
        App.prototype.proxy = function (fnStr) {
            var self = this;
            return this[fnStr].bind(self);
        };
        return App;
    }(Component_1.Component));
    exports.App = App;
});
define("Jigsaw/Component/Panal/DragAblePanal", ["require", "exports", "Jigsaw/Core/Component", "Jigsaw/Core/View"], function (require, exports, Component_2, View_2) {
    "use strict";
    exports.__esModule = true;
    var DragAblePanal = (function (_super) {
        __extends(DragAblePanal, _super);
        function DragAblePanal(conf) {
            var _this = _super.call(this, conf) || this;
            _this.initRootView(conf);
            _this.rootView.doRender();
            return _this;
        }
        DragAblePanal.prototype.initRootView = function (conf) {
            this.rootView = new DragComponentView(conf);
            this.rootView.addClass("dragablepanal");
        };
        return DragAblePanal;
    }(Component_2.Component));
    exports.DragAblePanal = DragAblePanal;
    var DragComponentView = (function (_super) {
        __extends(DragComponentView, _super);
        function DragComponentView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.offsetx = 0;
            _this.offsety = 0;
            return _this;
        }
        DragComponentView.prototype.events = function () {
            return { "mousedown aside": "beginDraging" };
        };
        DragComponentView.prototype.beginDraging = function (e) {
            var _this = this;
            var isDraging = false, beginX = null, beginY = null;
            var mousemove = function (e) {
                if (isDraging) {
                    _this.offsetx += (e.clientX - beginX);
                    _this.offsety += (e.clientY - beginY);
                    beginX = e.clientX;
                    beginY = e.clientY;
                }
                else {
                    beginX = e.clientX;
                    beginY = e.clientY;
                    isDraging = true;
                }
                _this.style({
                    transform: "translate(" + _this.offsetx + "px," + _this.offsety + "px)"
                });
                if (e.stopPropagation)
                    e.stopPropagation();
                if (e.preventDefault)
                    e.preventDefault();
            };
            var mouseup = function (e) {
                _this.$el.parent().off("mousemove", mousemove);
                _this.$el.parent().off("mouseup", mouseup);
                if (e.stopPropagation)
                    e.stopPropagation();
                if (e.preventDefault)
                    e.preventDefault();
            };
            this.$el.parent().on("mousemove", mousemove);
            this.$el.parent().on("mouseup", mouseup);
            if (e.stopPropagation)
                e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
        };
        DragComponentView.prototype.render = function () {
            this.$el.html("<aside class=\"left\"></aside>\n            <div class=\"content\"></div>\n        <aside class=\"right\"></aside>");
            return this;
        };
        DragComponentView.prototype.getContentNode = function () {
            return this.$(".content")[0];
        };
        DragComponentView.prototype.getContentNode$ = function () {
            return this.$(".content");
        };
        return DragComponentView;
    }(View_2.View));
});
define("Apps/Vicroad/Chart/TimeSlider", ["require", "exports", "Jigsaw/Component/Panal/DragAblePanal", "moment", "CustomizedChart/Vicroad/VicroadChart"], function (require, exports, DragAblePanal_1, moment, VicroadChart_1) {
    "use strict";
    exports.__esModule = true;
    var TimeSlider = (function (_super) {
        __extends(TimeSlider, _super);
        function TimeSlider(conf) {
            var _this = _super.call(this, conf) || this;
            _this.rootView.addClass("timeSlider");
            _this.setStyle({ height: "5rem", width: '30rem' });
            _this.timeAdjuster = new VicroadChart_1.TimeAdjust({ style: {
                    width: "30rem", height: "4.5rem"
                }, padding: 0 });
            _this.timeAdjuster.renderAt(_this.rootView.getContentNode());
            _this.hidden();
            // this.on("simulation:begin-calculation",(d)=>{
            //     this.show()
            //     this.setTime(moment(d.dateTime).add(15,"m").toDate(),d.duration)
            // })
            _this.on("beginTimeChange", function (d) {
                _this.setTime(d.dateTime, d.duration);
            });
            _this.on("retime-router-done simulation:begin-calculation", function () {
                _this.show();
            });
            _this.timeAdjuster.on("dragend", function (o) {
                _this.send("time-change", { dateTime: o.dateTime });
            });
            _this.timeAdjuster.on("init", function () {
                _this.hidden();
            });
            return _this;
        }
        TimeSlider.prototype.show = function () {
            this.rootView.style({
                display: "initial"
            });
        };
        TimeSlider.prototype.hidden = function () {
            this.rootView.style({
                display: "none"
            });
        };
        TimeSlider.prototype.reset = function () {
            this.setTime(this.beginTime, this.duration);
            return this;
        };
        TimeSlider.prototype.setTime = function (from, duration) {
            this.beginTime = from;
            this.duration = duration;
            var fromTime = moment(from).format("YYYY-MM-DD HH:mm");
            var toTime = moment(from).add(duration, "h").format("YYYY-MM-DD HH:mm");
            this.timeAdjuster.setData({
                timeParse: "%Y-%m-%d %H:%M",
                rangeMin: fromTime,
                rangeMax: toTime,
                focusTime: fromTime
            });
            this.send("time-change", { dateTime: from });
        };
        return TimeSlider;
    }(DragAblePanal_1.DragAblePanal));
    exports.TimeSlider = TimeSlider;
});
define("Jigsaw/Data/DataDefine", ["require", "exports", "Jigsaw/Utils/FP", "underscore"], function (require, exports, FP_2, _) {
    "use strict";
    exports.__esModule = true;
    var getProperty = function (obj, paths) {
        var spliter = "/";
        var path = paths.split("/");
        var r = obj;
        for (var i = 0; i < path.length; ++i) {
            if (_.has(r, path[i])) {
                r = r[path[i]];
            }
            else {
                r = undefined;
            }
        }
        return r;
    };
    var comparer = FP_2.curry(function (path, target, obj) {
        return getProperty(obj, path) == target;
    });
    var W2;
    (function (W2) {
        var featureType;
        (function (featureType) {
            featureType[featureType["POINT"] = 0] = "POINT";
            featureType[featureType["LINGSTRING"] = 1] = "LINGSTRING";
            featureType[featureType["POLYGON"] = 2] = "POLYGON";
        })(featureType || (featureType = {}));
    })(W2 = exports.W2 || (exports.W2 = {}));
    var GeoJSON;
    (function (GeoJSON) {
        var isFeature = comparer("type", "Feature");
        var isPoint = FP_2.checkIteratorCollection(isFeature, comparer("geometry/type", "Point"));
        var isPolygon = FP_2.checkIteratorCollection(isFeature, comparer("geometry/type", "Polygon"));
        var isPolyline = FP_2.checkIteratorCollection(isFeature, comparer("geometry/type", "LineString"));
        var Feature = (function () {
            function Feature(d) {
                this.type = d.type;
                this.geometry = d.geometry;
                this.properties = d.properties;
            }
            Feature.prototype.getCoordinates = function () {
                return getProperty(this, "geometry/coordinates");
            };
            Feature.prototype.toGeoJSON = function () {
                return {
                    type: this.type,
                    geometry: this.geometry,
                    properties: this.properties
                };
            };
            Feature.prototype.getProperty = function (path) {
                return getProperty(this, path);
            };
            return Feature;
        }());
        GeoJSON.Feature = Feature;
        var Point = (function (_super) {
            __extends(Point, _super);
            function Point() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.type = "Point";
                return _this;
            }
            Point.prototype.getCoordinates = function () {
                return getProperty(this, "geometry/coordinates");
            };
            Point.prototype.toLeafletMarker = function (options) {
                return L.marker(this.getleafletCoorinates(), options);
            };
            Point.prototype.getleafletCoorinates = function () {
                var c = this.getCoordinates();
                return {
                    lat: c[1],
                    lng: c[0]
                };
            };
            return Point;
        }(Feature));
        GeoJSON.Point = Point;
        var Polygon = (function (_super) {
            __extends(Polygon, _super);
            function Polygon() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.type = "Polygon";
                return _this;
            }
            Polygon.prototype.getCoordinates = function () {
                return getProperty(this, "geometry/coordinates/0");
            };
            Polygon.prototype.getleafletCoorinates = function () {
                return _.map(this.getCoordinates(), function (c) {
                    return {
                        lat: c[1],
                        lng: c[0]
                    };
                });
            };
            Polygon.prototype.toLeafletPolygon = function (options) {
                return L.polygon(this.getleafletCoorinates(), options);
            };
            return Polygon;
        }(Feature));
        GeoJSON.Polygon = Polygon;
        var Polyline = (function (_super) {
            __extends(Polyline, _super);
            function Polyline() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.type = "Polyline";
                return _this;
            }
            Polyline.prototype.getCoordinates = function () {
                return getProperty(this, "geometry/coordinates");
            };
            Polyline.prototype.getleafletCoorinates = function () {
                return _.map(this.getCoordinates(), function (c) {
                    return {
                        lat: c[1],
                        lng: c[0]
                    };
                });
            };
            Polyline.prototype.toLeafletPolyline = function (options) {
                return L.polyline(this.getleafletCoorinates(), options);
            };
            Polyline.prototype.getLeafletLatlngs = function () {
                return this.getleafletCoorinates();
            };
            return Polyline;
        }(Feature));
        GeoJSON.Polyline = Polyline;
        var FeatureCollection = (function () {
            function FeatureCollection(d) {
                this.type = d.type;
                this.features = d.features;
                this.properties = d.properties;
            }
            FeatureCollection.prototype.getPoint = function () {
                return _.chain(this.features).filter(isPoint).map(function (f) { return new Point(f); }).value();
            };
            FeatureCollection.prototype.getPolygon = function () {
                return _.chain(this.features).filter(isPolygon).map(function (f) { return new Polygon(f); }).value();
            };
            FeatureCollection.prototype.getPolyline = function () {
                return _.chain(this.features).filter(isPolyline).map(function (f) { return new Polyline(f); }).value();
            };
            FeatureCollection.prototype.getPointCollection = function () {
                return _.filter(this.features, isPoint);
            };
            FeatureCollection.prototype.getPolygonCollection = function () {
                return new FeatureCollection({ type: this.type, properties: this.properties, features: _.filter(this.features, isPolygon) });
            };
            FeatureCollection.prototype.getPolylineCollection = function () {
                return _.filter(this.features, isPolyline);
            };
            FeatureCollection.prototype.toGeoJSON = function () {
                return {
                    type: this.type,
                    features: this.features,
                    properties: this.properties
                };
            };
            return FeatureCollection;
        }());
        GeoJSON.FeatureCollection = FeatureCollection;
    })(GeoJSON = exports.GeoJSON || (exports.GeoJSON = {}));
});
define("Jigsaw/Component/Map/DS", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    function _evaluate(v, args, std) {
        if (_.isFunction(v)) {
            var v2 = v.apply(null, args);
            if ((typeof v2 === "undefined" || v2 === null) && typeof std !== "undefined") {
                return std;
            }
            else {
                return v2;
            }
        }
        else {
            if ((typeof v === "undefined" || v === null) && typeof std !== "undefined") {
                return std;
            }
            else {
                return v;
            }
        }
    }
    ;
    function sinh(v) {
        var ev = Math.pow(Math.E, v);
        return (ev - 1 / ev) * 0.5;
    }
    ;
    var W;
    (function (W) {
        function unionPropertyOf() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return function (k) {
                var v = _.find(args, function (a) {
                    return _.has(a, k);
                });
                if (v) {
                    return v[k];
                }
                else {
                    return undefined;
                }
            };
        }
        W.unionPropertyOf = unionPropertyOf;
        function toDegrees(v) {
            return v * 180 / Math.PI;
        }
        W.toDegrees = toDegrees;
        function toRadians(v) {
            return v * Math.PI / 180;
        }
        W.toRadians = toRadians;
        var GlobalMercator = (function () {
            function GlobalMercator(tileSize) {
                this.projectName = "mercator";
                this.tileSize = tileSize;
                this.initialResolution = 2 * Math.PI * 6378137 / this.tileSize;
                this.scale = 20037508.34; //Math.PI * 6378137
            }
            GlobalMercator.prototype.x2lon = function (x) {
                return x / this.scale * 180;
            };
            GlobalMercator.prototype.y2lat = function (y) {
                var _y = y / this.scale * 180;
            };
            GlobalMercator.prototype.lon2x = function (lon) {
                return lon * this.scale / 180.0;
            };
            GlobalMercator.prototype.lat2y = function (lat) {
                return (Math.log(Math.tan((90.0 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0)) * this.scale / 180.0;
            };
            GlobalMercator.prototype.tile2LonLat = function (p, z) {
                var rt = [];
                for (var i = 0; i + 1 < p.length; i = i + 2) {
                    var mx = p[i] / Math.pow(2.0, z) * 360.0 - 180;
                    var n = Math.PI - (2.0 * Math.PI * p[i + 1]) / Math.pow(2.0, z);
                    var my = toDegrees(Math.atan(sinh(n)));
                    rt.push(mx);
                    rt.push(my);
                }
                return rt;
            };
            GlobalMercator.prototype.tileBounds = function (x, y, zoom) {
                var min = this.tile2LonLat([x, y + 1], zoom);
                var max = this.tile2LonLat([x + 1, y], zoom);
                return [min[0], min[1], max[0], max[1]];
            };
            GlobalMercator.prototype.lonLat2Pixel = function (p, extent, zoom) {
                var res = this.resolution(zoom);
                var rt = [];
                for (var i = 0; i + 1 < p.length; i = i + 2) {
                    var mx = (this.lon2x(p[i]) - this.lon2x(extent[0])) / res;
                    var my = (this.lat2y(extent[3]) - this.lat2y(p[i + 1])) / res;
                    rt.push(mx);
                    rt.push(my);
                }
                return rt;
            };
            /*
            * "Resolution (meters/pixel) for given zoom level (measured at Equator)"
            */
            GlobalMercator.prototype.resolution = function (zoom) {
                // return (2 * Math.PI * 6378137) / (self.tileSize * 2**zoom)
                return this.initialResolution / Math.pow(2.0, zoom);
            };
            return GlobalMercator;
        }());
        W.GlobalMercator = GlobalMercator;
        function mercator(tileSize) {
            return new GlobalMercator(tileSize);
        }
        W.mercator = mercator;
        function splitByTags(gs) {
            return _.reduce(gs, function (memo, item) {
                if (memo.length === 0 || _.last(memo).tag !== item._t) {
                    memo.push({
                        tag: item._t,
                        items: [item]
                    });
                }
                else {
                    _.last(memo).items.push(item);
                }
                return memo;
            }, []);
        }
        W.splitByTags = splitByTags;
        var Wrapper = (function () {
            function Wrapper(obj) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.obj = obj;
                this.args = args;
            }
            Wrapper.prototype.setDefalut = function (defalut) {
                if (this.defalut) {
                    this.defalut = _.defaults(this.defalut, defalut);
                }
                else {
                    this.defalut = _.extend({}, defalut);
                }
                return this;
            };
            Wrapper.prototype.values = function () {
                var _this = this;
                var r = _.mapObject(this.obj, function (v, ix) {
                    return _evaluate(v, _this.args, _this.defalut[ix]);
                });
                return _.defaults(r, this.defalut);
            };
            Wrapper.prototype.value = function (k, defalutVale) {
                return _evaluate(this.obj[k], this.args, this.getDefault(k, defalutVale));
            };
            Wrapper.prototype.getDefault = function (k, def) {
                if (def != undefined) {
                    return def;
                }
                else {
                    if (this.defalut) {
                        return this.defalut[k];
                    }
                    else {
                        return undefined;
                    }
                }
            };
            return Wrapper;
        }());
        W.Wrapper = Wrapper;
        function values(obj) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return function (defaults) {
                var r = _.mapObject(obj, function (v, ix) {
                    return _evaluate(v, args, defaults[ix]);
                });
                return _.defaults(r, defaults);
            };
        }
        W.values = values;
        function valueOf(obj, cxts) {
            var res = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                res[_i - 2] = arguments[_i];
            }
            var args = (cxts) ? _.chain(arguments)
                .rest(1).value() : cxts;
            return function (k, std) {
                if (_.isString(k)) {
                    return _evaluate(obj[k], args, std);
                }
                else {
                    var defaults = k;
                    var r = _.mapObject(obj, function (v, ix) {
                        if (defaults) {
                            return _evaluate(v, args, defaults[ix]);
                        }
                        else {
                            return _evaluate(v, args);
                        }
                    });
                    return _.defaults(r, defaults);
                }
            };
        }
        W.valueOf = valueOf;
        function tile2bounds(x, y, z) {
            return new GlobalMercator(256).tileBounds(x, y, z);
        }
        W.tile2bounds = tile2bounds;
        function buildUrl(url, cxt) {
            var _urls = url.split("?");
            var _url = _urls[0];
            var rs = _.chain(_url)
                .reduce(function (memo, a) {
                if (a === "/" || a === ".") {
                    memo.push(a);
                    memo.push("");
                }
                else {
                    memo[memo.length - 1] += a;
                }
                return memo;
            }, [""]).value();
            var r = _.chain(rs).map(function (s) {
                if (s.charAt(0) === ":") {
                    var v = _evaluate(cxt[s.substring(1)]);
                    return encodeURIComponent(v);
                }
                else {
                    return s;
                }
            })
                .reduce(function (memo, v) {
                return memo + v;
            }, "").value();
            if (_urls.length > 1) {
                var _queries = _urls[1].split("&");
                r = _.chain(_queries)
                    .reduce(function (memo, a, ix0) {
                    var nv = a.split("=");
                    if (ix0 > 0) {
                        memo += "&";
                    }
                    memo += nv[0];
                    memo += "=";
                    if (nv[1].charAt(0) === ":") {
                        var v = _evaluate(cxt[nv[1].substring(1)]);
                        if (_.isArray(v)) {
                            _.forEach(v, function (v1, ix) {
                                if (ix > 0) {
                                    memo = memo + "&" + nv[0] + "=";
                                }
                                memo += encodeURIComponent(v1);
                            });
                        }
                        else {
                            memo += encodeURIComponent(v);
                        }
                    }
                    else {
                        memo += nv[1];
                    }
                    return memo;
                }, r + "?").value();
            }
            if (_.last(r) === '/') {
                return r.substring(0, r.length - 1);
            }
            else {
                return r;
            }
        }
        W.buildUrl = buildUrl;
        function doGet(url, ctx) {
            return $.get(buildUrl(url, ctx));
        }
        W.doGet = doGet;
        function toGeometries(vs, extent, zoom) {
            vs.features = _.map(vs.features, function (g) {
                return _.mapObject(g, function (v, k) {
                    if (!v.t && v.t !== 0) {
                        return v;
                    }
                    v.p = _.map(v.p, function (p) {
                        p = toPath(p, vs.decimals);
                        //if(v.t === 0)
                        //    return [p];
                        //else
                        return p;
                    });
                    if (vs.srid !== "canvas" && extent && zoom) {
                        var mercator = W.mercator(256);
                        v.p = _.map(v.p, function (path) {
                            return _.map(path, function (p) {
                                return mercator.lonLat2Pixel(p, extent, zoom);
                            });
                        });
                    }
                    return v;
                });
            });
            return vs;
        }
        W.toGeometries = toGeometries;
        function decompressFeatureCollection(vs) {
            if (!isDeCompress(vs)) {
                var newVs = JSON.parse(JSON.stringify(vs));
                newVs.features = _.map(vs.features, function (f) {
                    if (f.g != undefined && f.g.t != undefined) {
                        f.g.p = _.map(f.g.p, function (p) { return toPath(p, vs.decimals); });
                    }
                    return f;
                });
                return newVs;
            }
            vs._decompress = true;
            return vs;
        }
        W.decompressFeatureCollection = decompressFeatureCollection;
        function isDeCompress(fs) {
            if (fs._decompress) {
                return true;
            }
            else {
                if (fs.decimals == 0 || fs.decimals == undefined) {
                    return true;
                }
                else {
                    if (fs.features && fs.features.length > 0) {
                        var hasGPath = _.filter(fs.features, function (f) { return f.g != undefined && f.g.p != undefined && (f.g.t == 1 || f.g.t == 2) && f.g.p.length > 0 && f.g.p[0].length > 0; });
                        if (hasGPath.length > 0) {
                            var p = hasGPath[0];
                            var path = p.g.p[0];
                            return path[0].toString().includes('.');
                        }
                        var hasGPoint = _.filter(fs.features, function (f) { return f.g != undefined && f.g.p != undefined && f.g.t == 0 && f.g.p.length > 0; });
                        if (hasGPoint.length > 0) {
                            var path = hasGPath[0].g.p;
                            return path[0].toString().includes('.');
                        }
                    }
                    else {
                        return true;
                    }
                }
            }
        }
        W.isDeCompress = isDeCompress;
        function isProject(fs) {
            if (fs._project || fs.srid == "canvas") {
                return true;
            }
            else {
                return false;
            }
        }
        W.isProject = isProject;
        function projectToPixel(fs, Project, ctx) {
            if (!isProject(fs)) {
                var newFs = JSON.parse(JSON.stringify(fs));
                _.each(newFs.features, function (f) {
                    if (f.g && f.g.p && f.g.p.length > 0) {
                        f.g.p = _.map(f.g.p, function (path) {
                            return _.map(path, function (p) {
                                return Project.lonLat2Pixel(p, ctx.extent, ctx.zoom);
                            });
                        });
                    }
                });
                newFs._project = Project.name;
                return newFs;
            }
            return fs;
        }
        W.projectToPixel = projectToPixel;
        function to4326FeatureCollection(vs, extent, zoom) {
        }
        W.to4326FeatureCollection = to4326FeatureCollection;
        function toPixelFeatureCollection(vs, extent, zoom) {
            if (vs.srid == "4326" && vs.features != undefined) {
                var mercator_1 = W.mercator(256);
                var newVs = JSON.parse(JSON.stringify(vs));
                newVs.features = _.map(vs.features, function (g) {
                    return _.mapObject(g, function (v, k) {
                        v.p = _.map(v.p, function (path) {
                            return _.map(path, function (p) {
                                return mercator_1.lonLat2Pixel(p, extent, zoom);
                            });
                        });
                    });
                });
            }
        }
        W.toPixelFeatureCollection = toPixelFeatureCollection;
        function toW2FeatureCollection(vs) {
        }
        W.toW2FeatureCollection = toW2FeatureCollection;
        function toPath(vs, decimals) {
            var prevX = 0, prevY = 0, values = [];
            var factor = (decimals < 0) ? 0 : Math.pow(10, decimals);
            var i = 0;
            for (i = 0; i < vs.length; i = i + 2) {
                if (factor > 0) {
                    prevX = vs[i] / factor + prevX;
                    prevY = vs[i + 1] / factor + prevY;
                }
                else {
                    prevX = vs[i];
                    prevY = vs[i + 1];
                }
                values.push([prevX, prevY]);
            }
            return values;
        }
        W.toPath = toPath;
        function offsetting(a, b, offset, memo) {
            if (a === b) {
                return [a, b, [0, 0]];
            }
            if (a[0] === b[0] && a[1] === b[1]) {
                return [a, b, 0, 0];
            }
            if (!offset || offset === 0) {
                return [a, b, [0, 0]];
            }
            var dx = b[0] - a[0];
            var dy = b[1] - a[1];
            if (dx === 0 && dy === 0) {
                return [a, b, [0, 0]];
            }
            var offx = 0, offy = 0;
            var d = Math.sqrt(dx * dx + dy * dy);
            offx = -offset * dy / d;
            offy = offset * dx / d;
            var rt = [
                [a[0] + offx, a[1] + offy],
                [b[0] + offx, b[1] + offy],
                [offx, offy]
            ];
            if (!_.isEmpty(memo)) {
                // intersection with memo
                var intersect = intersection(memo[0][0], memo[0][1], memo[1][0], memo[1][1], rt[0][0], rt[0][1], rt[1][0], rt[1][1]);
                if (!intersect) {
                    intersect = rt[0];
                }
                return [intersect, rt[1], rt[2]];
            }
            else {
                return [rt[0], rt[1], rt[2]];
            }
        }
        W.offsetting = offsetting;
        function intersection(x0, y0, x1, y1, x2, y2, x3, y3) {
            var s1_x, s1_y, s2_x, s2_y;
            s1_x = x1 - x0;
            s1_y = y1 - y0;
            s2_x = x3 - x2;
            s2_y = y3 - y2;
            var s, t;
            s = (-s1_y * (x0 - x2) + s1_x * (y0 - y2)) / (-s2_x * s1_y + s1_x * s2_y);
            t = (s2_x * (y0 - y2) - s2_y * (x0 - x2)) / (-s2_x * s1_y + s1_x * s2_y);
            if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                // Collision detected
                return [x0 + (t * s1_x), y0 + (t * s1_y)];
            }
            return null;
        }
        W.intersection = intersection;
        function angle2X(a, b) {
            var angle = 0;
            angle = Math.atan2((b[1] - a[1]), (b[0] - a[0])) * 180 / Math.PI;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        }
        W.angle2X = angle2X;
        function centroid(vs) {
            var pt = _.reduce(vs, function (memo, a) {
                if (_.isEmpty(memo)) {
                    return a;
                }
                else {
                    return [memo[0] + a[0], memo[1] + a[1]];
                }
            }, []);
            return [pt[0] / vs.length, pt[1] / vs.length];
        }
        W.centroid = centroid;
        function middle(vs) {
            var total = 0;
            var path = _.reduce(vs, function (memo, v) {
                var d;
                if (_.isEmpty(memo)) {
                    memo.push({
                        loc: v,
                        distance: 0
                    });
                }
                else {
                    d = distance(_.last(memo).loc, v);
                    total += d;
                    memo.push({
                        loc: v,
                        distance: d
                    });
                }
                return memo;
            }, []);
            var cur = 0;
            var idx = 0;
            var pt = _.find(path, function (v, ix) {
                cur += v.distance;
                if (cur >= total / 2) {
                    idx = ix;
                    return true;
                }
                else {
                    return false;
                }
            });
            var pt2 = path[idx - 1] || pt;
            return {
                begin: pt2.loc,
                end: pt.loc,
                mid: [(pt2.loc[0] + pt.loc[0]) / 2, (pt2.loc[1] + pt.loc[1]) / 2]
            };
        }
        W.middle = middle;
        function distance(p0, p1) {
            var dx = p1[0] - p0[0];
            var dy = p1[1] - p0[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
        W.distance = distance;
    })(W = exports.W || (exports.W = {}));
});
define("Jigsaw/Component/Map/Painter", ["require", "exports", "underscore", "Jigsaw/Component/Map/DS"], function (require, exports, _, DS_1) {
    "use strict";
    exports.__esModule = true;
    function _move(path, offset, movement) {
        var self = this;
        var r = [];
        _.reduce(path, function (memo, element, ix, list) {
            var pos;
            if (ix + 1 < list.length) {
                memo = DS_1.W.offsetting(element, list[ix + 1], offset, memo);
                pos = memo[0];
            }
            else {
                pos = memo[1];
            }
            if (ix === 0) {
                r.push([pos[0], pos[1]]);
                movement.moveTo(pos[0], pos[1]);
            }
            else {
                r.push([pos[0], pos[1]]);
                movement.lineTo(pos[0], pos[1]);
            }
            return memo;
        }, []);
        return r;
    }
    ;
    var Painter;
    (function (Painter) {
        function buildPath(path, closed, offset, inners, movement) {
            if (!path || path.lenth < 2) {
                return path;
            }
            else {
                movement.begin();
                var np = [];
                np.push(_move(path, offset, movement));
                if (closed)
                    movement.close();
                _.each(inners, function (p) {
                    //np.push(_move(p.reverse(), offset, movement));
                    if (closed)
                        movement.close();
                });
                return np;
            }
        }
        Painter.buildPath = buildPath;
        function buildRect(p, s, d, alignment, valign) {
            var placeX = p[0] + d[0];
            var placeY = p[1] + d[1];
            var lastX = placeX;
            var lastY = placeY;
            if (alignment === "center") {
                lastX = placeX - s[0] / 2;
            }
            else if (alignment === "right") {
                lastX = placeX - s[0];
            }
            if (valign === "middle") {
                lastY = placeY - s[1] / 2;
            }
            else if (valign === "bottom") {
                lastY = placeY - s[1];
            }
            return [lastX, lastY, s[0], s[1]];
        }
        Painter.buildRect = buildRect;
        function move(path, offset, movement) {
            var r = [];
            _.reduce(path, function (memo, element, ix, list) {
                var pos;
                if (ix + 1 < list.length) {
                    memo = DS_1.W.offsetting(element, list[ix + 1], offset, memo);
                    pos = memo[0];
                }
                else {
                    pos = memo[1];
                }
                if (ix === 0) {
                    r.push([pos[0], pos[1]]);
                    movement.moveTo(pos[0], pos[1]);
                }
                else {
                    r.push([pos[0], pos[1]]);
                    movement.lineTo(pos[0], pos[1]);
                }
                return memo;
            }, []);
        }
        Painter.move = move;
        function paint(brush, f, style) {
            var s = style.value("symbolizer");
            if (s == "polygon") {
                brush.polygon(f, style);
            }
            else if (s == "line") {
                brush.line(f, style);
            }
            else if (s == "marker") {
                brush.marker(f, style);
            }
        }
        Painter.paint = paint;
    })(Painter = exports.Painter || (exports.Painter = {}));
    var CanvasBrush = (function () {
        function CanvasBrush(ctx) {
            this._ctx = ctx;
            this.pathMovement = {
                close: function () {
                    ctx.closePath();
                },
                begin: function () {
                    ctx.beginPath();
                },
                moveTo: function (x, y) {
                    ctx.moveTo(x, y);
                },
                lineTo: function (x, y) {
                    ctx.lineTo(x, y);
                }
            };
        }
        CanvasBrush.prototype.transform = function (x, y, scale, rotation) {
            this._ctx.translate(x, y);
            if (rotation) {
                this._ctx.rotate(rotation);
            }
            if (scale) {
                this._ctx.scale(scale, scale);
            }
            this._ctx.translate(-x, -y);
        };
        CanvasBrush.prototype.polygon = function (f, style) {
            var s = style.setDefalut({
                offset: 0,
                geometry: f.g
            }).values();
            this._ctx.fillStyle = s.fill;
            if (Painter.buildPath(s.geometry.p[0], true, s.offset, _.rest(s.geometry.p), this.pathMovement)) {
                this._ctx.fill();
            }
        };
        CanvasBrush.prototype.line = function (f, style) {
            var _this = this;
            var s = style.setDefalut({
                width: 0, offset: 0, geometry: f.g
            }).values();
            if (s.width == 0) {
                return;
            }
            else {
                this._ctx.strokeStyle = s.color;
                this._ctx.lineWidth = s.width;
                if (_.isArray(s.dasharray)) {
                    this._ctx.setLineDash(s.dasharray);
                }
                else {
                    this._ctx.setLineDash([]);
                }
                var np_1 = Painter.buildPath(s.geometry.p[0], false, s.offset, _.rest(s.geometry.p), this.pathMovement);
                if (!np_1) {
                    return;
                }
                else {
                    this._ctx.stroke();
                    if (s.marker) {
                        _.each(s.marker, function (m, k) {
                            var st = new DS_1.W.Wrapper(m);
                            st.setDefalut({
                                placement: k,
                                fill: s.color
                            });
                            if (k == "mid") {
                                _.each(np_1[0], function (pt, ix) {
                                    if (ix > 0 && ix < np_1[0].length - 1) {
                                        this.marker(f, st, np_1[0], ix);
                                    }
                                });
                            }
                            else {
                                _this.marker(f, st, np_1[0]);
                            }
                        });
                    }
                }
            }
        };
        CanvasBrush.prototype.marker = function (f, style, np, ix) {
            var s = style.setDefalut({
                width: 0,
                height: 0,
                dx: 0,
                dy: 0,
                placement: "point",
                alignment: "center",
                verticalAlignment: "middle",
                rotate: 0,
                geometry: f.g
            }).values();
            if (s.borderColor) {
                this._ctx.lineWidth = s.borderWidth;
                if (_.isArray(s.dasharray)) {
                    this._ctx.setLineDash(s.dasharray);
                }
                else {
                    this._ctx.setLineDash([]);
                }
                this._ctx.save();
                var p2d = this.place(f, s, np, ix);
                if (_.isObject(p2d)) {
                    this._ctx.stroke(p2d);
                }
                else {
                    this._ctx.stroke();
                }
                this._ctx.restore();
            }
            if (s.fill) {
                this._ctx.fillStyle = s.fill;
                this._ctx.save();
                var p2d_1 = this.place(f, s, np, ix);
                if (_.isObject(p2d_1)) {
                    // this._ctx.fill(p2d);
                    this._ctx.fill(p2d_1);
                }
                else {
                    this._ctx.fill();
                }
                this._ctx.restore();
            }
        };
        CanvasBrush.prototype.place = function (f, s, np, ix) {
            var pt, pt2, rt, rotate;
            var path = np || s.geometry.p[0];
            if (!path)
                return;
            var p;
            if (s.placement === "point") {
                pt = _.first(path);
            }
            else if (s.placement === "end") {
                p = _.last(path, 2);
                if (p.length < 2) {
                    return;
                }
                pt = p[1];
                pt2 = p[0];
                rotate = (DS_1.W.angle2X(pt2, pt)) * Math.PI / 180;
                rt = DS_1.W.offsetting(pt2, pt, 0, []);
                pt2 = rt[0];
                pt = rt[1];
            }
            else if (s.placement === "start") {
                p = _.first(path, 2);
                pt = p[0];
                pt2 = p[1];
                rotate = DS_1.W.angle2X(pt, pt2) * Math.PI / 180;
                rt = DS_1.W.offsetting(pt, pt2, 0, []);
                pt = rt[0];
                pt2 = rt[1];
            }
            else if (s.placement === "interior") {
                pt = DS_1.W.centroid(path);
                rotate = s.rotate;
            }
            else if (s.placement === "middle") {
                var mid = DS_1.W.middle(path);
                pt = mid.mid;
                rotate = DS_1.W.angle2X(mid.begin, mid.end) * Math.PI / 180;
                pt2 = mid.begin;
            }
            else if (s.placement === "mid") {
                if (ix === 0)
                    return;
                pt = path[ix];
                pt2 = path[ix - 1];
                rotate = DS_1.W.angle2X(pt2, pt) * Math.PI / 180;
                rt = DS_1.W.offsetting(pt2, pt, 0, []);
                pt2 = rt[0];
                pt = rt[1];
            }
            if (!pt)
                return;
            if (s.type === "square") {
                var rect = Painter.buildRect(pt, [s.width, s.height], [s.dx, s.dy], s.alignment, s.verticalAlignment);
                this.transform(rect[0], rect[1], 1, rotate);
                this._ctx.beginPath();
                this._ctx.rect(rect[0], rect[1], rect[2], rect[3]);
            }
            else if (s.path) {
                var p2d = new Path2D(s.path);
                this._ctx.translate(pt[0] - s.viewBox[1] / 2, pt[1] - s.viewBox[1] / 2);
                this.transform(s.viewBox[0] / 2, s.viewBox[1] / 2, 1, rotate);
                //this._ctx.fill(p2d);
                return p2d;
            }
        };
        return CanvasBrush;
    }());
    exports.CanvasBrush = CanvasBrush;
});
define("Jigsaw/Component/Map/Layers", ["require", "exports", "Jigsaw/Component/Map/G2Map", "underscore", "Jigsaw/Component/Map/DS", "Jigsaw/Component/Map/Painter"], function (require, exports, G2Map_1, _, DS_2, Painter_1) {
    "use strict";
    exports.__esModule = true;
    var Layer = (function () {
        function Layer(map, id, options) {
            this._cxt = {};
            this._features = {};
            this._controlLayersNum = 0;
            this.map = map;
            this._styles = {};
            this._id = id;
            this._config = _.extend({}, this.defaultConfig(), options);
            this.initLayer();
        }
        Layer.prototype.setContext = function (c) {
            this._cxt = _.extend(this._cxt, c);
        };
        Layer.prototype.getContext = function (c) {
            var mapContext = this.map ? this.map.getContext() : {};
            return _.extend({}, mapContext, this._cxt, c);
        };
        Layer.prototype.defaultConfig = function () {
            return {
                selectable: false,
                url: "",
                name: "layer",
                leafletLayerOption: {}
            };
        };
        Layer.prototype.setData = function (d) {
            this._data = d;
        };
        Layer.prototype.getData = function () {
            return JSON.parse(JSON.stringify(this._data));
        };
        Layer.prototype.visible = function () {
            if (this.map.getLeaflet()) {
                return this.map.getLeaflet().hasLayer(this._leafletLayer);
            }
            else {
                return false;
            }
        };
        Layer.prototype.show = function () {
            if (!this.visible()) {
                this._leafletLayer.addTo(this.map.getLeaflet());
            }
            return this;
        };
        Layer.prototype.hide = function () {
            if (this.visible()) {
                this._leafletLayer.remove();
            }
            return this;
        };
        Layer.prototype.removeFromControl = function () {
            this.map.removeFromLeafletControl(this._leafletLayer);
            return this;
        };
        Layer.prototype.addToControl = function (layerType) {
            this.map.addToLeafletControl(this._leafletLayer, this._id, layerType);
            return this;
        };
        Layer.prototype.redraw = function (isShow) {
            if (this.visible()) {
                this._leafletLayer.remove();
                this.show();
            }
            if (isShow) {
                this.show();
            }
        };
        // features(){
        //     return this._data
        // }
        Layer.prototype.getFeatures = function () {
        };
        Layer.prototype.features = function (tag) {
            if (tag != undefined) {
                if (this._features[tag] == undefined) {
                    this._features[tag] = [];
                }
                return this._features[tag];
            }
            else {
                return this._features;
            }
        };
        Layer.prototype.render = function (data, cxt, brush) {
            var _this = this;
            var mercator = DS_2.W.mercator(256);
            var transform = function (pt) {
                return mercator.lonLat2Pixel(pt, cxt.extent, cxt.zoom);
            };
            var pd = DS_2.W.projectToPixel(DS_2.W.decompressFeatureCollection(data), DS_2.W.mercator(256), cxt);
            //let pd=W.toGeometries(data,cxt.extent,cxt.zoom)
            var splitted = DS_2.W.splitByTags(pd.features);
            //  splitted = _.reduce(this.features(), function (memo, fc:any) {
            //      var mapped = fc.map(function (feature) {
            //          return feature.clone()
            //              .paths(_.map(feature.paths(), function (i) {
            //                  return _.map(i, transform);
            //              })).value();
            //      });
            //      memo.push({
            //          tag: fc.tag(),
            //          items: mapped
            //      });
            //      return memo;
            //  }, splitted);
            var self = this;
            var i;
            for (i = 0; i < 2; i++) {
                _.each(splitted, function (l, ix) {
                    var r = _.chain(l.items)
                        .reduce(function (memo, g) {
                        var style = _this.style(l.tag);
                        if (!style)
                            return memo;
                        var symbols = style.get(g, cxt);
                        _.chain(symbols)
                            .filter(function (s) {
                            return (i === 0) ? s.symbolizer !== "text" : s.symbolizer === "text";
                        })
                            .each(function (style) {
                            var s = new DS_2.W.Wrapper(style, DS_2.W.unionPropertyOf(g, cxt), g, cxt);
                            memo.push({
                                g: g,
                                s: s,
                                z: s.value("z", 0)
                            });
                        });
                        return memo;
                    }, []);
                    _.chain(r.value()).sortBy("z")
                        .each(function (instruction) {
                        Painter_1.Painter.paint(brush, instruction.g, instruction.s);
                    });
                });
            }
        };
        Layer.prototype.style = function (id, p) {
            var self = this;
            if (!id) {
                return this._styles["*"];
            }
            else if (id && !_.isString(id)) {
                this._defaultStyle = id;
            }
            else {
                if (!_.has(this._styles, id)) {
                    if (_.isString(p)) {
                        this._styles[id] = this._styles[p];
                    }
                    else {
                        this._styles[id] = new G2Map_1.Style(id, p, this._defaultStyle);
                    }
                }
                else if (_.isObject(p)) {
                    this._styles[id].add(p);
                }
                else if (p) {
                    this._styles[id] = this._styles[p];
                }
                return this._styles[id];
            }
        };
        Layer.prototype.initLayer = function () {
            this._leaflet = this.map.getLeaflet();
            this._leafletLayer = this.createLeafletLayer();
            if (this._config.visible) {
                this._leafletLayer.addTo(this._leaflet);
            }
            if (this._config.selectable) {
                this.addToControl(this._config.layerType);
            }
        };
        Layer.prototype.createLeafletLayer = function () {
            return L.tileLayer(DS_2.W.buildUrl(this._config.url, this.getContext()), this._config.leafletLayerOption);
        };
        return Layer;
    }());
    exports.Layer = Layer;
    var PngLayer = (function (_super) {
        __extends(PngLayer, _super);
        function PngLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PngLayer.prototype.createLeafletLayer = function () {
            return L.tileLayer(DS_2.W.buildUrl(this._config.url, this.getContext()), this._config.leafletLayerOption);
        };
        return PngLayer;
    }(Layer));
    exports.PngLayer = PngLayer;
    var CanvasTileLayer = (function (_super) {
        __extends(CanvasTileLayer, _super);
        function CanvasTileLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CanvasTileLayer.prototype.getBrush = function (canvas) {
            return new Painter_1.CanvasBrush(canvas.getContext("2d"));
        };
        CanvasTileLayer.prototype.createLeafletLayer = function () {
            var l = this;
            var CanvasTile = (function (_super) {
                __extends(CanvasTile, _super);
                function CanvasTile() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CanvasTile.prototype.createTile = function (tilePoint, done) {
                    // create a <canvas> element for drawing
                    var canvasTile = L.DomUtil.create('canvas', 'leaflet-tile');
                    // setup tile width and height according to the options
                    var tileSize = this.getTileSize();
                    canvasTile.setAttribute("width", tileSize.x.toString());
                    canvasTile.setAttribute("height", tileSize.y.toString());
                    var zoom = tilePoint.z;
                    // draw something asynchronously and pass the tile to the done() callback
                    var ext = DS_2.W.tile2bounds(tilePoint.x, tilePoint.y, tilePoint.z);
                    var ctx = { zoom: zoom, extent: ext };
                    //cxt.putAll(self.parameters);
                    if (!l._config.url) {
                        setTimeout(function () {
                            l.render({}, l.getContext(ctx), l.getBrush(canvasTile));
                            done(false, canvasTile);
                        }, 10);
                    }
                    else {
                        DS_2.W.doGet(l._config.url, l.getContext(ctx)).done(function (data) {
                            data = JSON.parse(data);
                            l.render(data, l.getContext(ctx), l.getBrush(canvasTile));
                            done(false, canvasTile);
                        });
                    }
                    return canvasTile;
                };
                return CanvasTile;
            }(L.GridLayer));
            return new CanvasTile;
        };
        return CanvasTileLayer;
    }(Layer));
    exports.CanvasTileLayer = CanvasTileLayer;
    var CanvasLayer = (function (_super) {
        __extends(CanvasLayer, _super);
        function CanvasLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CanvasLayer.prototype.createLeafletLayer = function () {
            var l = this;
            var leafletCanvasLayer = (function (_super) {
                __extends(LeafletCanvasLayerL, _super);
                function LeafletCanvasLayerL() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LeafletCanvasLayerL.prototype.getExtent = function () {
                    if (this.map) {
                        var b = this.map.getBounds();
                        return [b.getSouthWest().lng, b.getSouthWest().lat, b.getNorthEast().lng, b.getNorthEast().lat];
                    }
                };
                LeafletCanvasLayerL.prototype.onAdd = function (map) {
                    this.map = map;
                    var pane = map.getPane(this.options.pane);
                    this.canvas = L.DomUtil.create("canvas", "custom_canvas_layer");
                    pane.appendChild(this.canvas);
                    this.canvas.style.width = map.getSize().x + "px";
                    this.canvas.style.height = map.getSize().y + "px";
                    this.canvas.setAttribute("width", map.getSize().x);
                    this.canvas.setAttribute("height", map.getSize().y);
                    this.update();
                    this.map.on("move", this.update, this);
                    this.map.on("zoom", this.update, this);
                    return this;
                };
                LeafletCanvasLayerL.prototype.update = function () {
                    var _this = this;
                    var pos = L.DomUtil.getPosition(this.map.getPane("mapPane"));
                    L.DomUtil.setTransform(this.canvas, pos.multiplyBy(-1), 0);
                    var ctx = { zoom: this.map.getZoom(), extent: this.getExtent() };
                    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
                    if (!l._config.url) {
                        setTimeout(function () {
                            l.render(l.getData(), l.getContext(ctx), l.getBrush(_this.canvas));
                        }, 10);
                    }
                    else {
                        DS_2.W.doGet(l._config.url, l.getContext(ctx)).done(function (data) {
                            if (data) {
                                data = JSON.parse(data);
                                var fs = data;
                                fs = DS_2.W.toPixelFeatureCollection(DS_2.W.decompressFeatureCollection(fs), _this.getExtent(), _this.map.getZoom());
                                console.log(fs);
                                // W.toGeometries(data,ctx.extent,ctx.zoom)
                                l.render(fs, l.getContext(ctx), l.getBrush(_this.canvas));
                            }
                        });
                    }
                };
                LeafletCanvasLayerL.prototype.onRemove = function (map) {
                    L.DomUtil.remove(this.canvas);
                    this.map.off("move", this.update, this);
                    this.map.off("zoom", this.update, this);
                    return this;
                };
                return LeafletCanvasLayerL;
            }(L.Layer));
            return new leafletCanvasLayer;
        };
        return CanvasLayer;
    }(CanvasTileLayer));
    exports.CanvasLayer = CanvasLayer;
    function layerFactor(map, id, options) {
        if (options.renderer == "canvastile") {
            return new CanvasTileLayer(map, id, options);
        }
        else if (options.renderer == "png") {
            return new PngLayer(map, id, options);
        }
        else if (options.renderer == "canvas") {
            return new CanvasTileLayer(map, id, options);
        }
        else if (options.renderer == "canvasOnMap") {
            return new CanvasLayer(map, id, options);
        }
    }
    exports.layerFactor = layerFactor;
});
define("Jigsaw/Component/Map/G2Map", ["require", "exports", "underscore", "Jigsaw/Component/Map/DS", "leaflet", "Jigsaw/Core/View", "Jigsaw/Core/Component", "Jigsaw/Component/Map/Layers"], function (require, exports, _, DS_3, L, View_3, Component_3, Layers_1) {
    "use strict";
    exports.__esModule = true;
    var Style = (function () {
        function Style(id, options, defaultStyle) {
            this._id = id;
            this._symbolizers = [];
            this._defaultStyle = defaultStyle;
            if (options) {
                this._filter = options.filter;
            }
        }
        Style.prototype.get = function (feature, cxt) {
            if (_.isFunction(this._filter)) {
                if (!this._filter(DS_3.W.unionPropertyOf(feature, cxt), feature, cxt))
                    return [];
            }
            return _.chain(this._symbolizers)
                .filter(function (s) {
                var filter = s.filter;
                if (_.isFunction(filter)) {
                    return filter(DS_3.W.unionPropertyOf(feature, cxt), feature, cxt);
                }
                else {
                    return true;
                }
            }).value();
        };
        Style.prototype.filter = function (f) {
            this._filter = f;
            return this;
        };
        Style.prototype.add = function (type, opt, extension) {
            var obj = {
                symbolizer: type
            };
            var self = this;
            if (_.isObject(type)) {
                this._symbolizers.push(type);
            }
            else if (_.isString(opt)) {
                this._symbolizers.push(_.extend(obj, this._defaultStyle[opt], extension));
            }
            else if (_.isArray(opt)) {
                obj = _.chain(opt).reduce(function (memo, o) {
                    return _.extend(memo, self._defaultStyle[o]);
                }, obj).value();
                this._symbolizers.push(_.extend(obj, extension));
            }
            else {
                this._symbolizers.push(_.extend(obj, opt));
            }
            return this;
        };
        Style.prototype.line = function (opt, options2) {
            return this.add("line", opt, options2);
        };
        Style.prototype.circle = function (opt, options2) {
            return this.add("circle", opt, options2);
        };
        Style.prototype.polygon = function (opt, options2) {
            return this.add("polygon", opt, options2);
        };
        Style.prototype.text = function (opt, options2) {
            return this.add("text", opt, options2);
        };
        Style.prototype.marker = function (opt, options2) {
            return this.add("marker", opt, options2);
        };
        return Style;
    }());
    exports.Style = Style;
    var G2Map = (function (_super) {
        __extends(G2Map, _super);
        function G2Map(conf) {
            var _this = _super.call(this, conf) || this;
            _this.layers = [];
            _this.config = _.extend({ zoomControl: true }, conf);
            _this.addClass("map");
            _this.map = new MapView(_this.config);
            _this.rootView.render();
            _this.map.appendAt(_this.rootView.getNode$());
            return _this;
        }
        G2Map.prototype.getLeaflet = function () {
            return this.map.leaflet;
        };
        // getLeafletControl(){
        //     return this.map.control
        // }
        G2Map.prototype.layer = function (id, options) {
            var l = _.find(this.layers, function (l) { return l._id == id; });
            if (!l) {
                l = Layers_1.layerFactor(this, id, options);
                this.layers.push(l);
            }
            return l;
        };
        G2Map.prototype.addToLeafletControl = function (layer, id, layertype) {
            if (layertype == "baselayer") {
                this.map.control.addBaseLayer(layer, id);
            }
            else {
                this.map.control.addOverlay(layer, id);
            }
            this.map.control.updataStyle();
        };
        G2Map.prototype.removeFromLeafletControl = function (layer) {
            this.map.control.removeLayer(layer);
            this.map.control.updataStyle();
        };
        G2Map.prototype.setMapSetting = function (s) {
            this.map.setMapSetting(s);
            return this;
        };
        return G2Map;
    }(Component_3.Component));
    exports.G2Map = G2Map;
    var MapView = (function (_super) {
        __extends(MapView, _super);
        function MapView(conf) {
            var _this = _super.call(this, conf) || this;
            if (conf) {
                _this.mapSetting = _.extend({ center: { lat: 0, lng: 0 }, zoom: 8, scrollWheelZoom: true }, conf);
            }
            else {
                _this.mapSetting = _.extend({ center: { lat: 0, lng: 0 }, zoom: 8, scrollWheelZoom: true });
            }
            _this.style({
                position: "absolute",
                left: "0px",
                right: "0px",
                top: "0px",
                bottom: "0px"
            });
            return _this;
        }
        MapView.prototype.onAfterRender = function () {
            this.leaflet = L.map(this.el, _.pick(this.mapSetting, "scrollWheelZoom", "zoomControl"));
            this.control = new AutoHideLayerControl;
            this.control.addTo(this.leaflet);
            this.control.updataStyle();
            this.leaflet.setView(this.mapSetting.center, this.mapSetting.zoom);
        };
        MapView.prototype.setMapSetting = function (s) {
            this.leaflet.invalidateSize();
            this.mapSetting = _.extend({}, this.mapSetting, s);
            this.leaflet.setView(this.mapSetting.center, this.mapSetting.zoom);
            return this;
        };
        return MapView;
    }(View_3.View));
    var AutoHideLayerControl = (function (_super) {
        __extends(AutoHideLayerControl, _super);
        function AutoHideLayerControl() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AutoHideLayerControl.prototype.updataStyle = function () {
            if (this._layers && this._layers.length <= 0) {
                this.getContainer().style.display = "none";
            }
            else {
                this.getContainer().style.display = "initial";
            }
        };
        return AutoHideLayerControl;
    }(L.Control.Layers));
});
define("Jigsaw/Core/Model", ["require", "exports", "Backbone"], function (require, exports, Backbone) {
    "use strict";
    exports.__esModule = true;
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(conf) {
            return _super.call(this, conf) || this;
        }
        return Model;
    }(Backbone.Model));
    exports.Model = Model;
});
define("Apps/Vicroad/Map/Adjuster", ["require", "exports", "Jigsaw/Core/View", "underscore"], function (require, exports, View_4, _) {
    "use strict";
    exports.__esModule = true;
    var Adjuster = (function (_super) {
        __extends(Adjuster, _super);
        function Adjuster(conf) {
            var _this = _super.call(this, conf) || this;
            _this.template = _.template("<div class=\"adjuster\">\n                    <header><%= name %></header>\n                    <table>\n                    <thead>\n                        <tr>\n                        <th>Road</th>\n                      \n                        <th>Status</th>\n                        </tr>\n                    </thead>\n                    <% _.each(roads,function(item,i){ %>\n                        <tr class=\" <%= item.class %>\"><td class='name' nowrap><%= item.name %></td><td class='operation'><button class='btn btn-default' index=<%= i %> ><span class='fa'></span></button></td></tr>\n                    <% }) %>\n                    </table>\n                </div>");
            _this.style({ position: "relative" });
            return _this;
        }
        Adjuster.prototype.events = function () {
            return {
                "click .operation .btn": "onBtn"
            };
        };
        Adjuster.prototype.onBtn = function (e) {
            var i = $(e.currentTarget).attr("index");
            var roads = this.data.roads;
            roads[i].isOpen = !roads[i].isOpen;
            var m = {
                id: this.data.id,
                name: this.data.name,
                capacity: _.filter(roads, function (r) { return r.isOpen; }).length / roads.length
            };
            this.trigger("simulate-road-change", m);
            this.render();
        };
        Adjuster.prototype.render = function () {
            this.setBusy(false);
            this.$el.html(this.template(this.getRenderData()));
            return this;
        };
        Adjuster.prototype.getRenderData = function () {
            var n = _.pick(this.data, "roads", "name", "id");
            n.roads = _.map(n.roads, function (dd) {
                var n = {};
                n.name = dd.name;
                if (dd.isOpen) {
                    n["class"] = "close";
                }
                else {
                    n["class"] = "open";
                }
                return n;
            });
            return n;
        };
        Adjuster.prototype.setData = function (d) {
            this.data = d;
            this.render();
        };
        return Adjuster;
    }(View_4.View));
    exports.Adjuster = Adjuster;
});
define("Apps/Vicroad/Map/DatePanal", ["require", "exports", "Jigsaw/Core/View", "moment", "Jigsaw/Utils/Util"], function (require, exports, View_5, moment, Util_3) {
    "use strict";
    exports.__esModule = true;
    var DatePanal = (function (_super) {
        __extends(DatePanal, _super);
        function DatePanal(conf) {
            var _this = _super.call(this, Util_3.Util.deepExtend({ style: { bottom: null } }, conf)) || this;
            _this.addClass("datapanal");
            _this.setTime(new Date());
            return _this;
        }
        DatePanal.prototype.render = function () {
            this.$el.html("<section>\n                        <div class=\"date\">" + this.dataTime.date + "</div>\n                            <div class=\"time\">\n                                <span class=\"hour\">" + this.dataTime.hour + "</span>\n                                <span class=\"spliter\">:</span>\n                                <span class=\"min\">" + this.dataTime.minute + "</span>\n                            </div>\n                        </section>");
            return this;
        };
        DatePanal.prototype.setTime = function (t) {
            var m = moment(t);
            this.dataTime = {
                date: m.format('YYYY-MM-DD'),
                hour: m.format('HH'),
                minute: m.format("mm")
            };
            this.dataTime.date = m.format('YYYY-MM-DD');
            this.dataTime.hour = m.format('HH');
            this.dataTime.minute = m.format("mm");
            this.render();
            return this;
        };
        return DatePanal;
    }(View_5.View));
    exports.DatePanal = DatePanal;
});
define("Jigsaw/Core/JRequest", ["require", "exports", "underscore", "jquery", "Jigsaw/Core/Evented"], function (require, exports, _, $, Evented_2) {
    "use strict";
    exports.__esModule = true;
    var JPromise = (function (_super) {
        __extends(JPromise, _super);
        function JPromise() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JPromise.prototype.done = function (fn) {
            this.on("done", fn);
            return this;
        };
        JPromise.prototype.fail = function (fn) {
            this.on("fail", fn);
            return this;
        };
        JPromise.prototype.then = function (fn1, fn2) {
            if (fn1) {
                this.done(fn1);
            }
            if (fn2) {
                this.fail(fn2);
            }
            return this;
        };
        JPromise.prototype.doDone = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.fire.apply(this, ["done"].concat(args));
        };
        JPromise.prototype.doFail = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.fire.apply(this, ["fail"].concat(args));
        };
        return JPromise;
    }(Evented_2.Evented));
    exports.JPromise = JPromise;
    function JMultiRequest(requestNum, requestIteral) {
        var rs = [];
        for (var i = 0; i < requestNum; ++i) {
            rs.push(new JRequest);
        }
        _.each(rs, requestIteral);
        return rs;
    }
    exports.JMultiRequest = JMultiRequest;
    function JWhenAll() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var promise = new JPromise();
        if (_.isArray(args[0])) {
            args = args[0];
        }
        var acc = args.length;
        var counter = 0;
        var rs = [];
        _.each(args, function (jr, i) {
            jr.on("done", function (d) {
                rs[i] = d;
                counter++;
                if (counter == acc) {
                    promise.doDone.apply(promise, rs);
                }
            });
            jr.on("fail", function (d) {
                promise.doFail(d);
            });
            jr.send();
        });
        return promise;
    }
    exports.JWhenAll = JWhenAll;
    var JRequest = (function (_super) {
        __extends(JRequest, _super);
        function JRequest(conf) {
            var _this = _super.call(this) || this;
            _this.method = "GET";
            _this.doneHander = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.fire.apply(_this, ["done"].concat(args));
            };
            _this.errorHander = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.fire.apply(_this, ["fail"].concat(args));
            };
            _.extend(_this, conf);
            return _this;
        }
        JRequest.prototype.changeDoneHandler = function (fn) {
            this.doneHander = fn;
            return this;
        };
        JRequest.prototype.handleDone = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var jRequest = this;
            this.doneHander.apply(this, args);
        };
        JRequest.prototype.handleError = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var jRequest = this;
            this.errorHander.apply(this, args);
        };
        JRequest.prototype.send = function (ctx) {
            $.ajax(this.buildUrl(ctx), {
                success: this.handleDone.bind(this),
                error: this.handleError.bind(this),
                method: this.method.toUpperCase(),
                data: JSON.stringify(this.buildData(ctx))
            });
        };
        JRequest.prototype.buildUrl = function (ctx) {
            var _this = this;
            var us = [];
            _.each(_.extend({}, this.params, _.pick.apply(null, [this.context].concat(_.keys(this.params))), _.pick.apply(null, [ctx].concat(_.keys(this.params)))), function (v, k) {
                if (_.isArray(_this.params[k])) {
                    _.each(v, function (vv) {
                        us.push(k + "=" + vv);
                    });
                }
                else {
                    us.push(k + "=" + v);
                }
            });
            var base = us.length > 0 ? this.url + "?" : this.url;
            return base + us.join("&");
        };
        JRequest.prototype.buildData = function (ctx) {
            return _.extend({}, this.data, _.pick.apply(null, [this.context].concat(_.keys(this.data))), _.pick.apply(null, [ctx].concat(_.keys(this.data))));
        };
        JRequest.prototype.setContext = function (c) {
            this.context = _.extend({}, this.context, c);
            return this;
        };
        return JRequest;
    }(JPromise));
    exports.JRequest = JRequest;
});
define("Apps/Vicroad/APIConfig", ["require", "exports", "underscore", "moment", "Jigsaw/Core/JRequest", "Jigsaw/Data/DataDefine", "Jigsaw/Utils/Util"], function (require, exports, _, moment, JRequest_1, DataDefine_1, Util_4) {
    "use strict";
    exports.__esModule = true;
    exports.mainArea = new JRequest_1.JRequest();
    var API;
    (function (API) {
        function getMainArea(ctx) {
            var r = new JRequest_1.JRequest();
            r.url = "/service/apps/tcm/maps/tpi/query/area_search.json";
            r.changeDoneHandler(function (d) {
                var f = new DataDefine_1.GeoJSON.FeatureCollection(d);
                var p = _.first(f.getPolygon());
                if (p) {
                    r.fire("done", { latlngs: p.getleafletCoorinates() });
                }
                else {
                    r.doFail();
                }
            });
            r.send();
            return r;
        }
        API.getMainArea = getMainArea;
        function getRoad(lat, lng) {
            var r = new JRequest_1.JRequest();
            r.url = "/service/apps/itm/maps/itm/query/point2edge.json";
            r.params = {
                lat: null,
                lng: null
            };
            r.changeDoneHandler(function (d) {
                var f = new DataDefine_1.GeoJSON.FeatureCollection(d);
                if (_.isEmpty(f.getPoint()) || _.isEmpty(f.getPolyline())) {
                    r.fire("fail");
                }
                else {
                    r.fire("done", {
                        point: _.first(f.getPoint()).getleafletCoorinates(),
                        path: _.first(f.getPolyline()).getleafletCoorinates(),
                        roadNum: _.first(f.getPolyline()).getProperty("properties/AVGLANES"),
                        name: _.first(f.getPolyline()).getProperty("properties/NAME"),
                        id: _.first(f.getPolyline()).getProperty("properties/OSM_ID")
                    });
                }
            });
            r.send({ lat: lat, lng: lng });
            return r;
        }
        API.getRoad = getRoad;
        function beginSimulation(controls, timeFrom) {
            var r = new JRequest_1.JRequest();
            r.url = "/services/vicroad/localtasks/simulation";
            r.method = "POST";
            r.params = {
                user: null,
                project: null
            };
            r.data = {
                features: [],
                srid: 4326,
                decimals: 0
            };
            var features = [{ controls: controls, timeFrom: moment(timeFrom).format("YYYY-MM-DDTHH:mm:00Z") }];
            r.send({ features: features, user: Math.random(), project: "user1" });
            return r;
        }
        API.beginSimulation = beginSimulation;
        function getReTimeDatas(latlngs, time) {
            var p = new JRequest_1.JPromise();
            var url = "/services/vicroad/tiers/routingSimulate/extent/15/144.92022514343265%2C-37.83263257682617%2C145.00185012817386%2C-37.79750922077998/4326.w2";
            var ls = latlngs.map(function (l) {
                return l.lng + "," + l.lat;
            });
            var rs = JRequest_1.JMultiRequest(5, function (r, i) {
                r.url = url;
                r.params = {
                    l: ls, timeFrom: "",
                    category: 0,
                    project: "user1"
                };
                r.setContext({ timeFrom: moment(time).add(15 * i, 'm').format("YYYY-MM-DDTHH:mm:00Z") });
                r.changeDoneHandler(function (d) {
                    var featureCollection = JSON.parse(d);
                    var t = 0;
                    _.each(featureCollection.features, function (f) {
                        if (Util_4.Util.getProperty(f, "time")) {
                            t += +Util_4.Util.getProperty(f, "time");
                        }
                    });
                    console.log(r.context["timeFrom"], t);
                    r.doDone({ y: t, x: new Date(r.context["timeFrom"]) });
                });
            });
            // let r0=new JRequest({
            //      url,params:{
            //          l:ls,timeFrom:""
            //      }
            //  }).changeDoneHandler((d)=>{
            //       let featureCollection=JSON.parse(d)
            //       let t=0
            //        _.each(featureCollection.features,(f)=>{
            //            if(Util.getProperty(f,"time")){
            //                t+=+Util.getProperty(f,"time")
            //            }
            //        })
            //        console.log(r0.context["timeFrom"],t)
            //       r0.doDone({y:t,x:r0.context["timeFrom"]})
            //   }).setContext({timeFrom:moment(time).format("YYYY-MM-DDTHH:mm:00Z")})
            //  let r1=new JRequest({
            //      url,params:{
            //          l:ls,timeFrom:""
            //      }
            //  }).changeDoneHandler((d)=>{
            //       let featureCollection=JSON.parse(d)
            //       let t=0
            //        _.each(featureCollection.features,(f)=>{
            //            if(Util.getProperty(f,"time")){
            //                t+=+Util.getProperty(f,"time")
            //            }
            //        })
            //        console.log(r1.context["timeFrom"],t)
            //       r1.doDone({y:t,x:r1.context["timeFrom"]})
            //   }).setContext({timeFrom:moment(time).add(15,"m").format("YYYY-MM-DDTHH:mm:00Z")})
            //     let r2=new JRequest({
            //      url,params:{
            //          l:ls,timeFrom:""
            //      }
            //  }).changeDoneHandler((d)=>{
            //       let featureCollection=JSON.parse(d)
            //       let t=0
            //        _.each(featureCollection.features,(f)=>{
            //            if(Util.getProperty(f,"time")){
            //                t+=+Util.getProperty(f,"time")
            //            }
            //        })
            //        console.log(r2.context["timeFrom"],t)
            //       r2.doDone({y:t,x:r2.context["timeFrom"]})
            //   }).setContext({timeFrom:moment(time).add(30,"m").format("YYYY-MM-DDTHH:mm:00Z")})
            //       let r3=new JRequest({
            //      url,params:{
            //          l:ls,timeFrom:""
            //      }
            //  }).changeDoneHandler((d)=>{
            //       let featureCollection=JSON.parse(d)
            //       let t=0
            //        _.each(featureCollection.features,(f)=>{
            //            if(Util.getProperty(f,"time")){
            //                t+=+Util.getProperty(f,"time")
            //            }
            //        })
            //        console.log(r3.context["timeFrom"],t)
            //       r3.doDone({y:t,x:r3.context["timeFrom"]})
            //   }).setContext({timeFrom:moment(time).add(45,"m").format("YYYY-MM-DDTHH:mm:00Z")})
            //        let r4=new JRequest({
            //      url,params:{
            //          l:ls,timeFrom:""
            //      }
            //  }).changeDoneHandler((d)=>{
            //       let featureCollection=JSON.parse(d)
            //       let t=0
            //        _.each(featureCollection.features,(f)=>{
            //            if(Util.getProperty(f,"time")){
            //                t+=+Util.getProperty(f,"time")
            //            }
            //        })
            //        console.log(r4.context["timeFrom"],t)
            //       r4.doDone({y:t,x:r4.context["timeFrom"]})
            //   }).setContext({timeFrom:moment(time).add(60,"m").format("YYYY-MM-DDTHH:mm:00Z")})
            JRequest_1.JWhenAll(rs).done(function (d0, d1, d2, d3, d4) {
                p.doDone([{ id: "Travel Time", data: [d0, d1, d2, d3, d4], type: "line" }]);
            }).fail(function (d) {
                p.doFail(d);
            });
            //  setTimeout(()=>{
            //       r.doDone([{id:1, data:[{x:0,y:0},{x:3,y:2},{x:5,y:8},{x:7,y:32}], type:"line"},
            //                 {id:2, data:[{x:1,y:32},{x:3,y:8},{x:5,y:2},{x:8,y:1}], type:"line"}])
            //  },2000)
            return p;
        }
        API.getReTimeDatas = getReTimeDatas;
        function getReTimeRouter(latlngs, time) {
            var url = "/services/vicroad/tiers/routingSimulate/extent/15/144.92022514343265%2C-37.83263257682617%2C145.00185012817386%2C-37.79750922077998/4326.w2";
            var ls = latlngs.map(function (l) {
                return l.lng + "," + l.lat;
            });
            var r0 = new JRequest_1.JRequest({
                url: url, params: {
                    l: ls, timeFrom: "",
                    category: 0,
                    project: "user1"
                }
            }).changeDoneHandler(function (d) {
                r0.doDone(JSON.parse(d));
            });
            r0.send({ timeFrom: moment(time).format("YYYY-MM-DDTHH:mm:00Z") });
            return r0;
        }
        API.getReTimeRouter = getReTimeRouter;
        // export function getSimulationResult(time:Date){
        //     let r= new JRequest
        //     r.url="/services/vicroad/tiers/ctmEdgeSpeedMap/4326.w2"
        //     r.params={
        //         category:1,
        //         timeTo:"2017-05-08T16:45:00%2B08:00"
        //     }
        //     r.send()
        //     return r
        // }
        function getSimulationResultURL() {
            var r = new JRequest_1.JRequest;
            r.url = "/services/vicroad/tiers/ctmEdgeSpeedMap/extent/:zoom/:extent/canvas.w2";
            r.params = {
                category: 1,
                project: "user1",
                timeTo: ":timeTo"
            };
            return r.buildUrl();
        }
        API.getSimulationResultURL = getSimulationResultURL;
        function getSimulationResultWithoutAdjusterURL() {
            var r = new JRequest_1.JRequest;
            r.url = "/services/vicroad/tiers/ctmEdgeSpeedMap/extent/:zoom/:extent/canvas.w2";
            r.params = {
                category: 0,
                project: "user1",
                timeTo: ":timeTo"
            };
            return r.buildUrl();
        }
        API.getSimulationResultWithoutAdjusterURL = getSimulationResultWithoutAdjusterURL;
        function getSimulationRoadDetail(id, time) {
            var r = new JRequest_1.JRequest({
                url: "/services/vicroad/tiers/ctmEdgeSpeedCompare/4326.w2"
            });
            r.params = {
                id: 0, timeFrom: null, project: "user1"
            };
            r.changeDoneHandler(function (d) {
                var fc;
                var origion = [];
                var change = [];
                if (_.isString(d)) {
                    fc = JSON.parse(d);
                }
                else {
                    fc = d;
                }
                _.each(fc.features, function (f) {
                    origion.push({ x: f["TIMESLOT"], y: f["ORIGION_SPEED"] });
                    change.push({ x: f["TIMESLOT"], y: f["CHANGE_SPEED"] });
                });
                r.doDone([{ id: 1, data: origion, type: "line" }, { id: 2, data: change, type: "line" }]);
            });
            r.send({ id: id, timeFrom: moment(time).format("YYYY-MM-DDTHH:mm:00Z") });
            return r;
        }
        API.getSimulationRoadDetail = getSimulationRoadDetail;
        function getSimulationRouterChartData(latlngs, time) {
            var p = new JRequest_1.JPromise();
            var url = "/services/vicroad/tiers/routingSimulate/extent/15/144.92022514343265%2C-37.83263257682617%2C145.00185012817386%2C-37.79750922077998/4326.w2";
            var ls = latlngs.map(function (l) {
                return l.lng + "," + l.lat;
            });
            var rs1 = JRequest_1.JMultiRequest(5, function (r, i) {
                r.url = url;
                r.params = {
                    l: ls, timeFrom: "", catagory: 1, project: "user1"
                };
                r.setContext({ timeFrom: moment(time).add(15 * i, 'm').format("YYYY-MM-DDTHH:mm:00Z") });
                r.changeDoneHandler(function (d) {
                    var featureCollection = JSON.parse(d);
                    var t = 0;
                    _.each(featureCollection.features, function (f) {
                        if (Util_4.Util.getProperty(f, "time")) {
                            t += +Util_4.Util.getProperty(f, "time");
                        }
                    });
                    console.log(r.context["timeFrom"], t);
                    r.doDone({ y: t, x: r.context["timeFrom"] });
                });
            });
            var rs2 = JRequest_1.JMultiRequest(5, function (r, i) {
                r.url = url;
                r.params = {
                    l: ls, timeFrom: "", catagory: 1
                };
                r.setContext({ timeFrom: moment(time).add(15 * i, 'm').format("YYYY-MM-DDTHH:mm:00Z") });
                r.changeDoneHandler(function (d) {
                    var featureCollection = JSON.parse(d);
                    var t = 0;
                    _.each(featureCollection.features, function (f) {
                        if (Util_4.Util.getProperty(f, "time")) {
                            t += +Util_4.Util.getProperty(f, "time");
                        }
                    });
                    console.log(r.context["timeFrom"], t);
                    r.doDone({ y: t, x: r.context["timeFrom"] });
                });
            });
            JRequest_1.JWhenAll(rs1.concat(rs2)).done(function (d0, d1, d2, d3, d4, d5, d6, d7, d8, d9) {
                p.doDone([{ id: 1, data: [d0, d1, d2, d3, d4], type: "line" }, { id: 2, data: [d5, d6, d7, d8, d9], type: "line" }]);
            }).fail(function (d) {
                p.doFail(d);
            });
            //  setTimeout(()=>{
            //       r.doDone([{id:1, data:[{x:0,y:0},{x:3,y:2},{x:5,y:8},{x:7,y:32}], type:"line"},
            //                 {id:2, data:[{x:1,y:32},{x:3,y:8},{x:5,y:2},{x:8,y:1}], type:"line"}])
            //  },2000)
            return p;
        }
        API.getSimulationRouterChartData = getSimulationRouterChartData;
    })(API = exports.API || (exports.API = {}));
});
define("Apps/Vicroad/Chart/LineChart", ["require", "exports", "CustomizedChart/Vicroad/VicroadChart"], function (require, exports, VicroadChart_2) {
    "use strict";
    exports.__esModule = true;
    var VicroadLineChart = (function (_super) {
        __extends(VicroadLineChart, _super);
        function VicroadLineChart() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VicroadLineChart.prototype.toElement = function () {
            return _super.prototype.toElement.call(this);
        };
        return VicroadLineChart;
    }(VicroadChart_2.LineChart));
    exports.VicroadLineChart = VicroadLineChart;
});
define("Jigsaw/Component/Map/MapDrawer", ["require", "exports", "Jigsaw/Core/Evented"], function (require, exports, Evented_3) {
    "use strict";
    exports.__esModule = true;
    var BaseDrawer = (function (_super) {
        __extends(BaseDrawer, _super);
        function BaseDrawer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseDrawer.prototype.drawOn = function (m) {
            this.map = m;
            this.fire("begindraw");
            return this;
        };
        BaseDrawer.prototype.setMap = function (m) {
            this.map = m;
        };
        BaseDrawer.prototype.setInteractiveLayer = function (l) {
            this.interactiveLayer = l;
            return this;
        };
        return BaseDrawer;
    }(Evented_3.Evented));
    exports.BaseDrawer = BaseDrawer;
    var PointDrawer = (function (_super) {
        __extends(PointDrawer, _super);
        function PointDrawer() {
            var _this = _super.call(this) || this;
            _this.latlngs = [];
            _this.on("begindraw", _this.begin, _this);
            return _this;
        }
        PointDrawer.prototype.begin = function () {
            if (this.interactiveLayer) {
                this.drawing = true;
                this.interactiveLayer.on("click", this.onClick, this);
                this.interactiveLayer.on("dblclick", this.onDbclick, this);
                this.interactiveLayer.on("mousemove", this.onMouseMove, this);
                this.map.dragging.disable();
                this.map.doubleClickZoom.disable();
            }
        };
        PointDrawer.prototype.cancel = function () {
            this.fire("cancel");
            this.endDraw(true);
        };
        PointDrawer.prototype.onClick = function (e) {
            if (this.latlngs && this.latlngs.length > 0) {
                this.latlngs.push(e.latlng);
                this.fire("drawing", { latlngs: this.latlngs });
            }
            else {
                this.latlngs = [];
                this.latlngs.push(e.latlng);
                this.fire("drawbegin", { latlngs: this.latlngs });
            }
        };
        PointDrawer.prototype.onDbclick = function (e) {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            this.endDraw();
        };
        PointDrawer.prototype.onMouseMove = function (e) {
            if (this.latlngs.length > 0) {
                this.fire("drawing", { latlngs: this.latlngs.concat(e.latlng) });
            }
        };
        PointDrawer.prototype.endDraw = function (cancled) {
            if (!cancled) {
                this.fire("drawend", { latlngs: this.latlngs });
            }
            this.interactiveLayer.off("click", this.onClick, this);
            this.interactiveLayer.off("dblclick", this.onDbclick, this);
            this.interactiveLayer.off("mousemove", this.onMouseMove, this);
            this.latlngs = [];
            this.drawing = false;
            this.map.dragging.enable();
            this.map.doubleClickZoom.enable();
            // var self=this;
            // setTimeout(function(){
            //     self.map.doubleClickZoom.enable(); 
            // },100)
        };
        return PointDrawer;
    }(BaseDrawer));
    exports.PointDrawer = PointDrawer;
    var RoadPicker = (function (_super) {
        __extends(RoadPicker, _super);
        function RoadPicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RoadPicker.prototype.begin = function () {
            if (this.interactiveLayer) {
                this.interactiveLayer.on("click", this.onclick, this);
            }
        };
        RoadPicker.prototype.end = function () {
            if (this.interactiveLayer) {
                this.interactiveLayer.off("click", this.onclick, this);
            }
        };
        RoadPicker.prototype.cancel = function () {
            if (this.interactiveLayer) {
                this.interactiveLayer.off("click", this.onclick, this);
            }
        };
        RoadPicker.prototype.onclick = function (e) {
            this.drawing = true;
            this.fire("drawing", e);
            this.oldLatlng = e.latlng;
            this.fetch();
        };
        RoadPicker.prototype.fetch = function () {
            var _this = this;
            this.fire("fetching");
            $.get(this.baseUrl + ("lng=" + this.oldLatlng.lng + "&lat=" + this.oldLatlng.lat))
                .done(function (d) {
                _this.fire("drawend", d);
            })
                .fail(function (d) {
                _this.fire("cancel", null);
            });
        };
        return RoadPicker;
    }(BaseDrawer));
    exports.RoadPicker = RoadPicker;
});
define("Apps/Vicroad/Map/Picker", ["require", "exports", "Jigsaw/Component/Map/MapDrawer", "Apps/Vicroad/APIConfig"], function (require, exports, MapDrawer_1, APIConfig_1) {
    "use strict";
    exports.__esModule = true;
    var RouterPicker = (function (_super) {
        __extends(RouterPicker, _super);
        function RouterPicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RouterPicker.prototype.begin = function () {
            if (this.interactiveLayer) {
                this.drawing = true;
                this.interactiveLayer.on("click", this.onClick, this);
                this.interactiveLayer.on("dblclick", this.onDbclick, this);
                this.interactiveLayer.on("mousemove", this.onMouseMove, this);
                //this.map.dragging.disable();
                this.map.doubleClickZoom.disable();
            }
        };
        RouterPicker.prototype.onClick = function (e) {
            if (this.latlngs && this.latlngs.length > 0) {
                this.latlngs.push(e.latlng);
                this.fire("to", { latlngs: this.latlngs });
                this.endDraw();
            }
            else {
                this.latlngs = [];
                this.latlngs.push(e.latlng);
                this.fire("from", { latlngs: this.latlngs });
                this.fire("drawbegin", { latlngs: this.latlngs });
            }
        };
        return RouterPicker;
    }(MapDrawer_1.PointDrawer));
    exports.RouterPicker = RouterPicker;
    var RoadPicker = (function (_super) {
        __extends(RoadPicker, _super);
        function RoadPicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RoadPicker.prototype.begin = function () {
            if (this.interactiveLayer) {
                this.interactiveLayer.on("click", this.onclick, this);
            }
        };
        RoadPicker.prototype.end = function () {
            if (this.interactiveLayer) {
                this.interactiveLayer.off("click", this.onclick, this);
            }
        };
        RoadPicker.prototype.cancel = function () {
            if (this.interactiveLayer) {
                this.interactiveLayer.off("click", this.onclick, this);
            }
        };
        RoadPicker.prototype.onclick = function (e) {
            this.drawing = true;
            this.fire("drawing", e);
            this.oldLatlng = e.latlng;
            this.fetch();
        };
        RoadPicker.prototype.fetch = function () {
            var _this = this;
            this.fire("fetching");
            APIConfig_1.API.getRoad(this.oldLatlng.lat, this.oldLatlng.lng).done(function (d) {
                if (!d.point || !d.path) {
                    _this.fire("fail");
                }
                else {
                    _this.fire("drawend", d);
                }
            }).fail(function () {
                _this.fire("fail");
            });
            // $.get(this.baseUrl+`lng=${this.oldLatlng.lng}&lat=${this.oldLatlng.lat}`)
            // .done((d)=>{
            //     let f=new FeatureCollection(d)
            //     if(_.isEmpty(f.getPoint())||_.isEmpty(f.getPolyline())){
            //         this.fire("fail")
            //     }else{
            //         this.fire("drawend",{
            //             point:_.first(f.getPoint()).getleafletCoorinates(),
            //             path:_.first(f.getPolyline()).getleafletCoorinates(),
            //             roadNum:_.first(f.getPolyline()).getProperty("properties/AVGLANES"),
            //             name:_.first(f.getPolyline()).getProperty("properties/NAME"),
            //             id:_.first(f.getPolyline()).getProperty("properties/ID"),
            //         })
            //     }
            // })
            // .fail((d)=>{
            //     this.fire("fail",null)
            // })
        };
        return RoadPicker;
    }(MapDrawer_1.BaseDrawer));
    exports.RoadPicker = RoadPicker;
});
define("Apps/Vicroad/Map/VicroadMap", ["require", "exports", "Jigsaw/Component/Map/G2Map", "leaflet", "moment", "Apps/Vicroad/Map/Adjuster", "Apps/Vicroad/Map/DatePanal", "Apps/Vicroad/APIConfig", "Jigsaw/Utils/Util", "Apps/Vicroad/Chart/LineChart", "Apps/Vicroad/Map/Picker"], function (require, exports, G2Map_2, L, moment, Adjuster_1, DatePanal_1, APIConfig_2, Util_5, LineChart_1, Picker_1) {
    "use strict";
    exports.__esModule = true;
    var VicroadMap = (function (_super) {
        __extends(VicroadMap, _super);
        function VicroadMap(conf) {
            var _this = _super.call(this, Util_5.Util.deepExtend({ zoomControl: false, "class": "map" }, conf)) || this;
            _this.init();
            return _this;
        }
        VicroadMap.prototype.init = function () {
            this.datePanal = new DatePanal_1.DatePanal();
            this.datePanal.appendAt(this.rootView.$el);
            this.datePanal.style({
                "z-index": 2000,
                position: "absolute",
                width: "100%"
            });
            //this.on("adjuster-btn-on",this.doSelectAdjuster,this)
            //this.on("router-btn-off",this.doSimulationRoadPick,this)
            //this.on("simulator-apply",this.doReRouter,this)
            //this.on("simulate-router-btn-on",this.doRouter,this)
            this.roadPicker = new Picker_1.RoadPicker();
            //this.roadPicker.baseUrl = "/service/apps/itm/maps/itm/query/point2edge.json?"
            this.roadPicker.setMap(this.map.leaflet);
            this.routerPicker = new Picker_1.RouterPicker();
            this.routerPicker.setMap(this.map.leaflet);
            this.adjuster = new Adjuster_1.Adjuster;
            this.vicroadlayers = L.layerGroup([]).addTo(this.map.leaflet);
            // this.adjusterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
            // this.reTimeRouterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
            // this.simulateRouterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
            // this.on("simulation:done",this.showSimulationResult,this)
            this.initLayers();
            this.initArea();
            this.initAll();
        };
        VicroadMap.prototype.addHooks = function () {
            var _this = this;
            this.on("time-change", function (d) {
                _this.datePanal.setTime(d.dateTime);
            });
            //this.on("retime-apply", this.doReTimeRouter, this)
        };
        VicroadMap.prototype.doReTime = function () {
            var _this = this;
            this.on("retime-apply", function () {
                _this.roadPicker.off("*");
                var latlngs;
                var chart = new LineChart_1.VicroadLineChart({
                    chartTitle: {
                        value: "Travel Time Chart"
                    },
                    style: { width: "30rem", height: "20rem" }, line: {
                        defaultTimeAdjust: _this.getContext("currentTime")
                    }
                });
                var layers = L.layerGroup([]);
                _this.vicroadlayers.addLayer(layers);
                var mBegin = L.marker([0, 0], { icon: L.divIcon({ className: 'routerFrom' }) }), mEnd = L.marker([0, 0], { icon: L.divIcon({ className: 'routerTo' }) }), mPath = L.polyline([], { interactive: false });
                layers.addLayer(mBegin).addLayer(mEnd).addLayer(mPath);
                var retimeHandler = function () {
                    APIConfig_2.API.getReTimeRouter(latlngs, _this.getContext("currentTime")).done(function (d) {
                        //chart.setTime()
                        _this.layer("router").setData(d);
                        _this.layer("router").redraw(true);
                        mPath.setLatLngs([]);
                    });
                };
                _this.routerPicker.on("from", function (e) {
                    mBegin.setLatLng(e.latlngs[0]);
                    mEnd.setLatLng([0, 0]);
                    mPath.setLatLngs([]);
                });
                _this.routerPicker.on("to", function (e) {
                    mEnd.setLatLng(e.latlngs[1]);
                });
                _this.routerPicker.on("drawend", function (e) {
                    mPath.setLatLngs(e.latlngs);
                    _this.send("retime-router-done", { latlngs: e.latlngs });
                    APIConfig_2.API.getReTimeRouter(e.latlngs, _this.getContext("currentTime")).done(function (d) {
                        _this.layer("router").setData(d);
                        _this.layer("router").redraw(true);
                        mPath.setLatLngs([]);
                    });
                    latlngs = e.latlngs;
                    _this.on("time-change", retimeHandler);
                    APIConfig_2.API.getReTimeDatas(e.latlngs, _this.getContext("beginTime")).done(function (d) {
                        chart.clearMeasure();
                        chart.loadMeasures(d);
                        _this.on("time-change", function (d) {
                            setTimeout(function () {
                                chart.setTimeAdjust(_this.getContext("currentTime"));
                            }, 50);
                        });
                        mEnd.bindPopup(chart.toElement());
                        mEnd.openPopup();
                        chart.setTimeAdjust(_this.getContext("currentTime"));
                    });
                    setTimeout(function () {
                        _this.routerPicker.begin();
                    }, 200);
                });
                _this.routerPicker.on("drawing", function (e) {
                    mPath.setLatLngs(e.latlngs);
                });
                _this.routerPicker.on("drawbegin", function (e) {
                    // this.send("retime-router-drawing", { latlngs: e.latlngs })
                    _this.off("time-change", retimeHandler);
                    _this.layer("router").hide();
                });
                _this.routerPicker.begin();
            });
        };
        // doReTimeRouter() {
        //     this.roadPicker.off("*")
        //     let latlngs
        //     let mBegin = L.marker([0, 0]), mEnd = L.marker([0, 0]), mPath = L.polyline([], { interactive: false })
        //     this.reTimeRouterLayerGroup.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)
        //     let retimeHandler = () => {
        //         API.getReTimeRouter(latlngs, this.getContext("currentTime")).done((d) => {
        //             this.routerChart
        //             this.layer("router").setData(d)
        //             this.layer("router").redraw(true)
        //             mPath.setLatLngs([])
        //         })
        //     }
        //     this.routerPicker.on("from", (e) => {
        //         mBegin.setLatLng(e.latlngs[0])
        //         mEnd.setLatLng([0, 0])
        //         mPath.setLatLngs([])
        //     })
        //     this.routerPicker.on("to", (e) => {
        //         mEnd.setLatLng(e.latlngs[1])
        //     })
        //     this.routerPicker.on("drawend", (e) => {
        //         mPath.setLatLngs(e.latlngs)
        //         this.send("retime-router-done", { latlngs: e.latlngs })
        //         API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {
        //             this.layer("router").setData(d)
        //             this.layer("router").redraw(true)
        //             mPath.setLatLngs([])
        //         })
        //         latlngs = e.latlngs
        //         this.on("time-change", retimeHandler)
        //         API.getReTimeDatas(e.latlngs, this.getContext("currentTime")).done((d) => {
        //             this.routerChart.clearMearsure()
        //             this.routerChart.loadMeasures(d)
        //             mEnd.bindPopup(this.routerChart.toElement())
        //             mEnd.openPopup()
        //         })
        //         setTimeout(() => {
        //             this.routerPicker.begin()
        //         }, 200)
        //     })
        //     this.routerPicker.on("drawing", (e) => {
        //         mPath.setLatLngs(e.latlngs)
        //     })
        //     this.routerPicker.on("drawbegin", (e) => {
        //         this.send("retime-router-drawing", { latlngs: e.latlngs })
        //         this.off("time-change", retimeHandler)
        //         this.layer("router").hide()
        //     })
        //     this.routerPicker.begin()
        // }
        VicroadMap.prototype.doReRouter = function () {
            var _this = this;
            var adjusterLayers = L.layerGroup([]);
            this.vicroadlayers.addLayer(adjusterLayers);
            var routerLayers = L.layerGroup([]);
            this.vicroadlayers.addLayer(routerLayers);
            var roadPickLayers = L.layerGroup([]);
            this.vicroadlayers.addLayer(roadPickLayers);
            var clearMap = function () {
                roadPickLayers.clearLayers();
                routerLayers.clearLayers();
                adjusterLayers.clearLayers();
                _this.off("time-change");
                _this.layer("router").hide();
            };
            var doAdjuster = function () {
                clearMap();
                var oneAdjuster = function () {
                    _this.roadPicker.off("*");
                    ////begin adjute road
                    var adjuster = new Adjuster_1.Adjuster();
                    _this.proxyEvents(adjuster, "simulate-road-change");
                    var road = L.polyline([], { color: "#af1919" });
                    adjusterLayers.addLayer(road);
                    var roadMark = L.marker([0, 0], { icon: L.divIcon({ className: 'adjusterIcon fa fa-times' }) });
                    roadMark.bindPopup(adjuster.getNode());
                    adjusterLayers.addLayer(roadMark);
                    _this.roadPicker.on("drawing", function (e) {
                        roadMark.setOpacity(1);
                        roadMark.setLatLng(e.latlng);
                        adjuster.setData({ id: null, name: null, roads: [] });
                        adjuster.setBusy(true);
                        roadMark.openPopup();
                    });
                    _this.roadPicker.on("fail", function (e) {
                        roadMark.setOpacity(.5);
                        adjuster.setData({ id: null, name: null, roads: [] });
                        road.setLatLngs([]);
                        roadMark.closePopup();
                    });
                    _this.roadPicker.on("drawend", function (e) {
                        if (e.point) {
                            roadMark.setLatLng(e.point);
                            adjuster.setBusy(false);
                        }
                        if (e.path) {
                            road.setLatLngs(e.path);
                        }
                        if (e.roadNum != undefined) {
                            var roads = [];
                            for (var i = 0; i < e.roadNum; ++i) {
                                roads.push({ name: "Lane-" + (i + 1), isOpen: true });
                            }
                            adjuster.setData({ roads: roads, name: e.name, id: e.id });
                            roadMark.bindPopup(adjuster.getNode());
                        }
                        roadMark.setOpacity(1);
                    });
                    _this.roadPicker.begin();
                    _this.on("simulate-road-change", function () {
                        _this.roadPicker.off("*");
                    });
                };
                oneAdjuster();
                _this.on("simulate-road-change", function () {
                    oneAdjuster();
                });
            };
            ////init roadpicker
            //////simulation done
            var showSimultaionResult = function () {
                var time = _this.getContext("currentTime");
                if (time) {
                    _this.layer("Traffic Condition - After ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") });
                    _this.layer("Traffic Condition - Before ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") });
                }
                _this.layer("Traffic Condition - Before ReRoute").addToControl("baselayer");
                _this.layer("Traffic Condition - After ReRoute").addToControl("baselayer");
                _this.layer("Traffic Condition - After ReRoute").show();
                _this.on("time-change", _this.updateSimulationResult, _this);
            };
            var doRoadPick = function () {
                clearMap();
                _this.roadPicker.off("*");
                _this.routerPicker.off("*");
                var roadChart = new LineChart_1.VicroadLineChart({
                    axis: {
                        yAxisTitleType: "speed"
                    },
                    chartTitle: {
                        value: "Road Speed Chart"
                    }, style: { width: "30rem", height: "20rem" }
                });
                var roadMark = L.marker([0, 0]);
                roadPickLayers.addLayer(roadMark);
                var road = L.polyline([]);
                roadPickLayers.addLayer(road);
                _this.roadPicker.on("drawing", function (e) {
                    roadMark.setOpacity(1);
                    roadMark.setLatLng(e.latlng);
                    //this.send("reRouter:rePickRoad")
                });
                _this.roadPicker.on("fail", function (e) {
                    roadMark.setOpacity(.5);
                });
                _this.roadPicker.on("drawend", function (e) {
                    if (e.point) {
                        roadMark.setLatLng(e.point);
                    }
                    if (e.path) {
                        road.setLatLngs(e.path);
                    }
                    if (e.id) {
                        APIConfig_2.API.getSimulationRoadDetail(e.id, _this.getContext("beginTime")).done(function (d) {
                            roadChart.clearMeasure();
                            roadChart.loadMeasures(d);
                            roadMark.bindPopup(roadChart.toElement());
                            roadChart.setTimeAdjust(_this.getContext("currentTime"));
                            _this.on("time-change", function () {
                                setTimeout(function () {
                                    roadChart.setTimeAdjust(_this.getContext("currentTime"));
                                }, 10);
                            });
                        });
                    }
                    roadMark.setOpacity(1);
                });
                _this.roadPicker.begin();
            };
            var doRouter = function () {
                _this.roadPicker.off("*");
                _this.routerPicker.off("*");
                clearMap();
                var mBegin = L.marker([0, 0], { icon: L.divIcon({ className: 'routerFrom' }) }), mEnd = L.marker([0, 0], { icon: L.divIcon({ className: 'routerTo' }) }), mPath = L.polyline([], { interactive: false });
                routerLayers.addLayer(mBegin).addLayer(mEnd).addLayer(mPath);
                _this.routerPicker.on("from", function (e) {
                    mBegin.setLatLng(e.latlngs[0]);
                    mEnd.setLatLng([0, 0]);
                    mPath.setLatLngs([]);
                });
                _this.routerPicker.on("to", function (e) {
                    mEnd.setLatLng(e.latlngs[1]);
                });
                var chartTimeChangeHandler = function (latlngs) {
                    APIConfig_2.API.getReTimeRouter(latlngs, _this.getContext("currentTime")).done(function (d) {
                        _this.layer("router").setData(d);
                        _this.layer("router").redraw(true);
                        mPath.setLatLngs([]);
                    });
                };
                _this.routerPicker.on("drawend", function (e) {
                    mPath.setLatLngs(e.latlngs);
                    APIConfig_2.API.getReTimeRouter(e.latlngs, _this.getContext("currentTime")).done(function (d) {
                        _this.layer("router").setData(d);
                        _this.layer("router").redraw(true);
                        mPath.setLatLngs([]);
                    });
                    var latlngs = e.latlngs;
                    _this.on("time-change", function () {
                        APIConfig_2.API.getReTimeRouter(e.latlngs, _this.getContext("currentTime")).done(function (d) {
                            _this.layer("router").setData(d);
                            _this.layer("router").redraw(true);
                            mPath.setLatLngs([]);
                        });
                    });
                    APIConfig_2.API.getSimulationRouterChartData(e.latlngs, _this.getContext("beginTime")).done(function (d) {
                        var linechart = new LineChart_1.VicroadLineChart({ chartTitle: {
                                value: "Travel Time Chart"
                            }, style: { width: "30rem", height: "20rem" } });
                        linechart.loadMeasures(d);
                        _this.on("time-change", function () {
                            setTimeout(function () {
                                linechart.setTimeAdjust(_this.getContext("currentTime"));
                            }, 10);
                        });
                        mEnd.bindPopup(linechart.toElement());
                        mEnd.openPopup();
                        linechart.setTimeAdjust(_this.getContext("currentTime"));
                    });
                    setTimeout(function () {
                        _this.routerPicker.begin();
                    }, 200);
                });
                _this.routerPicker.on("drawing", function (e) {
                    mPath.setLatLngs(e.latlngs);
                });
                _this.routerPicker.on("drawbegin", function (e) {
                    //this.send("reRouter:reRoute")
                    _this.layer("router").hide();
                    _this.off("time-change", function () {
                        APIConfig_2.API.getReTimeRouter(e.latlngs, _this.getContext("currentTime")).done(function (d) {
                            _this.layer("router").setData(d);
                            _this.layer("router").redraw();
                            mPath.setLatLngs([]);
                            //
                        });
                    });
                    _this.layer("router").hide();
                });
                _this.routerPicker.begin();
            };
            var simulationDone = function () {
                clearMap();
                showSimultaionResult();
                doRoadPick();
                _this.on("simulate-router-btn-off", doRoadPick, _this);
                _this.on("simulate-router-btn-on", doRouter, _this);
            };
            this.on("simulation:calculation-done", simulationDone, this);
            this.on("adjuster-btn-on", doAdjuster, this);
        };
        // doSimulationRoadPick() {
        //     this.roadPicker.off("*")
        //     let roadMark = L.marker([0, 0])
        //     roadMark.addTo(this.map.leaflet)
        //     let road = L.polyline([])
        //     road.addTo(this.map.leaflet)
        //     this.roadPicker.begin()
        //     this.roadPicker.on("drawing", (e) => {
        //         roadMark.setOpacity(1)
        //         roadMark.setLatLng(e.latlng)
        //     })
        //     this.roadPicker.on("fail", (e) => {
        //         roadMark.setOpacity(.5)
        //     })
        //     this.roadPicker.on("drawend", (e) => {
        //         if (e.point) {
        //             roadMark.setLatLng(e.point)
        //         }
        //         if (e.path) {
        //             road.setLatLngs(e.path)
        //         }
        //         if (e.id) {
        //             API.getSimulationRoadDetail(e.id, this.getContext("currentTime")).done((d) => {
        //                 let linechart = new VicroadLineChart({ style: { width: "30rem", height: "20rem" } })
        //                 linechart.loadMeasures(d)
        //                 roadMark.bindPopup(linechart.toElement())
        //             })
        //         }
        //         roadMark.setOpacity(1)
        //     })
        // }
        // doSelectAdjuster() {
        //     let adjuster = new Adjuster()
        //     this.proxyEvents(adjuster, "simulate-road-change")
        //     this.on("simulate-road-change", () => {
        //         this.roadPicker.off("*")
        //     })
        //     this.routerPicker.off("*")
        //     let roadMark = L.marker([0, 0], { icon: L.divIcon({ className: 'adjusterIcon fa fa-times' }) })
        //     roadMark.bindPopup(adjuster.getNode())
        //     this.adjusterLayerGroup.addLayer(roadMark)
        //     //roadMark.addTo(this.map.leaflet)
        //     let road = L.polyline([], { color: "red" })
        //     this.adjusterLayerGroup.addLayer(road)
        //     this.roadPicker.on("drawing", (e) => {
        //         roadMark.setOpacity(1)
        //         roadMark.setLatLng(e.latlng)
        //         adjuster.setData({ id: null, name: null, roads: [] })
        //         adjuster.setBusy(true)
        //         roadMark.openPopup()
        //     })
        //     this.roadPicker.on("fail", (e) => {
        //         roadMark.setOpacity(.5)
        //         adjuster.setData({ id: null, name: null, roads: [] })
        //         road.setLatLngs([])
        //         roadMark.closePopup()
        //     })
        //     this.roadPicker.on("drawend", (e) => {
        //         if (e.point) {
        //             roadMark.setLatLng(e.point)
        //             adjuster.setBusy(false)
        //         }
        //         if (e.path) {
        //             road.setLatLngs(e.path)
        //         }
        //         if (e.roadNum != undefined) {
        //             let roads = []
        //             for (let i = 0; i < e.roadNum; ++i) {
        //                 roads.push({ name: `Lane-${i + 1}`, isOpen: true })
        //             }
        //             adjuster.setData({ roads: roads, name: e.name, id: e.id })
        //             roadMark.bindPopup(adjuster.getNode())
        //         }
        //         roadMark.setOpacity(1)
        //     })
        //     this.roadPicker.begin()
        // }
        // doRouter() {
        //     this.roadPicker.off("*")
        //     let mBegin = L.marker([0, 0]), mEnd = L.marker([0, 0]), mPath = L.polyline([], { interactive: false })
        //     this.reTimeRouterLayerGroup.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)
        //     this.routerPicker.on("from", (e) => {
        //         mBegin.setLatLng(e.latlngs[0])
        //         mEnd.setLatLng([0, 0])
        //         mPath.setLatLngs([])
        //     })
        //     this.routerPicker.on("to", (e) => {
        //         mEnd.setLatLng(e.latlngs[1])
        //     })
        //     let chartTimeChangeHandler = (latlngs) => {
        //         API.getReTimeRouter(latlngs, this.getContext("currentTime")).done((d) => {
        //             this.layer("router").setData(d)
        //             this.layer("router").redraw(true)
        //             mPath.setLatLngs([])
        //             //
        //         })
        //     }
        //     this.routerPicker.on("drawend", (e) => {
        //         mPath.setLatLngs(e.latlngs)
        //         this.send("retime-router-done", { latlngs: e.latlngs })
        //         API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {
        //             this.layer("router").setData(d)
        //             this.layer("router").redraw(true)
        //             mPath.setLatLngs([])
        //             //
        //         })
        //         let latlngs = e.latlngs
        //         this.on("time-change", () => {
        //             API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {
        //                 this.layer("router").setData(d)
        //                 this.layer("router").redraw(true)
        //                 mPath.setLatLngs([])
        //                 //
        //             })
        //         })
        //         API.getSimulationRouterChartData(e.latlngs, this.getContext("currentTime")).done((d) => {
        //             let linechart = new VicroadLineChart({ style: { width: "30rem", height: "20rem" } })
        //             linechart.loadMeasures(d)
        //             mEnd.bindPopup(linechart.toElement())
        //             mEnd.openPopup()
        //         })
        //     })
        //     this.routerPicker.on("drawing", (e) => {
        //         mPath.setLatLngs(e.latlngs)
        //     })
        //     this.routerPicker.on("drawbegin", (e) => {
        //         this.send("retime-router-drawing", { latlngs: e.latlngs })
        //         this.off("time-change", () => {
        //             API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {
        //                 this.layer("router").setData(d)
        //                 this.layer("router").redraw()
        //                 mPath.setLatLngs([])
        //                 //
        //             })
        //         })
        //         this.layer("router").hide()
        //     })
        //     this.routerPicker.begin()
        //     this.roadPicker.off("*")
        // }
        // beginSelectAdjuster(){
        //     this.adjusterLayer.begin()
        //     this.routerLayer.end()
        //     this.roadLayer.end()
        // }
        // adjusterLayer:RoadAdjusterLayer
        // routerLayer:RouterLayer
        // roadLayer:SingleMarkLayer
        VicroadMap.prototype.initAll = function () {
            this.roadPicker.off("*");
            this.routerPicker.off("*");
            this.off("*");
            this.layer("Traffic Condition - After ReRoute").hide().removeFromControl();
            this.layer("Traffic Condition - Before ReRoute").hide().removeFromControl();
            this.vicroadlayers.clearLayers();
            this.layer("router").hide();
            this.addHooks();
            // this.showArea()
        };
        VicroadMap.prototype.initLayers = function () {
            var l = this.layer("Traffic Condition - Before ReRoute", {
                renderer: "canvas",
                url: APIConfig_2.API.getSimulationResultWithoutAdjusterURL(),
                selectable: false
            }).style("*").line({
                width: function (c) {
                    if (c("zoom")) {
                        return Math.floor(c("zoom") / 5);
                    }
                    else {
                        return 2;
                    }
                }, color: function (c) {
                    var k = c('SIM_DENSITY');
                    if (k < 18)
                        return "#84CA50"; //free
                    if (k >= 18 && k <= 42)
                        return "#F07D02";
                    if (k > 42 && k <= 115)
                        return "#E60000";
                    if (k > 115)
                        return "#9E1313";
                }
            });
            var l0 = this.layer("Traffic Condition - After ReRoute", {
                renderer: "canvas",
                url: APIConfig_2.API.getSimulationResultURL(),
                selectable: false
            }).style("*").line({
                width: function (c) {
                    if (c("zoom")) {
                        return Math.floor(c("zoom") / 5);
                    }
                    else {
                        return 2;
                    }
                }, color: function (c) {
                    var k = c('SIM_DENSITY');
                    if (k < 18)
                        return "#84CA50"; //free
                    if (k >= 18 && k <= 42)
                        return "#F07D02";
                    if (k > 42 && k <= 115)
                        return "#E60000";
                    if (k > 115)
                        return "#9E1313";
                }
            });
            this.layer("router", { renderer: "canvasOnMap" }).style("*").line({
                width: 3, color: "#2b82cb", marker: {
                    end: {
                        path: "M2,2 L2,11 L10,6 L2,2",
                        viewBox: [13, 13],
                        size: [5, 5]
                    }
                }
            });
            // this.on("simulation:calculation-done",this.showSimulationResult,this)
        };
        // showSimulationResult() {
        //     this.doSimulationRoadPick()
        //     let time = this.getContext("currentTime")
        //     if (time) {
        //         this.layer("simulationResult").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
        //         this.layer("simulationResultWithoutAdjuster").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
        //     }
        //     this.layer("simulationResult").show()
        //     this.layer("simulationResult").addToControl("baselayer")
        //     this.layer("simulationResultWithoutAdjuster").show()
        //     this.layer("simulationResultWithoutAdjuster").addToControl("baselayer")
        //     this.on("time-change", this.updateSimulationResult, this)
        // }
        VicroadMap.prototype.updateSimulationResult = function () {
            var time = this.getContext("currentTime");
            if (time) {
                this.layer("Traffic Condition - After ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") });
                this.layer("Traffic Condition - Before ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") });
            }
            this.layer("Traffic Condition - Before ReRoute").redraw();
            this.layer("Traffic Condition - After ReRoute").redraw();
        };
        VicroadMap.prototype.showArea = function () {
            if (!this.pickableArea) {
                // $.get("/service/apps/tcm/maps/tpi/query/area_search.json").done(
                //     (fc)=>{
                //         let f=new FeatureCollection(fc)
                //         let p=_.first(f.getPolygon())
                //         if(p){
                //             this.pickableArea=p.toLeafletPolygon()
                //             this.pickableArea.addTo(this.map.leaflet)
                //             this.map.leaflet.fitBounds(this.pickableArea.getBounds())
                //             this.initArea()
                //         }
                //     }
                // )
            }
        };
        VicroadMap.prototype.initArea = function () {
            var _this = this;
            if (!this.pickableArea) {
                APIConfig_2.API.getMainArea().done(function (d) {
                    if (d) {
                        _this.pickableArea = L.polygon(d.latlngs);
                        _this.pickableArea.addTo(_this.map.leaflet);
                        _this.map.leaflet.fitBounds(_this.pickableArea.getBounds());
                        _this.roadPicker.setInteractiveLayer(_this.pickableArea);
                        _this.routerPicker.setInteractiveLayer(_this.pickableArea);
                    }
                }).fail(function () {
                    alert("error ");
                });
                // this.doRoadPick()
            }
        };
        return VicroadMap;
    }(G2Map_2.G2Map));
    exports.VicroadMap = VicroadMap;
});
define("Jigsaw/Component/DropList/DropList", ["require", "exports", "Jigsaw/Core/View", "Jigsaw/Core/Model", "underscore"], function (require, exports, View_6, Model_1, _) {
    "use strict";
    exports.__esModule = true;
    var htmlLooper = function (ds, template) {
        _.templateSettings = {
            interpolate: /\{(.+?)\}/g
        };
        var tmpl = _.template(template);
        return _.map(ds, function (o) { return tmpl(o); }).join("");
    };
    var DropModel = (function (_super) {
        __extends(DropModel, _super);
        function DropModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DropModel.prototype.defaults = function () {
            return {
                curValue: "None",
                items: []
            };
        };
        return DropModel;
    }(Model_1.Model));
    var DropListView = (function (_super) {
        __extends(DropListView, _super);
        function DropListView(conf) {
            var _this = _super.call(this, { className: "droplist", tagName: "div" }) || this;
            _this.template = _.template("<div class=\"dropdown nav-dropdown fade in\">\n            <button class=\"btn btn-default\" >\n            <span class=\"value\"> <%= curValue%></span>\n                <i class=\"fa fa-caret-down\"></i>\n            </button>\n            <ul class=\"dropdown-menu \"  >\n                <% _.each(items,function(item){ %>\n                    <li><a href=\"#<%= item %>\" ><%= item %></a></li>\n                <% }) %>\n            </ul>\n        </div>");
            _this.model = new DropModel();
            _this.listenTo(_this.model, "change", _this.render);
            return _this;
        }
        DropListView.prototype.render = function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        };
        DropListView.prototype.events = function () {
            return {
                "click .btn": "onBtn",
                "click li": "onLi"
            };
        };
        DropListView.prototype.onBtn = function (e) {
            this.$(".dropdown-menu").toggleClass("dropdown-show");
        };
        DropListView.prototype.onLi = function (e) {
            console.log("li");
            this.model.set("curValue", $(e.target).text());
            this.$(".dropdown-menu").removeClass("dropdown-show");
        };
        DropListView.prototype.setItems = function (ds) {
            this.model.set("items", ds);
            if (!_.isEmpty(ds)) {
                this.model.set("curValue", ds[0]);
            }
        };
        return DropListView;
    }(View_6.View));
    exports.DropListView = DropListView;
});
define("Jigsaw/Component/Bar/NavBar", ["require", "exports", "Jigsaw/Core/Component", "Jigsaw/Core/View", "Jigsaw/Core/Model", "underscore", "Jigsaw/Utils/Util"], function (require, exports, Component_4, View_7, Model_2, _, Util_6) {
    "use strict";
    exports.__esModule = true;
    var TitleModel = (function (_super) {
        __extends(TitleModel, _super);
        function TitleModel(conf) {
            return _super.call(this, conf) || this;
        }
        return TitleModel;
    }(Model_2.Model));
    var TitleView = (function (_super) {
        __extends(TitleView, _super);
        function TitleView(conf) {
            var _this = _super.call(this, _.extend({ className: "title", style: {
                    position: "inherit",
                    left: null,
                    right: null,
                    bottom: null,
                    top: null
                } }, conf)) || this;
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
    }(View_7.View));
    var NavBar = (function (_super) {
        __extends(NavBar, _super);
        function NavBar(conf) {
            var _this = _super.call(this, Util_6.Util.deepExtend({
                style: {
                    display: "flex",
                    bottom: null,
                    height: "3rem"
                }
            }, conf)) || this;
            _this.title = new TitleView();
            _this.title.setTitle("Pudong Smart Traffic");
            _this.title.appendAt(_this.rootView.getNode$());
            return _this;
        }
        NavBar.prototype.initRootView = function (conf) {
            this.rootView = new View_7.View(_.extend({ tagName: "section" }, conf));
            this.rootView.addClass("navbar");
        };
        return NavBar;
    }(Component_4.Component));
    exports.NavBar = NavBar;
});
define("Apps/Vicroad/NavBar/VicroadNavBar", ["require", "exports", "Jigsaw/Component/DropList/DropList", "Jigsaw/Utils/Util", "Jigsaw/Component/Bar/NavBar"], function (require, exports, DropList_1, Util_7, NavBar_1) {
    "use strict";
    exports.__esModule = true;
    var VicroadNavBar = (function (_super) {
        __extends(VicroadNavBar, _super);
        function VicroadNavBar(conf) {
            var _this = _super.call(this, Util_7.Util.deepExtend({ style: {
                    bottom: null,
                    height: "3rem"
                } }, conf)) || this;
            _this.addClass("vicroadnavbar");
            _this.dropSelector = new DropList_1.DropListView();
            _this.title.setTitle("Intelligent Traffic Management - Simulation");
            _this.dropSelector.appendAt(_this.rootView.getNode$());
            return _this;
        }
        VicroadNavBar.prototype.initDropDown = function (c) {
            this.dropSelector.setDate(c);
        };
        return VicroadNavBar;
    }(NavBar_1.NavBar));
    exports.VicroadNavBar = VicroadNavBar;
});
define("Jigsaw/Component/Side/Side", ["require", "exports", "Jigsaw/Core/Component", "Jigsaw/Core/View", "Jigsaw/Utils/Util", "underscore"], function (require, exports, Component_5, View_8, Util_8, _) {
    "use strict";
    exports.__esModule = true;
    var SideView = (function (_super) {
        __extends(SideView, _super);
        function SideView(conf) {
            var _this = _super.call(this, conf) || this;
            _this.config = _.extend({ direction: "left" }, conf);
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
    }(View_8.View));
    var Side = (function (_super) {
        __extends(Side, _super);
        function Side(conf) {
            var _this = _super.call(this, conf) || this;
            _this.rootView.hidden();
            return _this;
        }
        Side.prototype.initRootView = function (conf) {
            this.rootView = new SideView(Util_8.Util.deepExtend({ tagName: "section", style: {
                    bottom: null,
                    right: null
                } }, conf));
            this.rootView.addClass("side");
        };
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
    }(Component_5.Component));
    exports.Side = Side;
});
define("Apps/Vicroad/Panal/ReTimePanal", ["require", "exports", "Jigsaw/Component/Side/Side", "Jigsaw/Core/View", "Jigsaw/Utils/Util", "timepicker"], function (require, exports, Side_1, View_9, Util_9) {
    "use strict";
    exports.__esModule = true;
    var ReTimePanal = (function (_super) {
        __extends(ReTimePanal, _super);
        function ReTimePanal(conf) {
            var _this = _super.call(this, Util_9.Util.deepExtend({ style: {
                    left: "0rem",
                    top: "3.05rem",
                    bottom: null,
                    right: null
                } }, conf)) || this;
            _this.rootView.render();
            _this.reTimeView = new ReTimeView;
            _this.reTimeView.appendAt(_this.getContentContainer());
            _this.reTimeView.on("retime-apply", function (d) {
                _this.send("retime-apply", d);
                _this.send("time-change", d);
            });
            return _this;
            // this.on("retime-router-drawing",()=>{
            //     this.reTimeView.setApplyButtonIsEnable(false)
            // })
            // this.on("retime-router-done",()=>{
            //     this.reTimeView.setApplyButtonIsEnable(true)
            // })
        }
        return ReTimePanal;
    }(Side_1.Side));
    exports.ReTimePanal = ReTimePanal;
    var ReTimeView = (function (_super) {
        __extends(ReTimeView, _super);
        function ReTimeView(conf) {
            return _super.call(this, Util_9.Util.deepExtend({ style: {
                    position: "initial"
                } }, conf)) || this;
        }
        ReTimeView.prototype.events = function () {
            return {
                "change .datetimeinput": "onTimeChange",
                "click  .applybtn": "onApply"
            };
        };
        ReTimeView.prototype.onApply = function () {
            this.trigger("retime-apply", { dateTime: new Date(this.$(".datetimeinput").val()), duration: this.$(".durationinput").val() });
            this.$(".applybtn").addClass("btn-disable");
        };
        ReTimeView.prototype.setApplyButtonIsEnable = function (isable) {
            if (isable) {
                this.$('.applybtn').removeClass('btn-disable');
            }
            else {
                this.$('.applybtn').addClass('btn-disable');
            }
        };
        ReTimeView.prototype.onTimeChange = function () {
            var oldValue, currentValue;
            currentValue = this.$(".datetimeinput").val();
            if (oldValue == currentValue) {
                return;
            }
            else {
                this.trigger("retime-timepicker-change", { dateTime: currentValue });
                oldValue = currentValue;
            }
        };
        ReTimeView.prototype.render = function () {
            this.$el.html("<section>\n                <label>Departure Time:</label>\n                <input type=\"datetime\" readonly=\"readonly\" placeholder=\"Date Time\" class='datetimeinput notreadonly'>\n                <label>Simulation Duration:</label>\n                        <input type=\"number\" placeholder=\"Number of hours\" value=1 readonly=\"readonly\" class=\"durationinput\"><span>Hour</span>  \n                    </section>\n                <section class=\"applypanal\">\n                    <button class=\"btn btn-default  applybtn\">Apply</button>\n                </section>");
            return this;
        };
        ReTimeView.prototype.onAfterRender = function () {
            var datepicker = $(this.el).find('.datetimeinput').datepicker({
                timepicker: true,
                timeFormat: "hh:ii",
                onSelect: function (formattedDate, date, inst) {
                    $(inst.el).trigger('change');
                    console.log(arguments);
                    var newDate = new Date(date.toUTCString());
                    newDate.setMinutes(Math.floor(date.getMinutes() / 15) * 15);
                    if (newDate.toTimeString() != date.toTimeString()) {
                        inst.selectDate(newDate);
                    }
                },
                language: 'en'
            }).data('datepicker');
            setTimeout(function () {
                datepicker.selectDate(new Date());
            }, 0);
        };
        return ReTimeView;
    }(View_9.View));
});
define("Apps/Vicroad/Panal/SimulatorPanal", ["require", "exports", "Jigsaw/Component/Side/Side", "Jigsaw/Core/Model", "Jigsaw/Core/View", "Apps/Vicroad/APIConfig", "underscore", "Jigsaw/Utils/Util", "timepicker"], function (require, exports, Side_2, Model_3, View_10, APIConfig_3, _, Util_10) {
    "use strict";
    exports.__esModule = true;
    var SimulatorPanal = (function (_super) {
        __extends(SimulatorPanal, _super);
        function SimulatorPanal(conf) {
            var _this = _super.call(this, Util_10.Util.deepExtend({ style: {
                    left: "0rem",
                    top: "3.05rem",
                    bottom: null,
                    right: null
                } }, conf)) || this;
            _this.duration = 1;
            _this.rootView.render();
            _this.simulatorView = new SimulatorView();
            _this.simulatorView.appendAt(_this.getContentContainer());
            _this.roads = [];
            _this.initSimulatorView();
            _this.applyButtonInit();
            _this.simulatorView.on("simulator-apply", _this.beginSimulator, _this);
            return _this;
        }
        SimulatorPanal.prototype.addRoads = function (road) {
            var i = _.findIndex(this.roads, { id: road.id });
            if (i == -1) {
                this.roads.push(road);
            }
            else {
                this.roads[i] = road;
            }
        };
        SimulatorPanal.prototype.applyButtonInit = function () {
            var _this = this;
            var duration, road, from, to;
            var isButtonEnable = function () {
                if (_this.dateTime != undefined && !_.isEmpty(_this.roads)) {
                    _this.simulatorView.setApplyButtonIsEnable(true);
                }
                else {
                    _this.simulatorView.setApplyButtonIsEnable(false);
                }
            };
            this.on("simulate-timepicker-change", function (e) {
                _this.dateTime = new Date(e.dateTime);
                isButtonEnable();
            });
            this.on("simulate-duration-change", function (e) {
                _this.duration = e.duration;
                isButtonEnable();
            });
            this.on("simulate-road-change", function (e) {
                _this.addRoads(e);
                // this.simulatorView.setAdjusterActive(false) 
                isButtonEnable();
            });
            this.on("simulation:calculation-done", function () {
                _this.simulatorView.setRouterEnable(true);
            });
        };
        SimulatorPanal.prototype.beginSimulator = function () {
            var _this = this;
            //    var postDate={
            //        controls:,
            //        from:this.dateTime.toUTCString()
            //    }
            var controls = _.map(this.roads, function (r) {
                return { id: r.id, kj: r.capacity, f: r.capacity, duration: "360m" };
            });
            var enableEventBus = function () {
                var self = _this;
                var eb = new EventBus('/eventbus');
                eb.onopen = function () {
                    console.log('open');
                    eb.registerHandler("client.CTMProgress", function (err, msg) {
                        console.log('received  ' + msg.body);
                        self.send("simulation:calculation-progress", { value: msg.body });
                    });
                    eb.registerHandler("client.CTMComplete", function () {
                        console.log("Calculation done");
                        self.send("simulation:calculation-done");
                        eb.onclose = function (e) { };
                        eb.close();
                    });
                };
                eb.onclose = function (e) {
                    console.log('reconnecting');
                    setTimeout(enableEventBus, 1000); // Give the server some time to come back
                };
            };
            APIConfig_3.API.beginSimulation(controls, this.dateTime).done(function () {
                _this.send("simulation:begin-calculation", { dateTime: _this.dateTime, duration: _this.duration });
                enableEventBus();
            });
        };
        SimulatorPanal.prototype.initSimulatorView = function () {
            this.proxyEvents(this.simulatorView, "adjuster-btn-off", "adjuster-btn-on", "simulate-router-btn-off", "simulate-router-btn-on", "simulate-timepicker-change", "simulate-duration-change");
        };
        return SimulatorPanal;
    }(Side_2.Side));
    exports.SimulatorPanal = SimulatorPanal;
    var SimulatorView = (function (_super) {
        __extends(SimulatorView, _super);
        function SimulatorView(conf) {
            return _super.call(this, Util_10.Util.deepExtend({ style: {
                    position: "initial"
                } }, conf)) || this;
        }
        SimulatorView.prototype.events = function () {
            return {
                "click .adjuster-btn": "onAdjuster",
                "click .router-btn": "onRouter",
                "change .datetimeinput": "onSimulateTimeChange",
                "change .durationinput": "onDurationTimeChange",
                "click  .applybtn": "onApply"
            };
        };
        SimulatorView.prototype.setApplyButtonIsEnable = function (isable) {
            if (isable) {
                this.$('.applybtn').removeClass('btn-disable');
            }
            else {
                this.$('.applybtn').addClass('btn-disable');
            }
        };
        SimulatorView.prototype.onApply = function () {
            this.trigger("simulator-apply", { dateTime: new Date(this.$(".datetimeinput").val()), duration: this.$(".durationinput").val() });
            this.setAdjusterEnable(false);
            this.setApplyButtonIsEnable(false);
        };
        SimulatorView.prototype.onAdjuster = function (e) {
            if ($(e.currentTarget).hasClass("btn-active")) {
                this.trigger("adjuster-btn-off");
                $(e.currentTarget).removeClass("btn-active");
            }
            else {
                $(".operation").removeClass("btn-active");
                $(e.currentTarget).addClass("btn-active");
                this.trigger("adjuster-btn-on");
            }
        };
        SimulatorView.prototype.setAdjusterActive = function (b) {
            if (b) {
                $(".operation").removeClass("btn-active");
                this.$(".adjuster-btn").addClass("btn-active");
                this.trigger("adjuster-btn-on");
            }
            else {
                this.trigger("adjuster-btn-off");
                this.$(".adjuster-btn").removeClass("btn-active");
            }
        };
        SimulatorView.prototype.setAdjusterEnable = function (b) {
            if (b) {
                this.$('.adjuster-btn').removeClass('btn-disable');
            }
            else {
                this.$('.adjuster-btn').addClass('btn-disable');
            }
        };
        SimulatorView.prototype.setRouterEnable = function (isable) {
            if (isable) {
                this.$('.router-btn').removeClass('btn-disable');
            }
            else {
                this.$('.applybtn').addClass('btn-disable');
            }
        };
        SimulatorView.prototype.onRouter = function (e) {
            if ($(e.currentTarget).hasClass("btn-active")) {
                this.trigger("simulate-router-btn-off");
                $(e.currentTarget).removeClass("btn-active");
            }
            else {
                $(".operation").removeClass("btn-active");
                $(e.currentTarget).addClass("btn-active");
                this.trigger("simulate-router-btn-on");
            }
        };
        SimulatorView.prototype.onSimulateTimeChange = function () {
            var oldValue, currentValue;
            currentValue = this.$(".datetimeinput").val();
            if (oldValue == currentValue) {
                return;
            }
            else {
                this.trigger("simulate-timepicker-change", { dateTime: currentValue });
                oldValue = currentValue;
            }
        };
        SimulatorView.prototype.onDurationTimeChange = function () {
            var oldValue, currentValue;
            currentValue = this.$(".durationinput").val();
            if (oldValue == currentValue) {
                return;
            }
            else {
                this.trigger("simulate-duration-change", { duration: currentValue });
                oldValue = currentValue;
            }
        };
        SimulatorView.prototype.render = function () {
            this.$el.html("<section>\n            <label>Simulation DateTime:</label>\n            <input type=\"datetime\" readonly=\"readonly\" placeholder=\"Date Time\" class='datetimeinput notreadonly'>\n            <label>Simulation Duration:</label>\n            <input type=\"number\" placeholder=\"Number of hours\" value=1 readonly=\"readonly\" class=\"durationinput\"><span>Hour</span>  \n        </section>\n        <section>\n            <button class=\"btn btn-default operation adjuster-btn fa fa-times\"></button>\n            <button class=\"btn btn-default operation btn-disable router-btn  fa fa-car\"></button>\n        </section>\n        <section class=\"applypanal\">\n            <button class=\"btn btn-default btn-disable applybtn\">Apply</button>\n        </section>");
            return this;
        };
        SimulatorView.prototype.onAfterRender = function () {
            var datepicker = $(this.el).find('.datetimeinput').datepicker({
                timepicker: true,
                timeFormat: "hh:ii",
                onSelect: function (formattedDate, date, inst) {
                    $(inst.el).trigger('change');
                    var newDate = new Date(date.toUTCString());
                    newDate.setMinutes(Math.floor(date.getMinutes() / 15) * 15);
                    if (newDate.toTimeString() != date.toTimeString()) {
                        inst.selectDate(newDate);
                    }
                },
                language: 'en'
            }).data('datepicker');
            setTimeout(function () {
                datepicker.selectDate(new Date());
            }, 0);
        };
        return SimulatorView;
    }(View_10.View));
    var SimulatorModel = (function (_super) {
        __extends(SimulatorModel, _super);
        function SimulatorModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SimulatorModel;
    }(Model_3.Model));
});
define("Jigsaw/Component/Loader/ILoader", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("Jigsaw/Component/Loader/CircleLoader", ["require", "exports", "Jigsaw/Utils/Util"], function (require, exports, Util_11) {
    "use strict";
    exports.__esModule = true;
    var CircleLoader = (function () {
        function CircleLoader(width, height, strokeWidth) {
            this.id = "loader";
            this.width = Util_11.Util.toPixel(width);
            this.height = Util_11.Util.toPixel(height);
            this.strokeWidth = Util_11.Util.toPixel(strokeWidth);
        }
        CircleLoader.prototype.setWidth = function (width) {
            this.width = Util_11.Util.toPixel(width);
            return this;
        };
        CircleLoader.prototype.setHeight = function (height) {
            this.height = Util_11.Util.toPixel(height);
            return this;
        };
        CircleLoader.prototype.setStrokeWidth = function (strokeWidth) {
            this.height = Util_11.Util.toPixel(strokeWidth);
            return this;
        };
        CircleLoader.prototype.makeSVG = function (tag, attributes) {
            var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
            for (var attribute in attributes) {
                var name_1 = attribute;
                var value = attributes[attribute];
                elem.setAttribute(name_1, value);
            }
            return elem;
        };
        CircleLoader.prototype.addTo = function (el) {
            this.el.style.transform = "translate(-100%,0)";
            this.oldRatio = 0;
            this.interval = 1000;
            el.appendChild(this.el);
            return this;
        };
        CircleLoader.prototype.toElement = function () {
            this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            this.el.setAttribute("id", this.id);
            this.el.setAttribute("class", "porgressLoaderContainer");
            var centerX = this.width / 2, centerY = this.width / 2, radius1 = this.width / 2 - this.strokeWidth, radius2 = radius1 - this.strokeWidth * 3;
            var svgNode = this.makeSVG("svg", { width: this.width, height: this.height });
            var group = this.makeSVG("g", {});
            var circle1 = this.makeSVG("circle", { cx: centerX, cy: centerY, r: radius1 });
            group.appendChild(circle1);
            var path1 = this.makeSVG("path", { "class": "path1", d: "M" + centerX + " " + this.strokeWidth + " " + "A" + radius1 + " " + radius1 + " 0 0 1 " + centerX + " " + (centerY + radius1) });
            var animateTransform1 = this.makeSVG("animateTransform", { attributeName: "transform", type: "rotate", from: "0" + " " + centerX + " " + centerY, to: "360" + " " + centerX + " " + centerY, dur: "2s", repeatCount: "indefinite" });
            path1.appendChild(animateTransform1);
            group.appendChild(path1);
            var circle2 = this.makeSVG("circle", { cx: centerX, cy: centerY, r: radius2 });
            group.appendChild(circle2);
            var path2 = this.makeSVG("path", { "class": "path2", d: "M" + centerX + " " + (centerY + radius2) + " " + "A" + radius2 + " " + radius2 + " 0 0 1 " + centerX + " " + (centerY - radius2) });
            var animateTransform2 = this.makeSVG("animateTransform", { attributeName: "transform", type: "rotate", from: "360" + " " + centerX + " " + centerY, to: "0" + " " + centerX + " " + centerY, dur: "2s", repeatCount: "indefinite" });
            path2.appendChild(animateTransform2);
            group.appendChild(path2);
            var ratio = this.makeSVG("text", { transform: "translate(" + centerX + "," + centerY + ")", "class": "loaderRatio" });
            ratio.textContent = "0%";
            group.appendChild(ratio);
            var text = this.makeSVG("text", { transform: "translate(" + centerX + "," + ((this.height + this.width) / 2) + ")", "class": "loaderText" });
            var str = "Calculating...";
            for (var i = 0; i < str.length; i++) {
                var tspan = this.makeSVG("tspan", {});
                tspan.textContent = str.charAt(i);
                var animateSize = void 0, animateColor = void 0;
                if (i == 0) {
                    animateSize = this.makeSVG("animate", { id: "ani" + i, attributeName: "font-size", values: "20;24;20", begin: "0s;ani13.end", dur: "0.5s" });
                    animateColor = this.makeSVG("animate", { attributeName: "fill", from: "yellow", to: "aqua", begin: "0s;ani" + str.length + ".end", dur: "0.5s", fill: "freeze" });
                }
                else {
                    animateSize = this.makeSVG("animate", { id: "ani" + i, attributeName: "font-size", values: "20;24;20", begin: ("ani" + (i - 1) + ".end"), dur: "0.5s" });
                    animateColor = this.makeSVG("animate", { attributeName: "fill", from: "yellow", to: "aqua", begin: ("ani" + (i - 1) + ".end"), dur: "0.5s", fill: "freeze" });
                }
                tspan.appendChild(animateSize);
                tspan.appendChild(animateColor);
                text.appendChild(tspan);
            }
            group.appendChild(text);
            svgNode.appendChild(group);
            this.el.appendChild(svgNode);
            return this.el;
        };
        CircleLoader.prototype.show = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.el.style.transform = "translate(0,0)";
            });
            return this;
        };
        CircleLoader.prototype.setProgress = function (ratio) {
            var _this = this;
            var temp = this.oldRatio;
            if (this.intervalIndex) {
                clearInterval(this.intervalIndex);
                this.intervalIndex = 0;
            }
            this.intervalIndex = setInterval(function () {
                if (_this.oldRatio < ratio) {
                    document.getElementsByClassName("loaderRatio")[0].textContent = _this.oldRatio + 1 + "%";
                    _this.oldRatio += 1;
                }
                else {
                    if (ratio == 100) {
                        clearInterval(_this.intervalIndex);
                        _this.intervalIndex = 0;
                    }
                    else
                        return _this;
                }
            }, 50);
            this.interval = (ratio - temp) * 50;
            return this;
        };
        CircleLoader.prototype.remove = function () {
            var _this = this;
            this.el.style.transform = "translate(-100%,0)";
            setTimeout(function () {
                _this.el.remove();
            }, 1000);
            return this;
        };
        return CircleLoader;
    }());
    exports.CircleLoader = CircleLoader;
});
define("Apps/Vicroad/App", ["require", "exports", "Jigsaw/Core/App", "Apps/Vicroad/Chart/TimeSlider", "Apps/Vicroad/Map/VicroadMap", "Apps/Vicroad/NavBar/VicroadNavBar", "Apps/Vicroad/Panal/ReTimePanal", "Apps/Vicroad/Panal/SimulatorPanal", "Jigsaw/Component/Loader/CircleLoader", "moment"], function (require, exports, App_1, TimeSlider_1, VicroadMap_1, VicroadNavBar_1, ReTimePanal_1, SimulatorPanal_1, CircleLoader_1, moment) {
    "use strict";
    exports.__esModule = true;
    var MainApp = (function (_super) {
        __extends(MainApp, _super);
        function MainApp(conf) {
            var _this = _super.call(this, conf) || this;
            _this.initApp();
            return _this;
        }
        MainApp.prototype.initApp = function () {
            var _this = this;
            this.addRule("*path", "router", this.proxy("reRoute"));
            this.addRule("ReRoute", "router", this.proxy("reRoute"));
            //this.addRule("Adjuster","adjuster",this.proxy("Adjuster"))
            this.addRule("ReTime", "retime", this.proxy("reTime"));
            ///add bar
            this.bar = new VicroadNavBar_1.VicroadNavBar();
            this.bar.initDropDown({ curValue: "ReRoute", items: ["ReTime", "ReRoute"] });
            this.bar.addTo(this);
            ///add map
            this.mapComponent = new VicroadMap_1.VicroadMap({ style: {
                    top: "3rem"
                } });
            this.mapComponent.addTo(this);
            requestAnimationFrame(function () {
                doInitMap(_this.mapComponent);
            });
            ///add timeslider
            this.timeSlider = new TimeSlider_1.TimeSlider();
            this.timeSlider.setStyle({
                top: null,
                bottom: "1rem",
                height: "5.2rem",
                left: "calc(50% - 15rem)"
            });
            this.timeSlider.addTo(this);
            ///add progressbar
            this.progressBar = new CircleLoader_1.CircleLoader(200, 300, 5);
            this.progressBar.toElement();
            this.on("time-change", function (d) {
                _this.setContext("currentTime", moment(d.dateTime).seconds(0).milliseconds(0).toDate());
            });
            this.on("simulation:begin-calculation", function (d) {
                _this.setContext("beginTime", moment(d.dateTime).add(15, "m").seconds(0).milliseconds(0).toDate());
                _this.setContext("duration", d.duration);
                _this.send("beginTimeChange", { dateTime: _this.getContext("beginTime"), duration: d.duration });
            });
            this.on("retime-apply", function (d) {
                _this.setContext("beginTime", moment(d.dateTime).seconds(0).milliseconds(0).toDate());
                _this.setContext("duration", d.duration);
                _this.send("beginTimeChange", { dateTime: _this.getContext("beginTime"), duration: d.duration });
            });
            this.initReRouter();
            this.initReTime();
        };
        MainApp.prototype.initReRouter = function () {
            this.on("simulation:begin-calculation", this.showProgressBar, this);
            this.on("simulation:calculation-done", this.hiddenProgressBar, this);
        };
        MainApp.prototype.initReTime = function () {
        };
        // rightSide:Side
        MainApp.prototype.reTime = function () {
            this.router.navigate("ReTime/", { trigger: false, replace: true });
            this.resetAll();
            this.reTimePanal = new ReTimePanal_1.ReTimePanal;
            this.reTimePanal.addTo(this);
            this.reTimePanal.show();
            this.mapComponent.doReTime();
            // this.on("reTime:reRouter",()=>{
            //     this.timeSlider.reset()
            // })
            //this.send("begin-retime")
        };
        MainApp.prototype.reRoute = function () {
            this.router.navigate("ReRoute/", { trigger: false, replace: true });
            this.resetAll();
            this.simulatorPanal = new SimulatorPanal_1.SimulatorPanal();
            this.simulatorPanal.addTo(this);
            this.simulatorPanal.show();
            this.mapComponent.doReRouter();
            // this.on("reRouter:rePickRoad reRouter:reRoute",()=>{
            //     this.timeSlider.reset()
            // })
        };
        MainApp.prototype.resetAll = function () {
            this.mapComponent.initAll();
            this.timeSlider.hidden();
            if (this.simulatorPanal) {
                this.simulatorPanal.remove();
                this.simulatorPanal = null;
            }
            if (this.reTimePanal) {
                this.reTimePanal.remove();
                this.reTimePanal = null;
            }
        };
        MainApp.prototype.showProgressBar = function () {
            if (this.progressBar) {
                var progressBar_1 = this.progressBar;
                progressBar_1.addTo(this.rootView.getNode());
                progressBar_1.show();
                this.on("simulation:calculation-progress", function (d) { progressBar_1.setProgress(d.value); }, this);
            }
        };
        MainApp.prototype.hiddenProgressBar = function () {
            if (this.progressBar) {
                this.progressBar.remove();
            }
        };
        return MainApp;
    }(App_1.App));
    exports.MainApp = MainApp;
    function doInitMap(map) {
        map.setMapSetting({ center: { "lat": -37, "lng": 145 }, zoom: 8 });
        map.layer("base", { renderer: "png", url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            visible: true });
    }
});
