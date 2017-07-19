import { G2Map } from "../../../Jigsaw/Component/Map/G2Map"
import _ = require('underscore');
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
    linechart: VicroadLineChart
    routerChart: VicroadLineChart
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
        this.linechart = new VicroadLineChart()
        this.routerChart = new VicroadLineChart({ style: { width: "30rem", height: "20rem" } })
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
            let layers = L.layerGroup([])
            this.vicroadlayers.addLayer(layers)
            let mBegin = L.marker([0, 0]), mEnd = L.marker([0, 0]), mPath = L.polyline([], { interactive: false })
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
                API.getReTimeDatas(e.latlngs, this.getContext("currentTime")).done((d) => {
                    chart.clearMeasure()
                    chart.loadMeasures(d)
                    this.on("time-change", (d) => {
                        setTimeout(() => {
                            chart.setTimeAdjust(this.getContext("currentTime"))
                        }, 50)
                    })
                    mEnd.bindPopup(chart.toElement())
                    mEnd.openPopup()
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
            })
            this.routerPicker.begin()
        })
    }
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
    doReRouter() {
        let adjusterLayers = L.layerGroup([])
        this.vicroadlayers.addLayer(adjusterLayers)
        let routerLayers = L.layerGroup([])
        this.vicroadlayers.addLayer(routerLayers)
        let roadPickLayers = L.layerGroup([])
        this.vicroadlayers.addLayer(roadPickLayers)

        let clearMap = () => {
            roadPickLayers.clearLayers()
            routerLayers.clearLayers()
            adjusterLayers.clearLayers()
            this.layer("router").hide()
        }
        let doAdjuster = () => {
            clearMap()
            this.roadPicker.off("*")
            ////begin adjute road
            let adjuster = new Adjuster()
            this.proxyEvents(adjuster, "simulate-road-change")
            let roadMark = L.marker([0, 0], { icon: L.divIcon({ className: 'adjusterIcon fa fa-times' }) })
            roadMark.bindPopup(adjuster.getNode())
            adjusterLayers.addLayer(roadMark)
            let road = L.polyline([], { color: "red" })
            adjusterLayers.addLayer(road)
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
            this.on("simulate-road-change", () => {
                this.roadPicker.off("*")
            })

        }
        ////init roadpicker

        //////simulation done
        let showSimultaionResult = () => {
            let time = this.getContext("currentTime")
            if (time) {
                this.layer("simulationResult").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
                this.layer("simulationResultWithoutAdjuster").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
            }
            this.layer("simulationResultWithoutAdjuster").addToControl("baselayer")
            this.layer("simulationResult").addToControl("baselayer")
            this.layer("simulationResult").show()

            this.on("time-change", this.updateSimulationResult, this)
        }
        let doRoadPick = () => {
            clearMap()
            this.roadPicker.off("*")
            this.routerPicker.off("*")
            let roadChart = new VicroadLineChart({ style: { width: "30rem", height: "20rem" } })
            let roadMark = L.marker([0, 0])
            roadPickLayers.addLayer(roadMark)
            let road = L.polyline([])
            roadPickLayers.addLayer(road)
            this.roadPicker.on("drawing", (e) => {
                roadMark.setOpacity(1)
                roadMark.setLatLng(e.latlng)
            })
            this.roadPicker.on("fail", (e) => {
                roadMark.setOpacity(.5)
            })
            this.roadPicker.on("drawend", (e) => {
                if (e.point) {
                    roadMark.setLatLng(e.point)
                }
                if (e.path) {
                    road.setLatLngs(e.path)
                }
                if (e.id) {
                    API.getSimulationRoadDetail(e.id, this.getContext("currentTime")).done((d) => {
                        roadChart.clearMeasure()
                        roadChart.loadMeasures(d)
                        roadMark.bindPopup(roadChart.toElement())
                        this.on("time-change", () => {
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
            this.roadPicker.off("*")
            this.routerPicker.off("*")
            clearMap()
            let mBegin = L.marker([0, 0]), mEnd = L.marker([0, 0]), mPath = L.polyline([], { interactive: false })
            routerLayers.addLayer(mBegin).addLayer(mEnd).addLayer(mPath)

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
                this.on("time-change", () => {
                    API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {

                        this.layer("router").setData(d)
                        this.layer("router").redraw(true)
                        mPath.setLatLngs([])

                    })
                })
                API.getSimulationRouterChartData(e.latlngs, this.getContext("currentTime")).done((d) => {
                    let linechart = new VicroadLineChart({ style: { width: "30rem", height: "20rem" } })
                    linechart.loadMeasures(d)
                    this.on("time-change", () => {
                        setTimeout(() => {
                            linechart.setTimeAdjust(this.getContext("currentTime"))
                        }, 10)
                    })
                    mEnd.bindPopup(linechart.toElement())
                    mEnd.openPopup()
                })
                setTimeout(() => {
                    this.routerPicker.begin()
                }, 200)
            })
            this.routerPicker.on("drawing", (e) => {
                mPath.setLatLngs(e.latlngs)
            })
            this.routerPicker.on("drawbegin", (e) => {
                this.send("retime-router-drawing", { latlngs: e.latlngs })
                this.layer("router").hide()
                
                this.off("time-change", () => {
                    API.getReTimeRouter(e.latlngs, this.getContext("currentTime")).done((d) => {
                        this.layer("router").setData(d)
                        this.layer("router").redraw()
                        mPath.setLatLngs([])

                        //
                    })
                })
                this.layer("router").hide()
            })
            this.routerPicker.begin()
        }


        let simulationDone = () => {
            clearMap()
            showSimultaionResult()
            doRoadPick()
            this.on("simulate-router-btn-off", doRoadPick, this)
            this.on("simulate-router-btn-on", doRouter, this)

        }
        this.on("simulation:calculation-done", simulationDone, this)
        this.on("adjuster-btn-on", doAdjuster, this)
        this.on("adjuster-btn-off", () => {
            this.off("adjuster-btn-on", doAdjuster, this)
        })
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
        this.layer("simulationResult").hide()
        this.vicroadlayers.clearLayers()
        this.layer("router").hide()
        this.addHooks()
        this.showArea()
    }
    initLayers() {
        let l = this.layer("simulationResult", {
            renderer: "canvas",
            url: API.getSimulationResultURL(),
            selectable: false
        })
        let l0 = this.layer("simulationResultWithoutAdjuster", {
            renderer: "canvas",
            url: API.getSimulationResultWithoutAdjusterURL(),
            selectable: false
        })
        l0.style("*").line({
            width: (c) => {

                if (c("zoom")) {
                    return Math.floor(c("zoom") / 5)
                } else {
                    return 2
                }
            }, color: (c) => {
                if (c("SIM_SPEED") > 60)
                    return "yellow";
                else
                    return "red";
            }
        })
        l.style("*").line({
            width: (c) => {

                if (c("zoom")) {
                    return Math.floor(c("zoom") / 5)
                } else {
                    return 2
                }
            }, color: (c) => {
                if (c("SIM_SPEED") > 60)
                    return "yellow";
                else
                    return "red";
            }
        })
        this.layer("router", { renderer: "canvasOnMap" }).style("*").line({
            width: 3, color: "red", marker: {
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
    hiddenSimulationResult() {
        this.layer("simulationResult").hide()
        this.off("time-change", this.updateSimulationResult, this)
    }
    updateSimulationResult() {
        let time = this.getContext("currentTime")
        if (time) {
            this.layer("simulationResult").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
            this.layer("simulationResultWithoutAdjuster").setContext({ timeTo: moment(time).format("YYYY-MM-DDTHH:mm:00Z") })
        }
        this.layer("simulationResult").redraw()
        this.layer("simulationResultWithoutAdjuster").redraw()
    }
    showArea() {
        if (!this.pickableArea) {
            API.getMainArea().done((d) => {
                if (d) {
                    this.pickableArea = L.polygon(d.latlngs)
                    this.pickableArea.addTo(this.map.leaflet)
                    this.map.leaflet.fitBounds(this.pickableArea.getBounds())
                    this.initArea()
                }
            }).fail(() => {
                alert("error ")
            })




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
        if (this.pickableArea) {
            this.roadPicker.setInteractiveLayer(this.pickableArea)
            this.routerPicker.setInteractiveLayer(this.pickableArea)
            // this.doRoadPick()
        }
    }
    pickableArea: L.Polygon

}