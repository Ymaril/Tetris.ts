import { Vector2 } from './../geom/Vector2';
import { Cell } from './Cell';

interface IShapeAction {
    name: string,
    do: (shape: Shape) => void
}

abstract class ShapeActionMove {
    move(shape: Shape, x: number = 0, y: number = 0) {
        shape.position.addToX(x).addToY(y);
    }
}

class ShapeActionDown extends ShapeActionMove {
    public name = 'down';

    public do(shape: Shape) {
        this.move(shape, 0, 1);
    }
}

class ShapeActionRight extends ShapeActionMove {
    public name = 'right';

    public do(shape: Shape) {
        this.move(shape, 1, 0);
    }
}

class ShapeActionLeft extends ShapeActionMove {
    public name = 'left';

    public do(shape: Shape) {
        this.move(shape, -1, 0);
    }
}

class ShapeActionRotate {
    public name = 'rotate';

    public do(shape: Shape) {
        shape.cells.forEach(cell => {
            const x = cell.coords.X;
            const y = cell.coords.Y;

            let newX = (y + shape.origin.X - shape.origin.Y);
            let newY = (shape.origin.X + shape.origin.Y - x - 1);

            cell.coords = new Vector2(newX, newY);
        });
    }
}

export class Shape {

    //------Members------//

    private _cells: Cell[] = [];
    private _color: string = '';
    private _position: Vector2 = null;
    private _origin: Vector2 = null;
    private _actions: IShapeAction[] = [
        new ShapeActionDown(),
        new ShapeActionLeft(),
        new ShapeActionRight(),
        new ShapeActionRotate()
    ];

    //------Properties------//

    public get cells() : Cell[] {
        return this._cells;
    }
    public set cells(cells : Cell[]) {
        this._cells = cells;
    }

    public get position() : Vector2 {
        return this._position;
    }
    
    public get color() : string {
        return this._color;
    }
    public get origin() : Vector2 {
        return this._origin;
    }

    //------Constructor------//
    
    constructor(cells: Cell[], position: Vector2, color: string, origin: Vector2 = new Vector2(0.5, 0.5)) {
        this._cells = cells;
        this._cells.forEach(cell => cell.shape = this);
        this._position = position;
        this._color = color;
        this._origin = origin;
    }

    //------Public Methods------//

    public do(actionName: string) {
        this._actions.find(action => action.name === actionName).do(this);
    }

    public removeCell(cell: Cell) {
        const index = this._cells.indexOf(cell, 0);

        if (index > -1) {
            this._cells.splice(index, 1);
        }
    }

    public isPartOfShape(cell: Cell) {
        return this._cells.includes(cell);
    }

    public clone(): Shape {
        const newCells = this._cells.map(cell => new Cell(cell.coords));
        
        return new Shape(
            newCells, 
            new Vector2(this._position.X, this._position.Y), 
            this._color, 
            new Vector2(this._origin.X, this._origin.Y)
        ); 
    }
}