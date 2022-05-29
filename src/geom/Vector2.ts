
export class Vector2 {

    //------Members------//

    private _x: number;
    private _y: number;

    //------Constructor------//

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    //------Properties------//

    get X() {
        return this._x;
    }
    
    get Y() {
        return this._y;
    }

    static get Zero() {
        return new Vector2(0, 0);
    }

    //------Public Methods------//

    public addX(x: number): Vector2 {
        return new Vector2(this._x, this._y).addToX(x);
    }

    public addY(y: number): Vector2 {
        return new Vector2(this._x, this._y).addToY(y);
    }

    public addToX(x: number): Vector2 {
        this._x += x;
        return this;
    }

    public addToY(y: number): Vector2 {
        this._y += y;
        return this;
    }

    public add(vector: Vector2): Vector2{
        this.addToX(vector.X);
        this.addToY(vector.Y);
        return this;
    }
}