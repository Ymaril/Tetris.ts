import { Vector2 } from './../geom/Vector2';
import { Cell } from './Cell';

export class Shape {

    //------Members------//

    private _cells: Cell[] = [];
    private _color: string = '';
    private _position: Vector2 = null;
    private _origin: Vector2 = null;

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

    public rotate() {
        this._cells.forEach(cell => {
            const x = cell.coords.X;
            const y = cell.coords.Y;

            let newX = (y + this._origin.X - this._origin.Y);
            let newY = (this._origin.X + this._origin.Y - x - 1);

            cell.coords = new Vector2(newX, newY);
        });
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
        
        return new Shape(newCells, this._position, this._color, this._origin); 
    }

    public move(x: number = 0, y: number = 0) {
        this._position.addToX(x).addToY(y);
    }
}