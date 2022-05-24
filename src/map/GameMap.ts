import { Shape } from './../shape/Shape';
import { Cell } from "../shape/Cell";
import events = require('events');
import { Vector2 } from '../geom/Vector2';

export class GameMap extends events.EventEmitter {

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
        super();
        this.init();
        this._width = width;
        this._height = height;
    }

    //------Public Methods------//

    public init(): void{
        this._map = [];
        
        for(let i: number = 0 ; i < this._height ; i++ ){
            this._map[i] = [];

            for(let j: number = 0 ; j < this._width ; j++){
                this._map[i][j] = undefined;
            }
        }
    }

    public addShape(shape: Shape) {
        this._shapes.push(shape);
        this.emit('newShape', shape);
        this.cacheShapeCells(shape);
    }

    public isInMap(coords: Vector2) {
        const [x, y] = [coords.X, coords.Y];

        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    public getCell(coords: Vector2) : Cell {
        if(this.isInMap(coords) && typeof this._map[coords.Y][coords.X] !== 'undefined') {
            return this._map[coords.Y][coords.X];
        }
    }

    public isCellFilled(coords: Vector2): boolean {
        return !!this.getCell(coords);
    }

    public moveShape(shape: Shape, x_diff: number, y_diff: number) {
        this.clearShapeCache(shape);
        shape.move(x_diff, y_diff);
        this.cacheShapeCells(shape);

        this.emit('moveShape', shape);
    }

    private clearShapeCache(shape: Shape) {
        shape.cells.forEach(cell => {
            if(this.isInMap(cell.position)) { 
                this._map[cell.Y][cell.X] = undefined
            }
        });
    }

    private cacheShapeCells(shape: Shape) {
        shape.cells.forEach(cell => {
            if(this.isInMap(cell.position)) { 
                this._map[cell.Y][cell.X] = cell
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
                    const cellShape = this._shapes.find(shape => shape.cells.includes(cell));
                    cellShape.removeCell(cell);
                    this.emit('changeShape', cellShape);
                    
                    if(cellShape.cells.length === 0) {
                        this.removeShape(cellShape)
                        this.emit('destroyShape', cellShape);
                    }
                });

                for(let line = 0; line < i; line++) {
                    this._map[line].forEach(cell => {
                        if(cell) { 
                            cell.coords.addToY(1);
                            this.emit('changeShape', cell.shape);
                        }
                    });
                }

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
        this.emit('rotateShape', shape);
    }

    public removeShape(shape: Shape) {
        const index = this._shapes.indexOf(shape, 0);

        if (index > -1) {
            this.clearShapeCache(shape);
            this._shapes.splice(index, 1);
        }
    }
}