export namespace GeoData{
    export type Latlng={
        lat:number,
        lng:number
    }
    export type Road ={
        name:string,
        id:string,
        geometry:Latlng[]
        [k:string]:any
    }
    export type Point={
        geometry:Latlng
        [k:string]:any
    }
    export type Area={
        geometry:Latlng[]
        [k:string]:any
    }
}