import { GeoJSON } from '../../Jigsaw/Data/DataDefine';
import { JPromise, JRequest } from '../../Jigsaw/Core/JRequest';
import _=require("underscore")
export let mainArea=new JRequest()
export namespace API{
    export function getMainArea(ctx?):JPromise{
        let r=new JRequest()
        r.url="/service/apps/tcm/maps/tpi/query/area_search.json"
        r.changeDoneHandler((d)=>{
            let f=new GeoJSON.FeatureCollection(d)
            let p=_.first(f.getPolygon())
            if(p){
                 r.fire("done",{latlngs:p.getleafletCoorinates()})
            }else{
                 r.doFail()
            }
           
        })
        r.send()
        return r
    }
    export function getRoad(lat,lng){
       
        let r=new JRequest()
        r.url= "/service/apps/itm/maps/itm/query/point2edge.json"
        r.params={
            lat:null,
            lng:null
        }
        r.changeDoneHandler((d)=>{
            let f=new GeoJSON.FeatureCollection(d)

            if(_.isEmpty(f.getPoint())||_.isEmpty(f.getPolyline())){
               r.fire("fail")
            }else{
                r. fire("done",{
                    point:_.first(f.getPoint()).getleafletCoorinates(),
                    path:_.first(f.getPolyline()).getleafletCoorinates(),
                    roadNum:_.first(f.getPolyline()).getProperty("properties/AVGLANES"),
                    name:_.first(f.getPolyline()).getProperty("properties/NAME"),
                    id:_.first(f.getPolyline()).getProperty("properties/ID"),
                })
            }
        })
        r.send({lat,lng})
        return r
    }
    export function beginSimulation(controls,from){
        let r=new JRequest()
        r.url="/services/vicroad/localtasks/simulation"
        r.method="POST"
        r.params={
            user:null
        }
        r.data={
            controls:[],
            from:null
        }
        r.send({controls,from,user:_.uniqueId("user")})
        return r
    }
    export function getReTimeRouter(latlngs:any[],time:Date){
         let r=new JRequest()
         r.url="services/vicroad/tiers/routingSimulate/extent/15/144.92022514343265%2C-37.83263257682617%2C145.00185012817386%2C-37.79750922077998/4326.w2"
         r.params={
             l:[],
             timeFrom:""
         }
         setTimeout(()=>{
              r.doDone([{id:1, data:[{x:0,y:0},{x:3,y:2},{x:5,y:8},{x:7,y:32}], type:"line"},
                        {id:2, data:[{x:1,y:32},{x:3,y:8},{x:5,y:2},{x:8,y:1}], type:"line"}])
         },2000)
          let ls=latlngs.map((l)=>{
              return l.lng+","+l.lat
          })
          r.send({l:ls,timeFrom:"2017-05-08T08:30:00"})
          return r
    }
    export function getSimulationResult(time:Date){
        let r= new JRequest
        r.url="/services/vicroad/tiers/ctmEdgeSpeedMap/4326.w2"
        r.params={
            category:1,
            timeTo:"2017-05-08T16:45:00%2B08:00"
        }
        r.send()
        return r
    }
}

