import { Shape } from './../shape/Shape';
import { Cell } from "./Cell";
import { canvas2D } from "../Canvas";
import { GAME_CONFIG } from "../game.config";

export class GameMap {

    //------Members------//

    private _map: Cell[][];
    private _shapes: Shape[] = [];
    private _height: number;
    private _width: number;

    //------Properties------//
    
    public get height() : number {
        return this._height;
    }
    
    public get width() : number {
        return this._width;
    }

    //------Constructor------//

    constructor(width: number, height: number) {
        this._map = [];
        this._width = width;
        this._height = height;
    }

    //------Public Methods------//

    public init(): void{
        for(let i: number = 0 ; i < this._height ; i++ ){
            this._map[i] = [];

            for(let j: number = 0 ; j < this._width ; j++){
                this._map[i][j] = undefined;
            }
        }
    }

    public addShape(shape: Shape) {
        this._shapes.push(shape);
        this.cacheShapeCells(shape);
    }

    public isInMap(x: number, y: number) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    public isCellFilled(x: number, y: number): boolean {
        return this.isInMap(x,y) && typeof this._map[y][x] !== 'undefined';
    }

    public moveShape(shape: Shape, x_diff: number, y_diff: number) {
        this.clearShapeCache(shape);
        shape.move(x_diff, y_diff);
        this.cacheShapeCells(shape);
    }

    private clearShapeCache(shape: Shape) {
        shape.cells.forEach(cell => {
            if(this.isInMap(cell.coords.X, cell.coords.Y)) { 
                this._map[cell.coords.Y][cell.coords.X] = undefined
            }
        });
    }

    private cacheShapeCells(shape: Shape) {
        shape.cells.forEach(cell => {
            if(this.isInMap(cell.coords.X, cell.coords.Y)) { 
                this._map[cell.coords.Y][cell.coords.X] = cell
            }
        });
    }

    public anyFilledOnRow(row: number) {
        return this._map[row].some(cell => typeof cell !== 'undefined');
    }

    public removeFilledLines(): number {
            
        let filledLinesCount = 0;

        for (let i = 0 ; i < this._map.length ; i++) {
            const filledLine : boolean = this._map[i].every(cell => typeof cell !== 'undefined');

            if(filledLine) {
                filledLinesCount++;
                this._map[i].forEach(cell => {
                    cell.destroy()
                    if(cell.shape.cells.length === 0) {
                        this.removeShape(cell.shape)
                    }
                });
                this._map.splice(i,1);
                let newRow: undefined[] = [];
                for(let j = 0; j < this._width; j++) {
                    newRow[j] = undefined;
                }
                this._map.unshift(newRow);
            }
        }

        return filledLinesCount;
    }

    public rotateShape(shape: Shape) {
        this.clearShapeCache(shape);
        shape.rotate();
        this.cacheShapeCells(shape);
    }

    public removeShape(shape: Shape) {
        const index = this._shapes.indexOf(shape, 0);

        if (index > -1) {
            this.clearShapeCache(shape);
            this._shapes.splice(index, 1);
        }
    }

    public draw(): void {
        for(let i = 0 ; i < this._map.length ; i++){
            for(let j = 0 ; j < this._map[i].length ; j++){
                const cell: Cell = this._map[i][j];
                if(typeof cell !== 'undefined'){
                    canvas2D.drawRectAtCell(i, j, cell.shape.color, GAME_CONFIG.STROKE_COLOR, GAME_CONFIG.CELL_SIZE);
                }
            }
        }
    }
}