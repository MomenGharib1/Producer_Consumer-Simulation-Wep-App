import {CircleBuilder} from "../Builder/CircleBuilder";
import {ShapeDirector} from "./ShapeDirector";
import {RegularPolygonBuilder} from "../Builder/RegularPolygonBuilder";

export class DefaultDirector extends ShapeDirector {
  public constructCircle() {
    this.smallBuilder = new CircleBuilder();
  }

  public constructPolygon(Sides: number) {
    this.smallBuilder = new RegularPolygonBuilder(Sides);
  }
}
