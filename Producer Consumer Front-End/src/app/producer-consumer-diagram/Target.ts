import Konva from "konva";

export class Target {
  private _name: string;
  private _id: string;
  private _x: number;
  private _y: number;
  private _products: Konva.RegularPolygon[] = [];

  constructor(name: string, id: string, x: number, y: number) {
    this._name = name;
    this._id = id;
    this._x = x;
    this._y = y;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get products(): Konva.RegularPolygon[] {
    return this._products;
  }

  set products(value: Konva.RegularPolygon[]) {
    this._products = value;
  }
}
