export abstract class ShapeDirector {
  protected smallBuilder: any;

  public GetKonva() {
    return this.smallBuilder.GetKonva();
  }

  public GetShape() {
    return this.smallBuilder.GetShape();
  }
}
