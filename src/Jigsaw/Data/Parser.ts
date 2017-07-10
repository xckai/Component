import _=require("underscore")
let getProperty=function(obj,paths:string){
    let spliter="/"
    let path=paths.split("/")
    let r=obj
    for(let i=0;i<path.length;++i){
        if(_.has(r,path[i])){
              r=r[path[i]]
        }else{
            r=undefined
        }
    }
    return r
}
export namespace GeoJSONParser{
    export function getProperty(obj,key){
      return getProperty(obj,key)
    }
    
}
