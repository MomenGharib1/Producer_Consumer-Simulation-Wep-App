import {ShapeInter} from "../Interfaces/ShapeInter";

export class RegularPolygon extends ShapeInter {

  private _Radius: number;
  private _Sides: number;

  constructor(ID: number, X: number, Y: number, Stroke: string, StrokeWidth: number, FillColor: string,
              Alpha: number, RotateAngle: number, Radius: number, Sides: number) {
    super(ID, X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle);
    this._Radius = Radius;
    this._Sides = Sides;
    if (Sides == 3) this.Type = "polygon";
    else if (Sides == 5) this.Type = "polygon";
    else if (Sides == 6) this.Type = "polygon";
  }

  clone(): ShapeInter {
    return new RegularPolygon(-1, this.X, this.Y, this.Stroke, this.StrokeWidth, this.FillColor,
      this.Alpha, this.RotateAngle, this._Radius, this.Sides);
  }

  get Radius(): number {
    return this._Radius;
  }

  set Radius(value: number) {
    this._Radius = value;
  }

  get Sides(): number {
    return this._Sides;
  }

  set Sides(value: number) {
    this._Sides = value;
  }
}
