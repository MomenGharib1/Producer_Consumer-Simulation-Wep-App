import {Builder} from "./Builder";
import {Circle} from "../../Shapes/ConcreteShapes/Circle";
import Konva from "konva";

export class CircleBuilder implements Builder {
  Konva: Konva.Circle = new Konva.Circle;
  Shape: any;

  constructor(Stroke = "black", StrokeWidth = 0, FillColor = "#efa610",
              Alpha = 1, RotateAngle = 0, Radius = 50) {
    this.BuildKonva(Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, Radius);
    this.BuildShape()
  }

  private BuildKonva(Stroke: string, StrokeWidth: number, FillColor: string,
                     Alpha: number, RotateAngle: number, Radius: number) {
    this.Konva.setAttrs({
      fill: FillColor,
      stroke: Stroke,
      strokeWidth: StrokeWidth,
      radius: Radius,
      alpha: Alpha,
      rotation: RotateAngle,
      shadowBlur: 20,
      shadowOpacity: 0.5
    })
  }

  private BuildShape() {
    this.Shape = new Circle(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.radius());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
