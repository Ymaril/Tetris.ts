import events = require("events");
import { Vector2 } from "../geom/Vector2";
import { Shape } from "../shape/Shape";

export class Cell extends events.EventEmitter {

    //------Members------//

    private _coords : Vector2;
    private _shape : Shape;

    //------Properties------//

    public get coords() : Vector2 {
        return this._coords;
    }
    public set coords(v : Vector2) {
        this._coords = v;
    }

    public get shape() : Shape {
        return this._shape;
    }
    public set shape(v : Shape) {
        this._shape = v;
    }


    //------Constructor------//

    constructor(coords: Vector2, shape?: Shape) {
        super();
        this._shape = shape;
        this._coords = coords;
    }

    //------Public Methods------//

    public get position() {
        return new Vector2(this.X, this.Y);
    }

    public get X() {
        return this._shape.position.X + this._coords.X;
    }

    public get Y() {
        return this._shape.position.Y + this._coords.Y;
    }

    public move(diff: Vector2) {
        this._coords.add(diff);
        this.emit('move');
    }
}