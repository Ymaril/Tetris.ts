import { GAME_CONFIG } from './game.config';
import { keyboard } from './input/Keyboard';
import { Vector2 } from './geom/Vector2';
import { Shape } from './shape/Shape';
import { ShapeType } from './shape/ShapeType';
import { GameMap } from './map/GameMap';
import { ShapeFactory } from './shape/ShapeFactory';
import { SVGContext } from './SVG';

export class GameWorld {

    //------Members------//

    private _map: GameMap;
    private _updateEveryXFrames: number;
    private _frame: number;
    private _shapeTypesQueue: ShapeType[] = [];
    private _score: number;
    private _gameOver : boolean;
    private _shapeFactory: ShapeFactory;
    private _movingShape: Shape = null;

    private _shapeTypes: ShapeType[] = [
        ShapeType.I,
        ShapeType.J,
        ShapeType.L,
        ShapeType.O,
        ShapeType.S,
        ShapeType.Z,
        ShapeType.T
    ];

    //------Properties------//
    
    public get gameOver() : boolean {
        return this._gameOver;
    }

    public get score() : number {
        return this._score;
    }
    
    //------Constructor------//

    constructor(width: number, height: number) {
        this._shapeFactory = new ShapeFactory();
        this._map = new GameMap(width, height);
        this._map.on('newShape', (shape: Shape) => {
            SVGContext.drawShape(shape, GAME_CONFIG.CELL_SIZE);
        });
        this._map.on('leftShape', (shape: Shape) => {
            SVGContext.updateShape(shape, GAME_CONFIG.CELL_SIZE);
        });
        this._map.on('rightShape', (shape: Shape) => {
            SVGContext.updateShape(shape, GAME_CONFIG.CELL_SIZE);
        });
        this._map.on('downShape', (shape: Shape) => {
            SVGContext.updateShape(shape, GAME_CONFIG.CELL_SIZE);
        });
        this._map.on('rotateShape', (shape: Shape) => {
            SVGContext.redrawShape(shape, GAME_CONFIG.CELL_SIZE);
        });
        this._map.on('changeShape', (shape: Shape) => {
            SVGContext.redrawShape(shape, GAME_CONFIG.CELL_SIZE);
        });
        this._map.on('destroyShape', (shape: Shape) => {
            SVGContext.destroyShape(shape);
        });
        this.init();
    }

    //------Private Methods------//

    private increaseScore(toAdd: number) : void {
        this._score += toAdd;
    }

    private handleInput(): void {
        if(keyboard.isPressed(GAME_CONFIG.UP_KEY)) {
            this._map.doShapeAction(this._movingShape, 'rotate');
        }
        else if (keyboard.isPressed(GAME_CONFIG.DOWN_KEY)) {
            this._map.doShapeAction(this._movingShape, 'down');
            this.increaseScore(GAME_CONFIG.LOWERED_SHAPE_BONUS);
        }
        else if (keyboard.isPressed(GAME_CONFIG.LEFT_KEY)) {
            this._map.doShapeAction(this._movingShape, 'left');
        }
        else if (keyboard.isPressed(GAME_CONFIG.RIGHT_KEY)) {
            this._map.doShapeAction(this._movingShape, 'right');
        }
    }

    private handleFilledLines(): void {
        
        let filledLinesCount = this._map.removeFilledLines();

        if(filledLinesCount > 0) {
            this.increaseScore(filledLinesCount * GAME_CONFIG.FILLED_LINE_BONUS);

            if(this._updateEveryXFrames > 0) {
                this._updateEveryXFrames--;
            }
        }
    }

    private generateRandomShapeType(): ShapeType {
        const index = Math.floor(Math.random() * this._shapeTypes.length);
        
        return this._shapeTypes[index];
    }

    private buildShape(type: ShapeType): Shape {
        const randomShapeTypeIndex = Math.floor(Math.random() * 7);
        let shapeColor = GAME_CONFIG.SHAPE_COLORS[randomShapeTypeIndex];
        
        return this._shapeFactory.createShape(
                    type, 
                    new Vector2(Math.floor(this._map.width / 2), 3),
                    randomShapeTypeIndex
                );
    }

    // private drawShapesInQueue(): void {
    //     canvas2D.drawText(
    //             GAME_CONFIG.NEXT_SHAPE_LABEL, 
    //             GAME_CONFIG.NEXT_SHAPE_LABEL_FONT, 
    //             GAME_CONFIG.FONT_COLOR, 
    //             GAME_CONFIG.NEXT_SHAPE_LABEL_POSITION,
    //             GAME_CONFIG.NEXT_SHAPE_LABEL_POSITION.ALIGNMENT
    //         );
        
    //     for(let i = this._shapeTypesQueue.length - 1; i >= 0; i--){
    //         let shapeType = this._shapeTypesQueue[i];
    //         let indexFromEnd = this._shapeTypesQueue.length - 1 - i;
    //         let demoShape = this._shapeFactory.createShape(
    //                 shapeType, 
    //                 new Vector2(
    //                     GAME_CONFIG.NEXT_SHAPE_POSITION.X + indexFromEnd * 4 * GAME_CONFIG.NEXT_SHAPE_CELL_SIZE, 
    //                     GAME_CONFIG.NEXT_SHAPE_POSITION.Y),
    //                 GAME_CONFIG.SHAPE_COLORS[shapeType],
    //                 GAME_CONFIG.NEXT_SHAPE_CELL_SIZE
    //             );

    //         demoShape.cells.forEach(cell => 
    //             canvas2D.drawRect(
    //                     cell.coords, 
    //                     demoShape.color, 
    //                     GAME_CONFIG.STROKE_COLOR, 
    //                     GAME_CONFIG.NEXT_SHAPE_CELL_SIZE,
    //                     GAME_CONFIG.NEXT_SHAPE_CELL_SIZE
    //                 )
    //             );
    //     }
    // }

    // private drawScore(): void {
    //     canvas2D.drawText(
    //             GAME_CONFIG.SCORE_LABEL + this._score.toString(), 
    //             GAME_CONFIG.SCORE_LABEL_FONT, 
    //             GAME_CONFIG.FONT_COLOR, 
    //             GAME_CONFIG.SCORE_LABEL_POSITION,
    //             GAME_CONFIG.SCORE_LABEL_POSITION.ALIGNMENT
    //         );
    // }

    //------Public Methods------//

    public init(): void {
        this._gameOver = false;
        this._score = 0;
        this._frame = 0; 
        this._updateEveryXFrames = GAME_CONFIG.UPDATE_AFTER_X_FRAMES;
        this._map.init();
        const newShapeType: ShapeType = this.generateRandomShapeType();
        this._shapeTypesQueue = [newShapeType];
        this._movingShape = this.buildShape(this.generateRandomShapeType());

        this._map.addShape(this._movingShape);
    }

    public update(): void {
        this.handleInput();
        if(++this._frame % this._updateEveryXFrames) {
            return;
        }
        if(!this._map.doShapeAction(this._movingShape, 'down')) {
            this.handleFilledLines();

            const newShapeType: ShapeType = this.generateRandomShapeType();
            this._shapeTypesQueue.unshift(newShapeType);
            this._movingShape = this.buildShape(this._shapeTypesQueue.pop());
            
            this._gameOver = !this._map.addShape(this._movingShape);
        }
    }

    public draw(): void {
        // this.drawScore();
        // this.drawShapesInQueue();
    }
}