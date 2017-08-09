import { Component, IComponentConfig } from "../../../Jigsaw/Core/Component";
import _ = require("lodash")
import { G2Map, IMapConfig } from "../../../Jigsaw/Controller/Map/G2Map"
import { DivNode } from "../../../Jigsaw/Controller/DivNode/DivNode";
import { CircleSide } from "../../../Jigsaw/Controller/Side/CircleSide";

export class SideComponent extends Component {
    constructor(c?: IComponentConfig) {
        super(c)
        this.addClass("SideComponent")
        this.side=new CircleSide({top:"3rem"})
        this.addController(this.side)

    }
    side:CircleSide
}