import { GAME_CONFIG } from './game.config';
import { Vector2 } from './geom/Vector2';
import { Cell } from './shape/Cell';
import { Shape } from './shape/Shape';

class SVG {

    //------Members------//

    private _svg : HTMLElement;
    private _shapes = new Map<Shape, SVGElement>()

    //------Constructor------//

    constructor(svg : HTMLElement) {
        this._svg = svg;
    }

    //------Public Methods------//

    public clear() : void {
        this._svg.innerHTML = '';
    }

    public drawShape(shape: Shape, cellSize: number) {
        if(this._shapes.has(shape)) { return this._shapes.get(shape) }

        const group = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        shape.cells.forEach(cell => {
            const rect = this.drawCell(cell, cellSize, shape.color);

            group.appendChild(rect);
        });

        if(GAME_CONFIG.SHOW_ORIGINS) {
            const origin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            origin.setAttribute("cx", (shape.origin.X * cellSize).toString());
            origin.setAttribute("cy", (shape.origin.Y * cellSize).toString());
            origin.setAttribute("r", '5');
            origin.setAttribute("fill", '#FFFFFF');

            group.appendChild(origin);
        }

        group.setAttribute("x", (shape.position.X * cellSize).toString());
        group.setAttribute("y", (shape.position.Y * cellSize).toString());

        this._svg.appendChild(group);

        this._shapes.set(shape, group);

        return group;
    }

    public drawCell(cell: Cell, cellSize: number, color: string) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", (cell.coords.X * cellSize + cellSize/20).toString());
        rect.setAttribute("y", (cell.coords.Y * cellSize + cellSize/20).toString());
        rect.setAttribute("width", (cellSize - cellSize/10).toString());
        rect.setAttribute("height", (cellSize - cellSize/10).toString());
        rect.setAttribute("ry", (cellSize/10).toString());
        rect.setAttribute("rx", (cellSize/10).toString());
        rect.setAttribute("fill", color);
        g.appendChild(rect);

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
            
            highlight.setAttribute("d", path);
            highlight.setAttribute("fill", '#F0F0F0');
            highlight.setAttribute("fill-opacity", '0.40');

            g.appendChild(highlight);
        }

        return g;
    }

    public updateShape(shape: Shape, cellSize: number) {
        if(this._shapes.has(shape)) {
            const group = this._shapes.get(shape);
            group.setAttribute("y", (shape.position.Y * cellSize).toString());
            group.setAttribute("x", (shape.position.X * cellSize).toString());
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
            
            group.innerHTML = ''

            shape.cells.forEach(cell => {
                const rect = this.drawCell(cell, cellSize, shape.color);
    
                group.appendChild(rect);
            });

            if(GAME_CONFIG.SHOW_ORIGINS) {
                const origin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                origin.setAttribute("cx", (shape.origin.X * cellSize).toString());
                origin.setAttribute("cy", (shape.origin.Y * cellSize).toString());
                origin.setAttribute("r", '5');
                origin.setAttribute("fill", '#FFFFFF');
        
                group.appendChild(origin);
            }

            group.setAttribute("x", (shape.position.X * cellSize).toString());
            group.setAttribute("y", (shape.position.Y * cellSize).toString());
        }
    }
}

const svgElement : HTMLElement = document.getElementById('game') as HTMLElement;
export const SVGContext = new SVG(svgElement);
