import { W2 } from '../../Data/DataDefine';
import { Style } from './G2Map';
import _ = require('underscore');
import { W } from './DS';
interface IBrush{

}
export interface IStyleResult{
    [k:string]:any
}
interface IBrushMovement{
    close:()=>void
    begin:()=>void
    moveTo:(x:number,y:number)=>void
    lineTo:(x:number,y:number)=>void
}
export namespace Painter{
    export function buildPath(path,closed,offset,inners,movement:IBrushMovement){
        if(!path ||path.lenth<2){
            return path
        }else{
            movement.begin()

        }
    }
    export function buildRect(p,s,d,alignment,valign){
            let placeX = p[0] + d[0]
            let placeY = p[1] + d[1]

            let lastX = placeX
            let lastY = placeY
            if (alignment === "center") {
                lastX = placeX - s[0] / 2;
            } else if (alignment === "right") {
                lastX = placeX - s[0];
            }

            if (valign === "middle") {
                lastY = placeY - s[1] / 2;
            } else if (valign === "bottom") {
                lastY = placeY - s[1];
            }
            return [lastX, lastY, s[0], s[1]]
    }
    export function move(path,offset,movement:IBrushMovement){
        let r=[]
        _.reduce(path,(memo,element,ix,list)=>{
            let pos
             if (ix + 1 < list.length) {
                memo = W.offsetting(element, list[ix + 1], offset, memo);
                pos = memo[0];
            } else {
                pos = memo[1];
            }
            if (ix === 0) {
                r.push([pos[0], pos[1]]);
                movement.moveTo(pos[0], pos[1]);
            } else {
                r.push([pos[0], pos[1]]);
                movement.lineTo(pos[0], pos[1]);
            }
            return memo;
        },[])
    }
   
}
export class CanvasBrush
{
    constructor(ctx){
        this._ctx=ctx
        this.pathMovement={
            close(){
                this._ctx.closePath()
            },
            begin(){
                this._ctx.beginPath()
            },
            moveTo(x,y){
                this._ctx.moveTo(x,y)
            },
            lineTo(x,y){
                this._ctx.lineTo(x,y)
            }
        }
    }
    pathMovement:IBrushMovement
    _ctx:CanvasRenderingContext2D
    transform(x,y,scale?,rotation?){
        this._ctx.translate(x,y)
        if(rotation){
            this._ctx.rotate(rotation)
        }
        if(scale){
            this._ctx.scale(scale,scale)
        }
        this._ctx.translate(-x,-y)
    }
    polygon(f:W2.feature,style:W.Wrapper<Style,IStyleResult>){
        let s=style.setDefalut({
            offset:0,
            geometry:f.g
        }).values()
        this._ctx.fillStyle=s.fill
        if(Painter.buildPath(s.geometry.p[0],true,s.offset,_.rest(s.geometry.p),this.pathMovement)){
            this._ctx.fill()
        }
        
    }
    line(f:W2.feature,style:W.Wrapper<Style,IStyleResult>){
        let s=style.setDefalut({
            width:0,offset:0,geometry:f.g
        }).values()
        if(s.width==0){
            return 
        }else{
            this._ctx.strokeStyle=s.color
            this._ctx.lineWidth=s.width
            if(_.isArray(s.dasharray)){
                this._ctx.setLineDash(s.dasharray)
            }else{
                this._ctx.setLineDash([])
            }
            let np=Painter.buildPath(s.geometry.p[0],false,s.offset,_.rest(s.geometry.p),this.pathMovement)
            if(!np){
                return
            }else{
                this._ctx.stroke()
                if(s.marker){
                    _.each(s.marker,(m,k)=>{
                        
                    })
                }
            }
        }

    }
    marker(f:W2.feature,style:W.Wrapper<Style,IStyleResult>,np,ix){
        let s=style.setDefalut({
                width: 0,
                height: 0,
                dx: 0,
                dy: 0,
                placement: "point",
                alignment: "center",
                verticalAlignment: "middle",
                rotate: 0,
                geometry: f.g
        }).values()
        if(s.borderColor){
              this._ctx.lineWidth = s.borderWidth;
            if (_.isArray(s.dasharray)) {
                this._ctx.setLineDash(s.dasharray);
            } else {
                this._ctx.setLineDash([]);
            }
            this._ctx.save();
            var p2d = this.place(f, s, np, ix);
            if (_.isObject(p2d)) {
                this._ctx.stroke(p2d);
            } else {
                this._ctx.stroke();
            }
            this._ctx.restore();
        }
        if (s.fill) {
            this._ctx.fillStyle = s.fill;
            this._ctx.save();
            var p2d = this.place(f, s, np, ix);
            if (_.isObject(p2d)) {
                // this._ctx.fill(p2d);
                this._ctx.fill();
            } else {
                this._ctx.fill();
            }
            this._ctx.restore();
        }
    }
    place(f:W2.feature,s:IStyleResult,np,ix){
         var pt, pt2, rt, rotate;
        var path = np || s.geometry.p[0];
        if(!path)
            return;
        var p;
        if (s.placement === "point") {
            pt = _.first(path);
        } else if (s.placement === "end") {
            p = _.last(path, 2);
            pt = p[1];
            pt2 = p[0];
            rotate = (W.angle2X(pt2, pt)) * Math.PI / 180;
            rt = W.offsetting(pt2, pt, 0, []);
            pt2 = rt[0];
            pt = rt[1];
        } else if (s.placement === "start") {
            p = _.first(path, 2);
            pt = p[0];
            pt2 = p[1];
            rotate = W.angle2X(pt, pt2) * Math.PI / 180;
            rt = W.offsetting(pt, pt2, 0, []);
            pt = rt[0];
            pt2 = rt[1];
        } else if (s.placement === "interior") {
            pt = W.centroid(path);
            rotate = s.rotate;
        } else if (s.placement === "middle") {
            var mid = W.middle(path);
            pt = mid.mid;
            rotate = W.angle2X(mid.begin, mid.end) * Math.PI / 180;
            pt2 = mid.begin;
        } else if (s.placement === "mid") {
            if (ix === 0)
                return;
            pt = path[ix];
            pt2 = path[ix - 1];
            rotate = W.angle2X(pt2, pt) * Math.PI / 180;
            rt = W.offsetting(pt2, pt, 0, []);
            pt2 = rt[0];
            pt = rt[1];
        }
        if(!pt)
            return;
        if (s.type === "square") {
            var rect = Painter.buildRect(pt, [s.width, s.height], [s.dx, s.dy], s.alignment, s.verticalAlignment);
            this.transform(rect[0], rect[1], 1, rotate);
            this._ctx.beginPath();
            this._ctx.rect(rect[0], rect[1], rect[2], rect[3]);

        } else if (s.path) {
            var p2d = new Path2D(s.path);
            this._ctx.translate(pt[0] - s.viewBox[1] / 2, pt[1] - s.viewBox[1] / 2);
            this.transform(s.viewBox[0] / 2, s.viewBox[1] / 2, 1, rotate);
            //this._ctx.fill(p2d);
            return p2d;
        }
    }

  
}