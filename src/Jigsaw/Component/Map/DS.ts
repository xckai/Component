import {W2} from "../../Data/DataDefine"
import _= require("underscore")
function _evaluate(v, args?, std?) {
        if (_.isFunction(v)) {
            var v2 = v.apply(null, args);
            if ((typeof v2 === "undefined" || v2 === null) && typeof std !== "undefined") {
                return std;
            } else {
                return v2;
            }
        } else {
            if ((typeof v === "undefined" || v === null) && typeof std !== "undefined") {
                return std;
            } else {
                return v;
            }
        }
    };
function sinh(v) {
        var ev = Math.pow(Math.E, v);
        return (ev - 1 / ev) * 0.5;
    };
export namespace W{
    export function unionPropertyOf(...args){
        return (k)=>{
             var v = _.find(args, function (a) {
                    return _.has(a, k);
                });
                if (v) {
                    return v[k];
                } else {
                    return undefined;
                }
        }
    }
    export function toDegrees(v:number){
        return v*180/Math.PI
    }   
    export function toRadians(v:number){
        return v*Math.PI/180
    }
    export class GlobalMercator{
       constructor (tileSize) {
            this.tileSize = tileSize;
            this.initialResolution = 2 * Math.PI * 6378137 / this.tileSize;
            this.scale = 20037508.34; //Math.PI * 6378137
        }
        tileSize:number
        initialResolution:number
        scale:number
        x2lon(x){
            return x/this.scale*180
        }
        y2lat(y){
            let _y=y/this.scale*180
        }
        lon2x(lon) {
            return lon * this.scale / 180.0;
        }
        lat2y (lat) {
            return (Math.log(Math.tan((90.0 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0)) * this.scale / 180.0;
        }
        tile2LonLat(p,z){
            var rt = [];
            for (var i = 0; i + 1 < p.length; i = i + 2) {
                var mx = p[i] / Math.pow(2.0, z) * 360.0 - 180;
                var n = Math.PI - (2.0 * Math.PI * p[i + 1]) / Math.pow(2.0, z);
                var my = toDegrees(Math.atan(sinh(n)));
                rt.push(mx);
                rt.push(my);
            }
            return rt;
        }
        tileBounds(x,y,zoom){
            var min = this.tile2LonLat([x, y + 1], zoom);
            var max = this.tile2LonLat([x + 1, y], zoom);
            return [min[0], min[1], max[0], max[1]];
        }
        lonLat2Pixel(p,extent,zoom){
            var res = this.resolution(zoom);
            var rt = [];
            for (var i = 0; i + 1 < p.length; i = i + 2) {
                var mx = (this.lon2x(p[i]) - this.lon2x(extent[0])) / res;
                var my = (this.lat2y(extent[3]) - this.lat2y(p[i + 1])) / res;

                rt.push(mx);
                rt.push(my);
            }
            return rt;
        }
         /*
         * "Resolution (meters/pixel) for given zoom level (measured at Equator)"
         */
        resolution(zoom) {
            // return (2 * Math.PI * 6378137) / (self.tileSize * 2**zoom)
            return this.initialResolution / Math.pow(2.0, zoom);
        }
        

    }
    export function mercator(tileSize) {
        return new GlobalMercator(tileSize);
    }
    export function splitByTags (gs:W2.feature[]) {
        return _.reduce(gs, function (memo, item:W2.feature) {
            if (memo.length === 0 || _.last(memo).tag !== item._t) {
                    memo.push({
                        tag: item._t,
                        items: [item]
                    });
                } else {
                    _.last(memo).items.push(item);
                }
                return memo;
        }, []);
    }
    export class Wrapper<T,T1>{
        constructor(obj:T,...args){
            this.obj=obj
            this.args=args
        }
        obj:T
        args:any
        defalut:T1
        setDefalut(defalut:T1){
            this.defalut=defalut
            return this
        }
        values():T1{
            let r=_.mapObject(this.obj,(v,ix)=>{
                return _evaluate(v,this.args,this.defalut[ix])
            })
            return _.defaults(r,this.defalut)   
        }
        value(k:string,defalutVale?){
            return _evaluate(this.obj[k],this.args,defalutVale||this.defalut[k])
        }
    }
    export function values<T>(obj:T,...args){
        return <T1>(defaults:T1):T1=>{
                    var r = _.mapObject(obj, function (v, ix) {
                         return _evaluate(v, args, defaults[ix]);
                    });
                    return _.defaults(r, defaults);
            }
        }   
    export function valueOf(obj,cxts,...res){
        let args = (cxts) ? _.chain(arguments)
                .rest(1).value() : cxts;
        return (k,std?)=>{
               if (_.isString(k)) { // single mode
                    return _evaluate(obj[k], args, std);
                } else { // whole object mode
                    var defaults = k;
                    var r = _.mapObject(obj, function (v, ix) {
                        if (defaults) {
                            return _evaluate(v, args, defaults[ix]);
                        } else {
                            return _evaluate(v, args);
                        }
                    });
                    return _.defaults(r, defaults);
                }
            }
        }
    export function tile2bounds (x, y, z) {
            return new GlobalMercator(256).tileBounds(x, y, z);
    }
    export function buildUrl(url,cxt?){
         var _urls = url.split("?");
            let _url = _urls[0];
            let rs = _.chain(_url)
                .reduce(function (memo, a) {
                    if (a === "/" || a === ".") {
                        memo.push(a);
                        memo.push("");
                    } else {
                        memo[memo.length - 1] += a;
                    }
                    return memo;
                }, [""]).value()

            let r=_.chain(rs).map(function (s) {
                    if (s.charAt(0) === ":") {
                        var v = _evaluate(cxt[s.substring(1)]);
                        return encodeURIComponent(v);
                    } else {
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
                            } else {
                                memo += encodeURIComponent(v);
                            }
                        } else {
                            memo += nv[1];
                        }
                        return memo;
                    }, r + "?").value();
            }

