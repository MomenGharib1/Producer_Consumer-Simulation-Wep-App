import {Clone} from "./Clone";

export abstract class ShapeInter implements Clone {
  private readonly _ID: number;
  private _X: number;
  private _Y: number;
  private _Stroke: string;
  private _StrokeWidth: number;
  private _FillColor: string;
  private _Alpha: number;
  private _RotateAngle: number;
  protected _Type: string = "";

  protected constructor(ID: number, X: number, Y: number, Stroke: string, StrokeWidth: number,
                        FillColor: string, Alpha: number, RotateAngle: number) {
    this._ID = ID;
    this._X = X;
    this._Y = Y;
    this._Stroke = Stroke;
    this._StrokeWidth = StrokeWidth;
    this._FillColor = FillColor;
    this._Alpha = Alpha;
    this._RotateAngle = RotateAngle;
  }

  get X(): number {
    return this._X;
  }

  set X(value: number) {
    this._X = value;
  }

  get Y(): number {
    return this._Y;
  }

  set Y(value: number) {
    this._Y = value;
  }

  get Stroke(): string {
    return this._Stroke;
  }

  set Stroke(value: string) {
    this._Stroke = value;
  }

  get StrokeWidth(): number {
    return this._StrokeWidth;
  }

  set StrokeWidth(value: number) {
    this._StrokeWidth = value;
  }

  get FillColor(): string {
    return this._FillColor;
  }

  set FillColor(value: string) {
    this._FillColor = value;
  }

  get ID(): number {
    return this._ID;
  }

  get Type(): string {
    return this._Type;
  }

  set Type(value: string) {
    this._Type = value;
  }

  get RotateAngle(): number {
    return this._RotateAngle;
  }

  set RotateAngle(value: number) {
    this._RotateAngle = value;
  }

  get Alpha(): number {
    return this._Alpha;
  }

  set Alpha(value: number) {
    this._Alpha = value;
  }

  clone(): ShapeInter {
    return this
  }
}
