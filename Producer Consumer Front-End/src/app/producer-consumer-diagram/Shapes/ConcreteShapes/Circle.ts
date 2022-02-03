import {ShapeInter} from "../Interfaces/ShapeInter";

export class Circle extends ShapeInter {
  private _Radius: number;

  public constructor(ID: number, X: number, Y: number, Stroke: string, StrokeWidth: number,
                     FillColor: string, Alpha: number, RotateAngle: number, Radius: number) {
    super(ID, X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle);
    this.Type = "circle";
    this._Radius = Radius;
  }

  clone(): ShapeInter {
    return new Circle(-1, this.X, this.Y, this.Stroke, this.StrokeWidth,
      this.FillColor, this.Alpha, this.RotateAngle, this._Radius);
  }

  get Radius(): number {
    return this._Radius;
  }

  set Radius(value: number) {
    this._Radius = value;
  }
}
