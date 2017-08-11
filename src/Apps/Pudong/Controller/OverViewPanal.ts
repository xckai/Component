import { Controller } from "../../../Jigsaw/Core/Controller";
import { BackboneView } from "../../..//Jigsaw/Core/View";
import Backbone =require("backbone")

class overViewModel extends Backbone.Model{
    defaults(){
        return {
            publicTransportationShare:"--",
            publicTransportationAccCard:"--",
            publicTransportationPerson:"--"
        }
    }
}
class OverViewPanalView extends BackboneView{

}
export class OverViewPanal extends Controller {

}