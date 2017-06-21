import { Model } from "../../Jigsaw/Model"
import { View } from "../../Jigsaw/View"
export class Adjuster extends View{
    constructor(conf?){
        super(conf)
    }
    events(){
        return  {
                    "click button":"beginSimulate"
                    
                }
    }
    render(){
        this.$el.html(`<div><input type="number"><span>%</span></div>
                        <div><button>Begin Simulate</button></div>`)
        return this
    }
    beginSimulate(){
        this.trigger("onClick")
    }
    getValue(){
        return this.$("input").val()
    }
}