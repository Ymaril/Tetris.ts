import { ShapeType } from './ShapeType';
import { Vector2 } from './../geom/Vector2';
import { Cell } from '../map/Cell';

export class Shape {

    //------Members------//

    private _cells: Cell[] = [];
    private _color: string = '';
    private _origin: Vector2 = null;
    private _fixed: boolean = false;

    //------Properties------//

    public get cells() : Cell[] {
        return this._cells;
    }
    public set cells(cells : Cell[]) {
        this._cells = cells;
    }

    public get origin() : Vector2 {
        return this._origin;
    }
    
    public get color() : string {
        return this._color;
    }

    //------Constructor------//
    
    constructor(cells: Cell[], origin: Vector2, color: string) {
        this._cells = cells;
        this._cells.forEach(cell => cell.shape = this)
        this._origin = origin;
        this._color = color;
        this._origin = origin;
    }

    //------Public Methods------//

    public rotate() {
        if(!this._fixed) {
            this._cells.forEach(cell => {
                let x = cell.coords.X - this._origin.X;
                let y = cell.coords.Y - this._origin.Y;
                let newX = -y;
                let newY = x;

                cell.coords = new Vector2(this._origin.X + newX, this._origin.Y + newY);
            });
        }
    }

    public removeCell(cell: Cell) {
        const index = this._cells.indexOf(cell, 0);

        if (index > -1) {
            this._cells.splice(index, 1);
        }
    }

    public fix() : boolean {
        return this._fixed = true;
    }
    public get isFixed() : boolean {
        return this._fixed;
    }

    public isPartOfShape(cell: Vector2) {
        return this._cells.some(shapeCell => shapeCell.coords.X === cell.X && shapeCell.coords.Y === cell.Y);
    }

    public move(x: number = 0, y: number = 0) {
        if(!this._fixed) {
            if(this._origin){
                this._origin.addToX(x).addToY(y);
            }
            
            this.cells.forEach(cell => cell.coords.addToX(x).addToY(y));
        }
    }
}