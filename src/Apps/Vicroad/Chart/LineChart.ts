/// <reference path="../Vendor/VicroadChart.d.ts" />
import { LineChart } from 'CustomizedChart/Vicroad/VicroadChart';
export interface ILineChart{
    loadMeasures:(ms:any[])=>this
    setTimeLine:(data:Date)=>this
    renderAt:(s:string|HTMLElement)=>void
}
export class VicroadLineChart extends LineChart{
    toElement():any{
      
        return   super.toElement()
    }
}