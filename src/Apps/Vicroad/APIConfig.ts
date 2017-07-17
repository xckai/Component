import _ = require('underscore');
import * as moment from '../../../vendor/moment/moment';
import { JPromise, JRequest, JWhenAll } from '../../Jigsaw/Core/JRequest';
import { GeoJSON } from '../../Jigsaw/Data/DataDefine';
import { Util } from '../../Jigsaw/Utils/Util';
export let mainArea = new JRequest()
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
    export function beginSimulation(controls,timeFrom:Date){
        let r=new JRequest()
        r.url="/services/vicroad/localtasks/simulation"
        r.method="POST"
        r.params={
            user:null,
            project:null
        }
        r.data={
            features:[],
            srid:4326,
            decimals:0
        }
        let features=[{controls,timeFrom:moment(timeFrom).format("YYYY-MM-DDTHH:mm:00Z")}]
        r.send({features,user:Math.random(),project:"user1"})
    
        return r
    }
    export function getReTimeDatas(latlngs:any[],time:Date){
        let p=new JPromise()
        let url= "services/vicroad/tiers/routingSimulate/extent/15/144.92022514343265%2C-37.83263257682617%2C145.00185012817386%2C-37.79750922077998/4326.w2"
        let ls=latlngs.map((l)=>{
              return l.lng+","+l.lat
          })
        let r0=new JRequest({
             url,params:{
                 l:ls,timeFrom:""
             }
         }).changeDoneHandler((d)=>{
              let featureCollection=JSON.parse(d)
              let t=0
               _.each(featureCollection.features,(f)=>{
                   if(Util.getProperty(f,"time")){
                       t+=+Util.getProperty(f,"time")
                   }
               })
               console.log(r0.context["timeFrom"],t)
              r0.doDone({y:t,x:r0.context["timeFrom"]})
          }).setContext({timeFrom:moment(time).format("YYYY-MM-DDTHH:mm:00Z")})
         let r1=new JRequest({
             url,params:{
                 l:ls,timeFrom:""
             }
         }).changeDoneHandler((d)=>{
              let featureCollection=JSON.parse(d)
              let t=0
               _.each(featureCollection.features,(f)=>{
                   if(Util.getProperty(f,"time")){
                       t+=+Util.getProperty(f,"time")
                   }
               })
               console.log(r1.context["timeFrom"],t)
              r1.doDone({y:t,x:r1.context["timeFrom"]})
          }).setContext({timeFrom:moment(time).add(15,"m").format("YYYY-MM-DDTHH:mm:00Z")})

            let r2=new JRequest({
             url,params:{
                 l:ls,timeFrom:""
             }
         }).changeDoneHandler((d)=>{
              let featureCollection=JSON.parse(d)
              let t=0
               _.each(featureCollection.features,(f)=>{
                   if(Util.getProperty(f,"time")){
                       t+=+Util.getProperty(f,"time")
                   }
               })
               console.log(r2.context["timeFrom"],t)
              r2.doDone({y:t,x:r2.context["timeFrom"]})
          }).setContext({timeFrom:moment(time).add(30,"m").format("YYYY-MM-DDTHH:mm:00Z")})

              let r3=new JRequest({
             url,params:{
                 l:ls,timeFrom:""
             }
         }).changeDoneHandler((d)=>{
              let featureCollection=JSON.parse(d)
              let t=0
               _.each(featureCollection.features,(f)=>{
                   if(Util.getProperty(f,"time")){
                       t+=+Util.getProperty(f,"time")
                   }
               })
               console.log(r3.context["timeFrom"],t)
              r3.doDone({y:t,x:r3.context["timeFrom"]})
          }).setContext({timeFrom:moment(time).add(45,"m").format("YYYY-MM-DDTHH:mm:00Z")})
               let r4=new JRequest({
             url,params:{
                 l:ls,timeFrom:""
             }
         }).changeDoneHandler((d)=>{
              let featureCollection=JSON.parse(d)
              let t=0
               _.each(featureCollection.features,(f)=>{
                   if(Util.getProperty(f,"time")){
                       t+=+Util.getProperty(f,"time")
                   }
               })
               console.log(r4.context["timeFrom"],t)
              r4.doDone({y:t,x:r4.context["timeFrom"]})
          }).setContext({timeFrom:moment(time).add(60,"m").format("YYYY-MM-DDTHH:mm:00Z")})
        JWhenAll(r0,r1,r2,r3,r4).done(
            (d0,d1,d2,d3,d4)=>{
                 
                p.doDone([{id:1, data:[d0,d1,d2,d3,d4], type:"line"}])
            }
        ).fail((d)=>{
            p.doFail(d)
        })
          
        //  setTimeout(()=>{
        //       r.doDone([{id:1, data:[{x:0,y:0},{x:3,y:2},{x:5,y:8},{x:7,y:32}], type:"line"},
        //                 {id:2, data:[{x:1,y:32},{x:3,y:8},{x:5,y:2},{x:8,y:1}], type:"line"}])
        //  },2000)

       
        
          return p
    }
    export function getReTimeRouter(latlngs:any[],time:Date){
        let url= "services/vicroad/tiers/routingSimulate/extent/15/144.92022514343265%2C-37.83263257682617%2C145.00185012817386%2C-37.79750922077998/4326.w2"
        let ls=latlngs.map((l)=>{
              return l.lng+","+l.lat
          })
        let r0=new JRequest({
             url,params:{
                 l:ls,timeFrom:""
             }
         }).changeDoneHandler((d)=>{
              r0.doDone(JSON.parse(d))
          })
        r0.send({timeFrom:moment(time).format("YYYY-MM-DDTHH:mm:00Z")})

        return r0
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
    export function getSimulationResultUrl(){
        let r=new JRequest
        r.url="/services/vicroad/tiers/ctmEdgeSpeedMap/extent/:zoom/:extent/canvas.w2"
        r.params={
            category:1,
            project:"user1",
            timeTo:":timeTo"
        }
         return  r.buildUrl()
    }
   
}

