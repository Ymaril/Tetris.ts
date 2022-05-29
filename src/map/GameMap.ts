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
        this._width = width;
        this._height = height;
        this.init();
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

    public addShape(shape: Shape): boolean {
        if(!this.isShapeValidPlace(shape)) { return false; }

        this._shapes.push(shape);
        shape.on('empty', () => this.removeShape(shape));
        this.emit('newShape', shape);
        this.cacheShapeCells(shape);
        
        return true;
    }

    public doShapeAction(shape: Shape, actionName: string) {
        const propableShape = shape.clone();
        propableShape.do(actionName);

        if(this.isShapeValidPlace(propableShape, shape)) {
            this.clearShapeCache(shape);
            shape.do(actionName);
            this.cacheShapeCells(shape);
            
            return true;
        }
        else {
            return false;
        }
    }

    public removeShape(shape: Shape) {
        const index = this._shapes.indexOf(shape, 0);

        if (index > -1) {
            this.clearShapeCache(shape);
            this._shapes.splice(index, 1);
            this.emit('removeShape', shape);
        }
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

    private isShapeValidPlace(shape: Shape, ignoreShape?: Shape): boolean {
        return shape.cells.every(cell => {
            if(!this.isInMap(cell.position)) { return false; }

            const collisionCell = this.getCell(cell.position);

            if(collisionCell) {
                if(ignoreShape) {
                    return ignoreShape.isPartOfShape(collisionCell);
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });
    }

    public removeFilledLines(): number {
        let filledLinesCount = 0;

        for (let i = 0 ; i < this._map.length ; i++) {
            const filledLine : boolean = this._map[i].every(cell => typeof cell !== 'undefined');

            if(filledLine) {
                filledLinesCount++;
                this.removeLine(i);
            }
        }

        return filledLinesCount;
    }

    private removeLine(i: number) {
        this._map[i].forEach(cell => {
            const cellShape = this._shapes.find(shape => shape.isPartOfShape(cell));
            cellShape.removeCell(cell);
        });

        for(let line = 0; line < i; line++) {
            this._map[line].forEach(cell => {
                if(cell) { 
                    cell.move(new Vector2(0, 1));
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