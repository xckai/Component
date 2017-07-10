import { checkIteratorCollection, curry, curry2, curry3 } from '../Utils/FP';
import _ = require("underscore")
let getProperty = function (obj, paths: string) {
    let spliter = "/"
    let path = paths.split("/")
    let r = obj
    for (let i = 0; i < path.length; ++i) {
        if (_.has(r, path[i])) {
            r = r[path[i]]
        } else {
            r = undefined
        }
    }
    return r
}
let comparer = curry(function (path: string, target: any, obj: any) {
    return getProperty(obj, path) == target
})

export namespace W2 {
    enum featureType {
        POINT = 0,
        LINGSTRING,
        POLYGON
    }
    export type W2Path = number[]
    export type geometry = {
        t: featureType
        p: W2Path
        [key: string]: any
    }
    export type feature = {
        g: geometry
        [key: string]: any
    }
    export type collection = {
        srid: string,
        decimals: number | string
        features: feature[]
    }
}


export namespace GeoJSON {
    let isFeature = comparer("type", "Feature")
    let isPoint = checkIteratorCollection(isFeature, comparer("geometry/type", "Point"))
    let isPolygon = checkIteratorCollection(isFeature, comparer("geometry/type", "Polygon"))
    let isPolyline = checkIteratorCollection(isFeature, comparer("geometry/type", "LineString"))
    export type coordinate = [number, number]
    export type geometry = {
        type: string,
        coordinates: coordinate[]
    }
    export type latlng = {
        lat: number,
        lng: number
    }
    export type properties = {
        [key: string]: any
    }
    export type feature = {
        type: string,
        geometry: geometry,
        [k: string]: any
    }
    export type featureCollection = {
        type: string,
        features: feature[]
        properties: properties
    }
    export class Feature {
        type: string
        geometry: geometry
        properties: properties
        constructor(d) {
            this.type = d.type
            this.geometry = d.geometry
            this.properties = d.properties
        }
        getCoordinates() {
            return getProperty(this, "geometry/coordinates")
        }
        toGeoJSON() {
            return {
                type: this.type,
                geometry: this.geometry,
                properties: this.properties
            }
        }
        getProperty(path) {
            return getProperty(this, path)
        }
    }
    export class Point extends Feature {
        type = "Point"
        getCoordinates() {
            return getProperty(this, "geometry/coordinates")
        }
        toLeafletMarker(options?) {
            return L.marker(this.getleafletCoorinates(), options)
        }
        getleafletCoorinates() {
            let c = this.getCoordinates()
            return {
                lat: c[1],
                lng: c[0]
            }
        }

    }
    export class Polygon extends Feature {
        type = "Polygon"
        getCoordinates() {
            return getProperty(this, "geometry/coordinates/0")
        }
        getleafletCoorinates() {
            return _.map(this.getCoordinates(), (c: coordinate) => {
                return {
                    lat: c[1],
                    lng: c[0]
                }
            })
        }
        toLeafletPolygon(options?) {
            return L.polygon(this.getleafletCoorinates(), options)
        }
    }
    export class Polyline extends Feature {
        type = "Polyline"
        getCoordinates() {
            return getProperty(this, "geometry/coordinates")
        }
        getleafletCoorinates() {
            return _.map(this.getCoordinates(), (c: coordinate) => {
                return {
                    lat: c[1],
                    lng: c[0]
                }
            })
        }
        toLeafletPolyline(options?) {
            return L.polyline(this.getleafletCoorinates(), options)
        }
        getLeafletLatlngs() {
            return this.getleafletCoorinates()
        }

    }
    export class FeatureCollection {
        type: string
        features: feature[]
        properties: properties
        constructor(d: featureCollection) {
            this.type = d.type
            this.features = d.features
            this.properties = d.properties
        }
        getPoint() {
            return _.chain(this.features).filter(isPoint).map((f) => new Point(f)).value()
        }
        getPolygon() {
            return _.chain(this.features).filter(isPolygon).map((f) => new Polygon(f)).value()
        }
        getPolyline() {
            return _.chain(this.features).filter(isPolyline).map((f) => new Polyline(f)).value()
        }
        getPointCollection() {
            return _.filter(this.features, isPoint)
        }
        getPolygonCollection() {
            return new FeatureCollection({ type: this.type, properties: this.properties, features: _.filter(this.features, isPolygon) })
        }
        getPolylineCollection() {
            return _.filter(this.features, isPolyline)
        }
        toGeoJSON() {
            return {
                type: this.type,
                features: this.features,
                properties: this.properties
            }
        }
    }
}
export namespace GeoData {
    export type Latlng = {
        lat: number,
        lng: number
    }
    export type Road = {
        name: string,
        id: string,
        geometry: Latlng[]
        [k: string]: any
    }
    export type Point = {
        geometry: Latlng
        [k: string]: any
    }
    export type Area = {
        geometry: Latlng[]
        [k: string]: any
    }
}
