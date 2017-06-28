declare module "Core/Util" {
    export module Util {
        function isEndWith(s: any, ed: string): boolean;
        function toPixel(s: string | number, ctx?: string): any;
        function isBeginWith(s: any, bs: string): boolean;
        function isContaint(s: any, ss: any): boolean;
        function max(nums: any[], key?: any): number;
        function min(ns: any[], key?: any): number;
        let d3Invoke: (...args: any[]) => any;
        function getStringRect(str: string, cla?: string, font_size?: number): {
            width: number;
            height: number;
        };
        function CacheAble(fn: any, keyFn?: any): () => any;
        function curry(f: Function): (...args: any[]) => any;
        function deepExtend(des: any, ...source: any[]): any;
        function enableAutoResize(dom: any, fn: any): void;
    }
}
declare module "Core/Evented" {
    export interface IEvented {
        on: (t: string, fn: Function, ctx?: object) => this;
        off: (t: string, fn: Function) => this;
        fire: (t: string, obj?: any) => this;
        listen: (o: IEvented, estr: string, fn: Function) => this;
    }
    export class Evented implements IEvented {
        constructor();
        private events;
        private parent;
        on(t: string, fn: Function, ctx?: Object): this;
        private _on(t, fn, ctx?);
        private _off(t, fn?, ctx?);
        off(t: string, fn: Function): this;
        fire(t: string, obj?: any): this;
        listen(o: IEvented, estr: string, fn: Function): this;
        listenTo(e: Evented): this;
        clear(): void;
    }
}
declare module "Core/View" {
    import d3 = require("d3");
    import { Evented } from "Core/Evented";
    export class View extends Evented {
        constructor(...confs: any[]);
        defaultConfig(): IViewConfig;
        config: IViewConfig;
        el: Element;
        elD3: d3.Selection<Element, {}, null, null>;
        initView(): this;
        appendTo(dom: d3.Selection<Element, {}, null, null>): this;
        style(s: any): this;
        attr(a: any): this;
        render(ctx?: any): this;
        addClass(c: any): this;
        removeClass(c: any): this;
    }
    export interface IViewConfig {
        tagName: string | null | undefined;
        className: string | null | undefined;
        style: {} | undefined | null;
    }
}
declare module "Chart/TimeAdjust/TimeAdjust" {
    import d3 = require("d3");
    import { View, IViewConfig } from "Core/View";
    export class TimeAdjust extends View {
        constructor(id: any, ...confs: any[]);
        id: string;
        config: TimeAdjustConfig;
        defaultConfig(): TimeAdjustConfig;
        setConfig(c: any): void;
        drawer(svgNode: d3.Selection<Element, {}, null, null>): void;
        render(): this;
        renderAt(dom: Element | HTMLElement | SVGAElement): void;
    }
    export interface TimeAdjustConfig extends IViewConfig {
        tagName: string;
        className: string;
        style: {
            top: string | undefined | null;
            left: string | undefined | null;
            bottom: string | undefined | null;
            right: string | undefined | null;
            position: string | undefined | null;
            "z-index": number | undefined | null;
            width: string;
            height: string;
        };
        rangeMin: string;
        rangeMax: string;
        focusTime: string;
        padding: number;
        timeParse: string;
        timeFormat: string;
    }
}
declare module "VicroadChart" {
    export * from "Chart/TimeAdjust/TimeAdjust";
}
