import {Builder} from "./Builder";
import Konva from "konva";
import {RegularPolygon} from "../../Shapes/ConcreteShapes/RegularPolygon";

export class RegularPolygonBuilder implements Builder {
  Konva: Konva.RegularPolygon = new Konva.RegularPolygon();
  Shape: any;

  constructor(Sides: number, Stroke = "black", StrokeWidth = 0,
              FillColor = "#841717", Alpha = 1, RotateAngle = 45, Radius = 75) {
    this.BuildKonva(Sides, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, Radius);
    this.BuildShape()
  }

  private BuildKonva(Sides: number, Stroke: string, StrokeWidth: number,
                     FillColor: string, Alpha: number, RotateAngle: number, Radius: number) {
    this.Konva.setAttrs({
      sides: Sides,
      radius: Radius,
      fill: FillColor,
      stroke: Stroke,
      alpha: Alpha,
      rotation: RotateAngle,
      strokeWidth: StrokeWidth,
      shadowBlur: 10,
    })
  }

  private BuildShape() {
    this.Shape = new RegularPolygon(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.radius(), this.Konva.sides());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
