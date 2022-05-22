import { ShapeType } from "./ShapeType";
import { Vector2 } from "../geom/Vector2";
import { Shape } from "./Shape";
import { Cell } from "../map/Cell";

export class ShapeFactory {

    //------Public Methods------//

    public createShape(shapeType: ShapeType, position: Vector2, color: string, margin: number = 1): Shape {

        let shapeCells: Cell[] = [];
        let shapeOrigin: Vector2;

        switch(shapeType) {
            case ShapeType.I:
                shapeCells = [
                    new Vector2(position.X, position.Y - 1 * margin),
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X, position.Y + 2 * margin)
                ].map(coords => new Cell(coords));
                shapeOrigin = new Vector2(position.X, position.Y);
                break;
            case ShapeType.J:
                shapeCells = [
                    new Vector2(position.X, position.Y - 1 * margin),
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X - 1 * margin, position.Y + 1 * margin),
                ].map(coords => new Cell(coords));
                shapeOrigin = new Vector2(position.X, position.Y);
                break;
            case ShapeType.L:
                shapeCells = [
                    new Vector2(position.X, position.Y - 1 * margin),
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X + 1 * margin, position.Y + 1 * margin),
                ].map(coords => new Cell(coords));
                shapeOrigin = new Vector2(position.X, position.Y);
                break;
            case ShapeType.O:
                shapeCells = [
                    new Vector2(position.X - 1 * margin, position.Y),
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X - 1 * margin, position.Y + 1 * margin),
                ].map(coords => new Cell(coords));
                shapeOrigin = null;
                break;
            case ShapeType.S:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X + 1 * margin, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X - 1 * margin, position.Y + 1 * margin),
                ].map(coords => new Cell(coords));
                shapeOrigin = new Vector2(position.X, position.Y + 1 * margin);
                break;
            case ShapeType.Z:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X - 1 * margin, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X + 1 * margin, position.Y + 1 * margin),
                ].map(coords => new Cell(coords));
                shapeOrigin = new Vector2(position.X, position.Y + 1 * margin);
                break;
            case ShapeType.T:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1 * margin),
                    new Vector2(position.X - 1 * margin, position.Y + 1 * margin),
                    new Vector2(position.X + 1 * margin, position.Y + 1 * margin),
                ].map(coords => new Cell(coords));
                shapeOrigin = new Vector2(position.X, position.Y + 1 * margin);
                break;  
        }

        return new Shape(shapeCells, shapeOrigin, color);
    }
}