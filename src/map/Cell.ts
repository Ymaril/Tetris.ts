import { Vector2 } from "../geom/Vector2";
import { Shape } from "../shape/Shape";

export class Cell {

    //------Members------//

    private _shape : Shape;
    private _coords : Vector2;

    //------Properties------//

    public get shape() : Shape {
        return this._shape;
    }
    public set shape(v : Shape) {
        this._shape = v;
    }

    public get coords() : Vector2 {
        return this._coords;
    }
    public set coords(v : Vector2) {
        this._coords = v;
    }

    //------Constructor------//

    constructor(coords: Vector2, shape?: Shape) {
        this._shape = shape;
        this._coords = coords;

        if(shape) {
            shape.cells.push(this);
        }
    }

    //------Public Methods------//

    public destroy() {
        this._shape.removeCell(this);
    }
}