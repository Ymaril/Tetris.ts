import { ShapeType } from "./ShapeType";
import { Vector2 } from "../geom/Vector2";
import { Shape } from "./Shape";
import { Cell } from "./Cell";

export class ShapeFactory {

    //------Public Methods------//

    public createShape(shapeType: ShapeType, position: Vector2, color: string): Shape {
        let shapeCells: Cell[] = [];
        let origin: Vector2;

        switch(shapeType) {
            case ShapeType.I:
                shapeCells = [
                    new Vector2(0, -1),
                    new Vector2(0, 0),
                    new Vector2(0, 1),
                    new Vector2(0, 2)
                ].map(coords => new Cell(coords));

                origin = new Vector2(0, 1);
                break;
            case ShapeType.J:
                shapeCells = [
                    new Vector2(0, -1),
                    new Vector2(0, 0),
                    new Vector2(0, 1),
                    new Vector2(-1, 1),
                ].map(coords => new Cell(coords));
                break;
            case ShapeType.L:
                shapeCells = [
                    new Vector2(0, -1),
                    new Vector2(0, 0),
                    new Vector2(0, 1),
                    new Vector2(1, 1),
                ].map(coords => new Cell(coords));
                break;
            case ShapeType.O:
                shapeCells = [
                    new Vector2(-1, 0), 
                    new Vector2(0, 0),
                    new Vector2(0, 1),
                    new Vector2(-1, 1),
                ].map(coords => new Cell(coords));
                origin = new Vector2(0, 1);
                break;
            case ShapeType.S:
                shapeCells = [
                    new Vector2(0, 0),
                    new Vector2(1, 0),
                    new Vector2(0, 1),
                    new Vector2(-1, 1),
                ].map(coords => new Cell(coords));
                break;
            case ShapeType.Z:
                shapeCells = [
                    new Vector2(0, 0),
                    new Vector2(-1, 0),
                    new Vector2(0, 1),
                    new Vector2(1, 1),
                ].map(coords => new Cell(coords));
                break;
            case ShapeType.T:
                shapeCells = [
                    new Vector2(0, 0),
                    new Vector2(0, 1),
                    new Vector2(-1, 1),
                    new Vector2(1, 1),
                ].map(coords => new Cell(coords));

                origin = new Vector2(0.5, 1.5);
                break;  
        }

        return new Shape(shapeCells, new Vector2(position.X, position.Y), color, origin);
    }
}