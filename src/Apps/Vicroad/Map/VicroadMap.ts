import { G2Map } from "../../../Jigsaw/Component/Map/G2Map"
import _ = require('lodash');
import L = require('leaflet')
import moment = require("moment")
import { Adjuster } from './Adjuster';
import { DatePanal } from "./DatePanal";
import { API } from "../APIConfig";
import { Util } from "../../../Jigsaw/Utils/Util";
import { VicroadLineChart } from "../Chart/LineChart";
import { RoadPicker, RouterPicker } from "./Picker"
import { W } from "../../../Jigsaw/Component/Map/DS";

export class VicroadMap extends G2Map {
    constructor(conf?) {
        super(Util.deepExtend({ zoomControl: false, class: "map" }, conf))
        this.init()
    }

    roadPicker: RoadPicker
    adjuster: Adjuster
    routerPicker: RouterPicker
    datePanal: DatePanal
    adjusterLayerGroup: L.LayerGroup
    reTimeRouterLayerGroup: L.LayerGroup
    simulateRouterLayerGroup: L.LayerGroup
    vicroadlayers: L.LayerGroup

    init() {
        this.datePanal = new DatePanal()
        this.datePanal.appendAt(this.rootView.$el)
        this.datePanal.style({
            "z-index": 2000,
            position: "absolute",
            width: "100%"
        })

        //this.on("adjuster-btn-on",this.doSelectAdjuster,this)
        //this.on("router-btn-off",this.doSimulationRoadPick,this)

        //this.on("simulator-apply",this.doReRouter,this)
        //this.on("simulate-router-btn-on",this.doRouter,this)
        this.roadPicker = new RoadPicker()
        //this.roadPicker.baseUrl = "/service/apps/itm/maps/itm/query/point2edge.json?"
        this.roadPicker.setMap(this.map.leaflet)
        this.routerPicker = new RouterPicker()
        this.routerPicker.setMap(this.map.leaflet)
        this.adjuster = new Adjuster
        this.vicroadlayers = L.layerGroup([]).addTo(this.map.leaflet)
        // this.adjusterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
        // this.reTimeRouterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
        // this.simulateRouterLayerGroup=L.layerGroup([]).addTo(this.map.leaflet)
        // this.on("simulation:done",this.showSimulationResult,this)
        this.initLayers()
        this.initArea()

        this.initAll()
    }
    addHooks() {
        this.on("time-change", (d) => {
            this.datePanal.setTime(d.dateTime)
        })
        //this.on("retime-apply", this.doReTimeRouter, this)
    }
    doReTime() {
        this.on("retime-apply", () => {
            this.roadPicker.off("*")
            let latlngs
            let chart = new VicroadLineChart({
                
                style: { width: "30rem", height: "20rem" }, line: {
                    defaultTimeAdjust: this.getContext("currentTime")
                }
            })
            chart.setConfig({chartTitle: {
                    value: "Travel Time Chart"
                }})
            let layers = L.layerGroup([])
            this.vicroadlayers.addLayer(layers)
            let mBegin = L.marker([0, 0], { icon: L.divIcon({ className: 'routerFrom' }) }), mEnd = L.marker([0, 0], { icon: L.divIcon({ className: 'routerTo' }) }), mPath = L.polyline([], { interactive: false })
            layers.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)
            let retimeHandler = () => {
                API.getReTimeRouter(latlngs, this.getContext("currentTime")).done((d) => {
                    //chart.setTime()
                    this.layer("router").setData(d)
                    this.layer("router").redraw(true)
                    mPath.setLatLngs([])
                })
            }
            this.routerPicker.on("from", (e) => {
                mBegin.setLatLng(e.latlngs[0])
                mEnd.setLatLng([0, 0])
                mPath.setLatLngs([])
            })
            this.routerPicker.on("to", (e) => {
                mEnd.setLatLng(e.latlngs[1])
            })

            this.routerPicker.on("drawend", (e) => {
                mPath.setLatLngs(e.latlngs)
               
                this.send("retime-router-done", { latlngs: e.latlngs })
                API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {
                    this.layer("router").setData(d)
                    this.layer("router").redraw(true)
                    mPath.setLatLngs([])

                })
                latlngs = e.latlngs
                this.on("time-change", retimeHandler)
                API.getReTimeDatas(e.latlngs, this.getContext("beginTime")).done((d) => {

                    chart.loadMeasures(d)

                    this.on("time-change", (d) => {
                        setTimeout(() => {
                            chart.setTimeAdjust(this.getContext("currentTime"))
                        }, 50)
                    })
                    mEnd.bindPopup(chart.toElement())
                    mEnd.openPopup()
                    chart.setTimeAdjust(this.getContext("currentTime"))
                })
                setTimeout(() => {
                    this.routerPicker.begin()
                }, 200)
            })
            this.routerPicker.on("drawing", (e) => {
                mPath.setLatLngs(e.latlngs)
               

            })
            this.routerPicker.on("drawbegin", (e) => {
                // this.send("retime-router-drawing", { latlngs: e.latlngs })
                this.off("time-change", retimeHandler)
                this.layer("router").hide()
                chart.clearMeasure()
                mEnd.bindPopup(chart.toElement())

               
            })
            this.routerPicker.begin()
        })
    }
 
    doReRouter() {
        let adjusterLayers = L.layerGroup([])
        this.vicroadlayers.addLayer(adjusterLayers)
        let routerLayers = L.layerGroup([])
        this.vicroadlayers.addLayer(routerLayers)
        let roadPickLayers = L.layerGroup([])
        this.vicroadlayers.addLayer(roadPickLayers)
         this.off("simulation_calculation_done")
        let doAdjuster = () => {
            roadPickLayers.clearLayers()
            routerLayers.clearLayers()
            adjusterLayers.clearLayers()
            this.layer("router").hide()

            let oneAdjuster = () => {
                this.roadPicker.off("*")
                ////begin adjute road
                let adjuster = new Adjuster()
                let roadMark = L.marker([0, 0], { icon: L.divIcon({ className: 'adjusterIcon fa fa-times' }) })
                this.on("simulation_begin_calculation",()=>{
                    adjuster.disable()
                    roadMark.closePopup()
                })
                this.proxyEvents(adjuster, "simulate-road-change")
                let road = L.polyline([], { color: "#af1919" })
                let arrow=new Arrow([0,0])
                arrow.setColor("#af1919" )
                adjusterLayers.addLayer(road)
                adjusterLayers.addLayer(arrow)
               
                roadMark.bindPopup(adjuster.getNode())
                adjusterLayers.addLayer(roadMark)

                this.roadPicker.on("drawing", (e) => {
                    roadMark.setOpacity(1)
                    roadMark.setLatLng(e.latlng)
                    adjuster.setData({ id: null, name: null, roads: [] })

                    adjuster.setBusy(true)
                    roadMark.openPopup()
                })

                this.roadPicker.on("fail", (e) => {
                    roadMark.setOpacity(.5)
                    adjuster.setData({ id: null, name: null, roads: [] })
                    road.setLatLngs([])
                    roadMark.closePopup()
                })
                this.roadPicker.on("drawend", (e) => {
                    if (e.point) {
                        roadMark.setLatLng(e.point)
                        adjuster.setBusy(false)
                    }
                    if (e.path) {
                        road.setLatLngs(e.path)
                        arrow.asideEnd(e.path)

                    }
                    if (e.roadNum != undefined) {
                        let roads = []
                        for (let i = 0; i < e.roadNum; ++i) {
                            roads.push({ name: `Lane-${i + 1}`, isOpen: true })
                        }
                        adjuster.setData({ roads: roads, name: e.name, id: e.id })
                        roadMark.bindPopup(adjuster.getNode())
                    }
                    roadMark.setOpacity(1)
                })
                this.roadPicker.begin()
            }
            oneAdjuster()
            this.on("simulate-road-change:reRoute", () => {
                oneAdjuster()
            })
        }
        ////init roadpicker

        //////simulation done
        let showSimultaionResult = () => {
            let time = this.getContext("currentTime")
            if (time) {
                this.layer("Traffic Condition - After ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
                this.layer("Traffic Condition - Before ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
            }
            this.layer("Traffic Condition - Before ReRoute").addToControl("baselayer")
            this.layer("Traffic Condition - After ReRoute").addToControl("baselayer")
            this.layer("Traffic Condition - After ReRoute").show()

            this.on("time-change", this.updateSimulationResult, this)
        }
        let doRoadPick = () => {
            roadPickLayers.clearLayers()
            routerLayers.clearLayers()
            this.layer("router").hide()
            this.off("time-change:router")
            this.off("simulate-road-change:reRoute")
            this.roadPicker.off("*")
            this.routerPicker.off("*")

            let roadChart = new VicroadLineChart({
                 style: { width: "30rem", height: "20rem" } 
            })
            roadChart.setConfig({axis:{
                    yAxisTitleType:"speed"
                },
                chartTitle: {
                    value: "Road Speed Chart"
                },line:{
                    yAxisTitleType:"speed"
                }})
            let roadMark = L.marker([0, 0])
            roadPickLayers.addLayer(roadMark)
            let arrow=new Arrow([0,0])
            arrow.setColor("#3388ff" )
            roadPickLayers.addLayer(arrow)
            let road = L.polyline([])
            roadPickLayers.addLayer(road)
            this.roadPicker.on("drawing", (e) => {
                roadMark.setOpacity(1)
                this.off("time-change:roadDetail")
                roadMark.setLatLng(e.latlng)
                //this.send("reRouter:rePickRoad")
            })
            this.roadPicker.on("fail", (e) => {
                roadChart.clearMeasure()
                road.setLatLngs([])
                arrow.setLatLng([0,0])
                roadMark.setOpacity(.5)
            })
            this.roadPicker.on("drawend", (e) => {
                
                if (e.point) {
                    roadMark.setLatLng(e.point)
                }
                if (e.path) {
                    road.setLatLngs(e.path)
                    arrow.asideEnd(e.path)
                }
                if (e.id) {
                    API.getSimulationRoadDetail(e.id, this.getContext("beginTime")).done((d) => {
                       
                        roadChart.loadMeasures(d)
                        roadMark.bindPopup(roadChart.toElement())
                        roadMark.openPopup()
                        roadChart.setTimeAdjust(this.getContext("currentTime"))
                        this.on("time-change:roadDetail", () => {
                            setTimeout(() => {
                                roadChart.setTimeAdjust(this.getContext("currentTime"))
                            }, 10)
                        })
                    })
                }
                roadMark.setOpacity(1)
            })
            this.roadPicker.begin()
        }

        let doRouter = () => {
            roadPickLayers.clearLayers()
            routerLayers.clearLayers()
            this.layer("router").hide()
            this.off("time-change:roadDetail")
            this.roadPicker.off("*")
            this.routerPicker.off("*")

            let mBegin = L.marker([0, 0], { icon: L.divIcon({ className: 'routerFrom' }) }), mEnd = L.marker([0, 0], { icon: L.divIcon({ className: 'routerTo' }) }), mPath = L.polyline([], { interactive: false })
            routerLayers.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)
            let linechart = new VicroadLineChart({ style: { width: "30rem", height: "20rem" } })
                linechart.setConfig({chartTitle:{
                    value:"Travel Time Chart"
                }})
            this.routerPicker.on("from", (e) => {
                mBegin.setLatLng(e.latlngs[0])
                mEnd.setLatLng([0, 0])
                mPath.setLatLngs([])
            })
            this.routerPicker.on("to", (e) => {
                mEnd.setLatLng(e.latlngs[1])
            })
            let chartTimeChangeHandler = (latlngs) => {
                API.getReTimeRouter(latlngs, this.getContext("currentTime")).done((d) => {

                    this.layer("router").setData(d)
                    this.layer("router").redraw(true)
                    mPath.setLatLngs([])
                })
            }
            this.routerPicker.on("drawend", (e) => {
                mPath.setLatLngs(e.latlngs)
                API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {

                    this.layer("router").setData(d)
                    this.layer("router").redraw(true)
                    mPath.setLatLngs([])
                })
                let latlngs = e.latlngs
                this.on("time-change:router:layer", () => {
                    API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {

                        this.layer("router").setData(d)
                        this.layer("router").redraw(true)
                        mPath.setLatLngs([])

                    })
                })
                API.getSimulationRouterChartData(e.latlngs, this.getContext("beginTime")).done((d) => {
                    
                
                    linechart.loadMeasures(d)
                    this.on("time-change:router:chart", () => {
                        setTimeout(() => {
                            linechart.setTimeAdjust(this.getContext("currentTime"))
                        }, 10)
                    })
                    mEnd.bindPopup(linechart.toElement())
                    mEnd.openPopup()
                    linechart.setTimeAdjust(this.getContext("currentTime"))
                })
                setTimeout(() => {
                    this.routerPicker.begin()
                }, 200)
            })
            this.routerPicker.on("drawing", (e) => {
                mPath.setLatLngs(e.latlngs)
            })
            this.routerPicker.on("drawbegin", (e) => {
                //this.send("reRouter:reRoute")
                this.layer("router").hide()
                linechart.clearMeasure()
                this.off("time-change:router")
                this.layer("router").hide()
            })
            this.routerPicker.begin()
        }


        let simulationDone = () => {
            roadPickLayers.clearLayers()
            routerLayers.clearLayers()
            this.layer("router").hide()

            showSimultaionResult()
            doRoadPick()
            this.on("simulate-router-btn-off", doRoadPick, this)
            this.on("simulate-router-btn-on", doRouter, this)

        }
       
        this.on("simulation_calculation_done", simulationDone, this)
        this.on("adjuster-btn-on", doAdjuster, this)

    }
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
    initAll() {
        this.roadPicker.off("*")
        this.routerPicker.off("*")
        this.off("*")
        this.layer("Traffic Condition - After ReRoute").hide().removeFromControl()
        this.layer("Traffic Condition - Before ReRoute").hide().removeFromControl()
        this.vicroadlayers.clearLayers()
        this.layer("router").hide()
        this.addHooks()
        // this.showArea()
    }
    initLayers() {
        let l = this.layer("Traffic Condition - Before ReRoute", {
            renderer: "canvas",
            url: API.getSimulationResultWithoutAdjusterURL(),
            selectable: false
        }).style("*").line({
            width: (c) => {

                if (c("zoom")) {
                    return Math.floor(c("zoom") / 5)
                } else {
                    return 2
                }
            }, color: (c) => {
                 var k = c('SIM_DENSITY');
                    if(k < 18)
                       return "#84CA50"; //free
                   if(k >= 18 && k <= 42)
                       return "#F07D02";
                   if(k > 42 && k <= 115)
                       return "#E60000";
                   if(k > 115)
                       return "#9E1313";
            }
        })
        let l0 = this.layer("Traffic Condition - After ReRoute", {
            renderer: "canvas",
            url: API.getSimulationResultURL(),
            selectable: false
        }).style("*").line({
            width: (c) => {

                if (c("zoom")) {
                    return Math.floor(c("zoom") / 5)
                } else {
                    return 2
                }
            }, color: (c) => {
                   var k = c('SIM_DENSITY');
                    if(k < 18)
                       return "#84CA50"; //free
                   if(k >= 18 && k <= 42)
                       return "#F07D02";
                   if(k > 42 && k <= 115)
                       return "#E60000";
                   if(k > 115)
                       return "#9E1313";
            }
        })
    
        this.layer("router", { renderer: "canvasOnMap" }).style("*").line({
            width: 3, color: "#2b82cb", marker: {
                end: {
                    path: "M2,2 L2,11 L10,6 L2,2",
                    viewBox: [13, 13],
                    size: [5, 5]
                }
            }
        })

        // this.on("simulation:calculation-done",this.showSimulationResult,this)

    }
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
    updateSimulationResult() {
        let time = this.getContext("currentTime")
        if (time) {
            this.layer("Traffic Condition - After ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
            this.layer("Traffic Condition - Before ReRoute").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
        }
        this.layer("Traffic Condition - Before ReRoute").redraw()
        this.layer("Traffic Condition - After ReRoute").redraw()
    }
    showArea() {
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
    }
    initArea() {

        if (!this.pickableArea) {
            API.getMainArea().done((d) => {
                if (d) {
                    this.pickableArea = L.polygon(d.latlngs)
                    this.pickableArea.addTo(this.map.leaflet)
                    this.map.leaflet.fitBounds(this.pickableArea.getBounds())
                    this.roadPicker.setInteractiveLayer(this.pickableArea)
                    this.routerPicker.setInteractiveLayer(this.pickableArea)
                }
            }).fail(() => {
                alert("Login in Please")
            })
            // this.doRoadPick()
        }else{
              this.map.leaflet.fitBounds(this.pickableArea.getBounds())
        }
    }
    pickableArea: L.Polygon

}
export class Arrow extends L.Marker{
   constructor(latlng?){
       super(latlng,{icon: L.divIcon({ className: 'leaflet-arrow-container' })})
   }
   onAdd(l){
       super.onAdd(l)
       let node=this.arrowElement=document.createElement("div")
       node.className="fa fa-arrow-up"
       this.getElement().appendChild(node)
       this.setColor(this.color)
       return this
   }
   color:string
   arrowElement:HTMLElement
   setRotation(r){
       
        this.arrowElement.style.transform=`rotate(${r}deg)`
        this.arrowElement.style.transformOrigin="center"
   }
   setColor(c){
      this.color=c
      if(this.arrowElement){
           this.arrowElement.style.color=c
      }
   }
   asideEnd(p:L.LatLng[]){
       let ps=_.takeRight(p,2)
       let p1=ps[0],p2=ps[1]
       let angle=0
        angle = Math.atan2((p2.lng - p1.lng), (p2.lat -p1.lat)) * 180 / Math.PI;
        angle%=360
        this.setRotation(angle)
        this.setLatLng(p2)
        return this

   }
}