            if (_.last(r) === '/') {
                return r.substring(0, r.length - 1);
            } else {
                return r;
            }
    }
    export function doGet(url,ctx?){
        return $.get(buildUrl(url,ctx))
    }
    
    export function toGeometries (vs, extent, zoom) {
            vs.features = _.map(vs.features, function (g) {
                return _.mapObject(g, function(v, k) {
                    if(!v.t && v.t !== 0) {
                        return v;
                    }

                    v.p = _.map(v.p, function(p) {
                    p = toPath(p, vs.decimals);
                        //if(v.t === 0)
                        //    return [p];
                        //else
                            return p;
                    });
                    if (vs.srid !== "canvas" && extent && zoom) {
                        var mercator = W.mercator(256);
                        v.p = _.map(v.p, function (path:any[]) {
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
    export function toPath(vs, decimals) {
            var prevX = 0,
                prevY = 0,
                values = [];
            var factor = (decimals < 0) ? 0 : Math.pow(10, decimals);
            var i = 0;

            for (i = 0; i < vs.length; i = i + 2) {
                if (factor > 0) {

                    prevX = vs[i] / factor + prevX;
                    prevY = vs[i + 1] / factor + prevY;
                } else {
                    prevX = vs[i];
                    prevY = vs[i + 1];
                }

                values.push([prevX, prevY]);
            }
            return values;
        }
       export function offsetting(a,b,offset,memo){
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

            var offx = 0,
                offy = 0;
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
            } else {
                return [rt[0], rt[1], rt[2]];
            }
    }
    export function intersection(x0,y0,x1,y1,x2,y2,x3,y3){
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
    export function angle2X(a,b){
            let angle = 0;
            angle = Math.atan2((b[1] - a[1]), (b[0] - a[0])) * 180 / Math.PI;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
    }
    export function centroid(vs){
            let pt = _.reduce(vs, function (memo, a:any) {
                if (_.isEmpty(memo)) {
                    return a;
                } else {
                    return [memo[0] + a[0], memo[1] + a[1]];
                }
            }, []);
            return [pt[0] / vs.length, pt[1] / vs.length];
    }
    export function middle(vs){
            var total = 0;
            var path = _.reduce(vs, function (memo, v) {
                var d;
                if (_.isEmpty(memo)) {
                    memo.push({
                        loc: v,
                        distance: 0
                    });
                } else {
                    d =distance(_.last(memo).loc, v);
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
                } else {
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
    export function distance (p0,p1){
            var dx = p1[0] - p0[0];
            var dy = p1[1] - p0[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
}
