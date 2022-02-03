import Konva from "konva";
import Shape = Konva.Shape;
import {ShapeInter} from "../../Shapes/Interfaces/ShapeInter";

export interface Builder {
  GetKonva(): Shape;

  GetShape(): ShapeInter;
}
