declare module "Core/Util" {
    export module Util {
        function isEndWith(s: any, ed: string): boolean;
        function toPixel(str: string | number, ctx?: string): any;
        namespace operation {
            function add(str1: any, str2: any): any;
            function sub(s1: any, s2: any): any;
        }
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
        clear: () => void;
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
        proxyEvents(obj: IEvented, ...args: any[]): void;
    }
}
declare module "Core/View" {
    import d3 = require("d3");
    import { Evented } from "Core/Evented";
    export class View extends Evented {
        constructor(conf: any);
        defaultConfig(): IViewConfig;
        setConfig(c: any): this;
        config: IViewConfig;
        el: any;
        elD3: d3.Selection<Element, {}, null, null>;
        initView(): this;
        appendTo(dom: d3.Selection<Element, {}, null, null>): this;
        append(element: any): void;
        style(s: any): this;
        attr(a: any): this;
        render(ctx?: any): this;
        addClass(c: any): this;
        removeClass(c: any): this;
    }
    export interface IViewConfig {
        tagName: string | null | undefined;
        className: string | null | undefined;
    }
}
declare module "Core/BaseLayer" {
    import { BaseChart } from "Core/BaseChart";
    import { View, IViewConfig } from "Core/View";
    export class BaseLayer extends View {
        constructor(id?: any, conf?: any);
        defaultConfig(): ILayerConfig;
        id: string;
        rendered: boolean;
        chart: BaseChart;
        config: ILayerConfig;
        setConfig(c: any): this;
        setStyle(s: any): void;
        evaluateStyle(): ILayerStyle;
        updateStyle(): void;
        addTo(c: BaseChart): this;
        _onAdd(c: BaseChart): void;
        render(): this;
        renderAtMap(dom: Element | HTMLElement | SVGAElement): void;
        clear(): void;
        getNode(): any;
        update(): void;
    }
    export interface ILayerConfig extends IViewConfig {
        className: string;
        tagName: string;
        style: ILayerStyle;
    }
    export interface ILayerStyle {
        top: string | undefined | null;
        right: string | undefined | null;
        bottom: string | undefined | null;
        left: string | undefined | null;
        width: string;
        height: string;
        zindex: number;
        position: string;
    }
}
declare module "Core/BaseChart" {
    import { BaseLayer } from "Core/BaseLayer";
    import { Evented } from "Core/Evented";
    import { View } from "Core/View";
    export class BaseChart extends Evented {
        isRender: boolean;
        layers: BaseLayer[];
        rootView: View;
        config: IChartConfig;
        constructor(conf: any);
        getLayerContainer(): View;
        addClass(c: any): this;
        removeClass(c: any): this;
        defaultConfig(): IChartConfig;
        setStyle(c: any): void;
        renderAt(dom: Element | HTMLElement | SVGAElement | string): void;
        toElement(): any;
        addLayer(l: BaseLayer): this;
        removeLayer(id: any): this;
        _clearLayer(l: BaseLayer): this;
        whenReady(callback: Function, ctx?: any): void;
    }
    export interface IChartConfig {
        className: string;
        style: {
            width: string;
            height: string;
            position: string | null;
        };
        el: any;
    }
    export class SingleDataChart extends BaseChart {
        data: any;
        getData(): any;
        setData(d: any): void;
    }
}
declare module "Component/SingleDataChart/TimeAdjust/TimeAdjust" {
    import d3 = require('d3');
    import { SingleDataChart } from "Core/BaseChart";
    import { BaseLayer } from "Core/BaseLayer";
    export class TimeAdjustLayer extends BaseLayer {
        constructor(id?: any, conf?: any);
        currentTime: Date;
        chart: SingleDataChart;
        parseData(d: any): ITimeAdjustData;
        drawer(svgNode: d3.Selection<Element, {}, null, null>): void;
        render(): this;
    }
    export class TimeAdjust extends SingleDataChart {
        constructor(conf?: any);
        defaultConfig(): {
            style: {
                width: string;
                height: string;
                position: string;
            };
            className: string;
            el: any;
        };
        timelayer: TimeAdjustLayer;
        setData(d: any): void;
    }
    export interface ITimeAdjustData {
        focusTime: string;
        rangeMin: string;
        rangeMax: string;
        axisHeight: string;
        lineTextPadding: string;
        timeFormat: string;
        timeRound: number;
    }
}
declare module "Core/BaseMeasure" {
    export interface IBaseMeasure {
        id: string;
        data: any;
        type: string;
        style: any;
    }
    export class BaseMeasure implements IBaseMeasure {
        id: string;
        data: any;
        type: string;
        style: any;
        constructor(id?: any, data?: any, type?: any, style?: any);
    }
}
declare module "Component/MultiDataChart/MultiTypeMeasure" {
    import { BaseMeasure, IBaseMeasure } from "Core/BaseMeasure";
    import { IGetDomain } from "Component/MultiDataChart/MultiDataChart";
    export interface IMultiDataMeasure extends IBaseMeasure, IGetDomain {
    }
    export class MultiDataMeasure extends BaseMeasure implements IMultiDataMeasure {
        max(k?: any): any;
        min(k?: any): any;
        getDomain(k?: any): any[];
    }
}
declare module "Component/MultiDataChart/MultiDataChart" {
    import { BaseChart } from "Core/BaseChart";
    import { MultiDataMeasure } from "Component/MultiDataChart/MultiTypeMeasure";
    export interface IGetDomain {
        getDomain: (key?: string) => number[];
        max: (key?: string) => number;
        min: (key?: string) => number;
    }
    export interface IMeasureManager {
        measures: MultiDataMeasure[];
        addMeasure: (m: MultiDataMeasure) => this;
        loadMeasures: (ms: MultiDataMeasure[]) => this;
        removeMeasure: (m: MultiDataMeasure | string) => this;
        getAllMeasure: () => MultiDataMeasure[];
        getMeasure: (type: string) => MultiDataMeasure[];
        strToTimeMeasure: () => this;
        clearMeasure(): any;
    }
    export interface IMultiDataChart extends BaseChart, IMeasureManager, IGetDomain {
    }
    export class MultiDataChart extends BaseChart implements IMultiDataChart {
        measures: MultiDataMeasure[];
        colorManager: {};
        colorIndex: number;
        addMeasure(m: MultiDataMeasure): this;
        clearMeasure(): void;
        loadMeasures(ms: any[]): this;
        removeMeasure(m: MultiDataMeasure | string): this;
        getMeasure(type: string): MultiDataMeasure[];
        getAllMeasure(): MultiDataMeasure[];
        getDomain(k: string): any[];
        strToTimeMeasure(): this;
        max(k: string): any;
        min(k: string): any;
        getColor(id: any): any;
    }
}
declare module "Component/MultiDataChart/BarChart/BarData" {
    export interface BarData {
        x: string;
        y: number;
    }
}
declare module "Component/MultiDataChart/AxisLayer" {
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    import { MultiDataChart } from "Component/MultiDataChart/MultiDataChart";
    export class AxisLayer extends BaseLayer {
        constructor(id?: any, conf?: any);
        defaultConfig(): IAxisLayerConfig;
        config: IAxisLayerConfig;
        chart: MultiDataChart;
        render(): this;
    }
    export interface IXYAxisConfig {
        format: {
            x: any;
            y: any;
        } | undefined | null;
        key: {
            x: string;
            y: string;
        };
        ticks: {
            x: number;
            y: number;
        } | null | undefined;
    }
    export interface IAxisLayerConfig extends ILayerConfig {
        axis: IXYAxisConfig;
        borderPadding: number;
        padding: {
            top: string | undefined | null;
            right: string | undefined | null;
            bottom: string | undefined | null;
            left: string | undefined | null;
        };
        type: string;
        verticalGridLine: boolean;
        horizontalGridLine: boolean;
        yAxisTitleType: string;
    }
}
declare module "Component/Layer/TooltipLayer" {
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    import { MultiDataChart } from "Component/MultiDataChart/MultiDataChart";
    export class TooltipLayer extends BaseLayer {
        constructor(id?: any, conf?: any);
        config: ITooltipLayerConfig;
        defaultConfig(): ITooltipLayerConfig;
        chart: MultiDataChart;
        getSingleTooltipContent(ds: any): string;
        getGroupTooltipContent(ds: TooltipData): string;
        render(): this;
    }
    export interface ITooltipLayerConfig extends ILayerConfig {
    }
    export interface TooltipData {
        xMark: any;
        data: any[];
    }
}
declare module "Component/MultiDataChart/LegendLayer" {
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    import { MultiDataChart } from "Component/MultiDataChart/MultiDataChart";
    export class LegendLayer extends BaseLayer {
        constructor(id: any, conf?: any);
        defaultConfig(): ILegendLayerConfig;
        config: ILegendLayerConfig;
        chart: MultiDataChart;
        render(): this;
    }
    export interface ILegendLayerConfig extends ILayerConfig {
    }
}
declare module "Component/Layer/TitleLayer" {
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    export class TitleLayer extends BaseLayer {
        defaultConfig(): ITitleLayerConfig;
        config: ITitleLayerConfig;
        setTitle(t: any): void;
        render(): this;
    }
    export interface ITitleLayerConfig extends ILayerConfig {
        value: string;
    }
}
declare module "Component/MultiDataChart/LineChart/LineChart" {
    import d3 = require("d3");
    import { IChartConfig } from "Core/BaseChart";
    import { MultiDataChart } from "Component/MultiDataChart/MultiDataChart";
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    import { AxisLayer, IAxisLayerConfig } from "Component/MultiDataChart/AxisLayer";
    import { TooltipLayer, ITooltipLayerConfig } from "Component/Layer/TooltipLayer";
    import { LegendLayer, ILegendLayerConfig } from "Component/MultiDataChart/LegendLayer";
    import { TitleLayer, ITitleLayerConfig } from "Component/Layer/TitleLayer";
    import { MultiDataMeasure } from "Component/MultiDataChart/MultiTypeMeasure";
    export class LineChartMeasure extends MultiDataMeasure {
        constructor(id?: any, data?: any, type?: any, style?: any);
        parseMeasure(): this;
    }
    export class LineLayer extends BaseLayer {
        constructor(id?: any, conf?: any);
        config: ILineLayerConfig;
        defaultConfig(): ILineLayerConfig;
        chart: MultiDataChart;
        curveTypeMap: any;
        getScale(): any;
        drawer(svgNode: d3.Selection<Element, {}, null, null>): this;
        setTime(time: Date | String): void;
        render(): this;
    }
    export interface ILineLayerConfig extends ILayerConfig {
        borderPadding: number;
        curveType: string;
        hasDot: boolean;
        hasArea: boolean;
        hasTooltip: boolean;
        hasTimeAdjust: boolean;
        yAxisTitleType: string;
    }
    export interface LineData {
        x: any;
        y: any;
    }
    export class LineChart extends MultiDataChart {
        chartTitleLayer: TitleLayer;
        lineLayer: LineLayer;
        axisLayer: AxisLayer;
        tooltipLayer: TooltipLayer;
        legendLayer: LegendLayer;
        config: ILineChartConfig;
        defaultConfig(): ILineChartConfig;
        constructor(conf?: any);
        loadMeasures(ms: any[]): this;
        setConfig(c: any): void;
        setTimeAdjust(time: Date | String): void;
    }
    export interface ILineChartConfig extends IChartConfig {
        line: ILineLayerConfig;
        axis: IAxisLayerConfig;
        tooltip: ITooltipLayerConfig;
        legend: ILegendLayerConfig;
        chartTitle: ITitleLayerConfig;
    }
}
declare module "CustomizedChart/Vicroad/VicroadChart" {
    export * from "Component/SingleDataChart/TimeAdjust/TimeAdjust";
    export * from "Component/MultiDataChart/LineChart/LineChart";
}
