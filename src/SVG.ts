import { GAME_CONFIG } from './game.config';
import { Vector2 } from './geom/Vector2';
import { Cell } from './shape/Cell';
import { Shape } from './shape/Shape';
import { SVG, extend as SVGextend, Element as SVGElement, Svg, Gradient } from '@svgdotjs/svg.js'

class MapView {

    //------Members------//

    private _svg : Svg;
    private _shapes = new Map<Shape, Svg>()
    private _gradients: Gradient[] = []

    //------Constructor------//

    constructor(svg : HTMLElement) {
        this._svg = SVG().addTo('#game').height('100%');

        this._gradients = [
            ['#8E2DE2', '#4A00E0'],
            ['#EC6F66', '#F3A183'],
            ['#514A9D', '#24C6DC'],
            ['#232526', '#414345'],
            ['#1CD8D2', '#93EDC7'],
            ['#EB3349', '#F45C43'],
            ['#AA076B', '#61045F']
        ].map(([startColor, endColor]) => {

            return this._svg.gradient('linear', function(add) {
                add.stop(0, startColor)
                add.stop(1, endColor)
                add.from(0, 0).to(1, 1)
            })
        })
    }

    //------Public Methods------//

    public drawShape(shape: Shape, cellSize: number) {
        if(this._shapes.has(shape)) { return this._shapes.get(shape) }

        const group = this._svg.nested();

        shape.cells.forEach(cell => {
            const rect = this.drawCell(group, cell, cellSize, shape.color);
        });

        // if(GAME_CONFIG.SHOW_ORIGINS) {
        //     const origin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        //     origin.setAttribute("cx", (shape.origin.X * cellSize).toString());
        //     origin.setAttribute("cy", (shape.origin.Y * cellSize).toString());
        //     origin.setAttribute("r", '5');
        //     origin.setAttribute("fill", '#FFFFFF');

        //     group.appendChild(origin);
        // }

        group.x(shape.position.X * cellSize).y(shape.position.Y * cellSize);

        this._shapes.set(shape, group);

        return group;
    }

    public drawCell(group: Svg, cell: Cell, cellSize: number, color: number) {
        group
            .rect(cellSize - cellSize/10, cellSize - cellSize/10)
            .radius(cellSize/10)
            .x(cell.coords.X * cellSize + cellSize/20)
            .y(cell.coords.Y * cellSize + cellSize/20)
            .fill(this._gradients[color])

        const upper = cell.shape.cells.find(upCell => cell.coords.X === upCell.coords.X && cell.coords.Y - 1 === upCell.coords.Y);

        if(!upper) {
            const highlight = document.createElementNS("http://www.w3.org/2000/svg", "path");

            const path = [
                {
                    command: 'M',
                    coords: new Vector2(0, 0)
                },
                {
                    command: 'L',
                    coords: new Vector2(cellSize/5, cellSize/5)
                },
                {
                    command: 'L',
                    coords: new Vector2(cellSize - cellSize/5, cellSize/5)
                },
                {
                    command: 'L',
                    coords: new Vector2(cellSize, 0)
                },
                {
                    command: 'L',
                    coords: new Vector2(0, 0)
                },
            ].map(c => `${c.command}${(cell.coords.X * cellSize) + c.coords.X} ${(cell.coords.Y * cellSize) + c.coords.Y}`).join(' ')
            
            group.path(path).fill({color: '#ffffff', opacity: 0.4})
        }
    }

    public updateShape(shape: Shape, cellSize: number) {
        if(this._shapes.has(shape)) {
            const group = this._shapes.get(shape);
            const x = parseInt(group.x().toString());
            const y = parseInt(group.y().toString());
            const newX = shape.position.X * cellSize;
            const newY = shape.position.Y * cellSize;

            const time = 2000/Math.sqrt(((x - newX) ** 2) + ((y - newY) ** 2))
            
            group.animate(time).ease('<>').move(newX, newY)
        }
    }

    public destroyShape(shape: Shape) {
        if(this._shapes.has(shape)) {
            const group = this._shapes.get(shape);
            group.remove();
            this._shapes.delete(shape);
        }
    }

    public redrawShape(shape: Shape, cellSize: number) {
        if(this._shapes.has(shape)) {
            const group = this._shapes.get(shape);
            
            group.clear()

            shape.cells.forEach(cell => {
                this.drawCell(group, cell, cellSize, shape.color);
            });

            // if(GAME_CONFIG.SHOW_ORIGINS) {
            //     const origin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            //     origin.setAttribute("cx", (shape.origin.X * cellSize).toString());
            //     origin.setAttribute("cy", (shape.origin.Y * cellSize).toString());
            //     origin.setAttribute("r", '5');
            //     origin.setAttribute("fill", '#FFFFFF');
    
            //     group.appendChild(origin);
            // }

            group.x(shape.position.X * cellSize).y(shape.position.Y * cellSize);
        }
    }
}

const svgElement : HTMLElement = document.getElementById('game') as HTMLElement;
export const SVGContext = new MapView(svgElement);
