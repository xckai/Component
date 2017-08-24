export interface IProgressLoader{
    addTo(el:HTMLElement):this
    setWidth(s:string):this
    setHeight(s:string):this
    remove():this
    show():this    
    toElement():HTMLElement|SVGAElement
    setProgress(n:number):this
}
