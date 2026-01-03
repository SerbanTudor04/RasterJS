/*
 * RASTERJS SOURCE-AVAILABLE LICENSE
 * * Copyright (c) 2025-2026 Serban Tudor Gabriel
 * Repository: https://github.com/SerbanTudor04/RasterJS
 * Last Updated: 03-01-2026
 *
 * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
 *
 * 1. DEFINITIONS
 * "Software" refers to the code and documentation files associated with the RasterJS repository.
 * "Author" refers to Serban Tudor Gabriel.
 *
 * 2. GRANT OF LICENSE
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * Software, to use, copy, modify, and merge the Software for personal, educational, 
 * or non-profit purposes, subject to the conditions listed below.
 *
 * 3. RESTRICTIONS ON COMMERCIAL USE
 * The Software may NOT be used, directly or indirectly, for commercial purposes or by 
 * any commercial entity to generate revenue or profit. This includes, but is not limited 
 * to, using the Software as part of a paid service, a proprietary product, or internal 
 * commercial tooling.
 *
 * 4. RESTRICTIONS ON ARTIFICIAL INTELLIGENCE (AI)
 * The Software and its source code explicitly may NOT be used for:
 * a) Training, fine-tuning, or grounding any Artificial Intelligence (AI) or Machine Learning (ML) models.
 * b) Indexing by AI-based crawlers or scrapers for the purpose of data ingestion.
 * c) Generating derivative works through AI mechanisms.
 *
 * 5. ATTRIBUTION
 * The above copyright notice, repository link, and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 *
 * 6. DISCLAIMER OF WARRANTY
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class Statics {
    static SELECT_ICON = 'media/select.svg';
    static RECT_ICON = 'media/rect.svg';
    static LINE_ICON = 'media/line.svg';
    static TRIANGLE_ICON = 'media/triangle.svg';
    static PEN_ICON = 'media/pen.svg';
    static CARET_DOWN_ICON = 'media/caret-down.svg';
    static ELLIPSE_ICON = 'media/ellipse.svg';
    static CIRCLE_ICON = 'media/circle.svg';
}

class Drawable {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
        this.scale = { x: 1, y: 1 };
        this.name = null;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setRotation(angle) {
        this.rotation = angle;
    }

    setScale(sx, sy) {
        this.scale.x = sx;
        this.scale.y = sy;
    }

    draw(ctx) {}

    isPointInside(x, y) {
        return false;
    }

    getHandleAtPoint(x, y) {
        return -1;
    }
}


class HandleDrawable extends Drawable {
    constructor() {
        super();
        this.width = 0;
        this.height = 0;
        this.fillColor = '#ffffff';
        this.strokeColor = '#000000';
        this.lineWidth = 2;
        this.handleSize = 8;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

    isPointInside(x, y) {
        let halfWidth = (this.width * this.scale.x) / 2;
        let halfHeight = (this.height * this.scale.y) / 2;

        let left = this.position.x - halfWidth;
        let right = this.position.x + halfWidth;
        let top = this.position.y - halfHeight;
        let bottom = this.position.y + halfHeight;

        return (x >= left && x <= right && y >= top && y <= bottom);
    }

    drawHandles(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        let halfW = this.width / 2;
        let halfH = this.height / 2;
        let handleOffset = this.handleSize / 2;

        let handles = [
            { x: -halfW, y: -halfH }, // top-left
            { x: 0, y: -halfH }, // top
            { x: halfW, y: -halfH }, // top-right
            { x: -halfW, y: 0 }, // left
            { x: halfW, y: 0 }, // right
            { x: -halfW, y: halfH }, // bottom-left
            { x: 0, y: halfH }, // bottom
            { x: halfW, y: halfH } // bottom-right
        ];

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        for (let handle of handles) {
            ctx.fillRect(
                handle.x - handleOffset,
                handle.y - handleOffset,
                this.handleSize, this.handleSize);
            ctx.strokeRect(
                handle.x - handleOffset,
                handle.y - handleOffset,
                this.handleSize, this.handleSize);
        }

        ctx.restore();
    }

    getHandleAtPoint(x, y) {
        let halfW = this.width / 2;
        let halfH = this.height / 2;
        let halfHandle = this.handleSize / 2;
        let left = this.position.x - halfW;
        let right = this.position.x + halfW;
        let top = this.position.y - halfH;
        let bottom = this.position.y + halfH;
        if (x >= left - halfHandle && x <= left + halfHandle &&
            y >= top - halfHandle && y <= top + halfHandle
        ) return 'top-left';

        if (x >= this.position.x - halfHandle && x <= this.position.x + halfHandle &&
            y >= top - halfHandle && y <= top + halfHandle
        ) return 'top';

        if (x >= right - halfHandle && x <= right + halfHandle &&
            y >= top - halfHandle && y <= top + halfHandle
        ) return 'top-right';

        if (x >= left - halfHandle && x <= left + halfHandle &&
            y >= this.position.y - halfHandle && y <= this.position.y + halfHandle
        ) return 'left';

        if (x >= right - halfHandle && x <= right + halfHandle &&
            y >= this.position.y - halfHandle && y <= this.position.y + halfHandle
        ) return 'right';

        if (x >= left - halfHandle && x <= left + halfHandle &&
            y >= bottom - halfHandle && y <= bottom + halfHandle
        ) return 'bottom-left';

        if (x >= this.position.x - halfHandle && x <= this.position.x + halfHandle &&
            y >= bottom - halfHandle && y <= bottom + halfHandle
        ) return 'bottom';

        if (x >= right - halfHandle && x <= right + halfHandle &&
            y >= bottom - halfHandle && y <= bottom + halfHandle
        ) return 'bottom-right';

        if (this.isPointInside(x, y)) return 'body';

        return null;
    }

    toSVG() {
        return '';
    }
}

class Rectangle extends HandleDrawable {
    handleSize = 8;

    constructor(width, height, fillColor, strokeColor, lineWidth) {
        super();
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }


    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.fillStyle = this.fillColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        if (this.lineWidth > 0) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }

    toSVG() {
        const degree = this.rotation * (180 / Math.PI);

        return `
        <g transform="translate(${this.position.x}, ${this.position.y}) rotate(${degree}) scale(${this.scale.x}, ${this.scale.y})">
            <rect 
                x="${-this.width / 2}" 
                y="${-this.height / 2}" 
                width="${this.width}" 
                height="${this.height}" 
                fill="${this.fillColor}" 
                stroke="${this.strokeColor}" 
                stroke-width="${this.lineWidth}"
            />
        </g>`;
    }

}

class Line extends HandleDrawable {
    constructor(width, height, strokeColor, lineWidth) {
        super();
        this.width = width;
        this.height = height;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
        this.fillColor = 'transparent';
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.stroke();

        ctx.restore();
    }
    toSVG() {
        const degree = this.rotation * (180 / Math.PI);

        return `
        <g transform="translate(${this.position.x}, ${this.position.y}) rotate(${degree}) scale(${this.scale.x}, ${this.scale.y})">
            <line 
                x1="${-this.width / 2}" y1="${-this.height / 2}" 
                x2="${this.width / 2}" y2="${this.height / 2}" 
                stroke="${this.strokeColor}" 
                stroke-width="${this.lineWidth}" 
                stroke-linecap="round"
            />
        </g>`;
    }
}

class Triangle extends HandleDrawable {
    constructor(width, height, fillColor, strokeColor, lineWidth) {
        super();
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2); // Top
        ctx.lineTo(this.width / 2, this.height / 2); // Bottom Right
        ctx.lineTo(-this.width / 2, this.height / 2); // Bottom Left
        ctx.closePath();

        ctx.fillStyle = this.fillColor;
        ctx.fill();

        if (this.lineWidth > 0) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }

        ctx.restore();
    }
    toSVG() {
        const degree = this.rotation * (180 / Math.PI);

        const p1 = `0,${-this.height / 2}`;
        const p2 = `${this.width / 2},${this.height / 2}`;
        const p3 = `${-this.width / 2},${this.height / 2}`;

        return `
        <g transform="translate(${this.position.x}, ${this.position.y}) rotate(${degree}) scale(${this.scale.x}, ${this.scale.y})">
            <polygon 
                points="${p1} ${p2} ${p3}" 
                fill="${this.fillColor}" 
                stroke="${this.strokeColor}" 
                stroke-width="${this.lineWidth}"
            />
        </g>`;
    }
}

class Polyline extends Drawable {
    constructor(strokeColor, lineWidth) {
        super();
        this.points = [];
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
        this.fillColor = 'transparent';
    }
    addPoint(x, y) {
        this.points.push({ x: x, y: y });
    }

    draw(ctx) {
        if (this.points.length < 2) return;

        ctx.save();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();

        ctx.restore();
    }

    getBounds() {
        if (this.points.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }

        let minX = this.points[0].x;
        let minY = this.points[0].y;
        let maxX = this.points[0].x;
        let maxY = this.points[0].y;

        for (let i = 1; i < this.points.length; i++) {
            minX = Math.min(minX, this.points[i].x);
            minY = Math.min(minY, this.points[i].y);
            maxX = Math.max(maxX, this.points[i].x);
            maxY = Math.max(maxY, this.points[i].y);
        }

        return { minX, minY, maxX, maxY };
    }

    isPointInside(x, y) {
        const bounds = this.getBounds();
        const buffer = 5;

        return (x >= bounds.minX - buffer && x <= bounds.maxX + buffer &&
            y >= bounds.minY - buffer && y <= bounds.maxY + buffer);
    }

    getHandleAtPoint(x, y) {
        if (this.isPointInside(x, y)) {
            return 'body';
        }
        return null;
    }

    setPosition(x, y) {
        const bounds = this.getBounds();
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        for (const point of this.points) {
            point.x += deltaX;
            point.y += deltaY;
        }

    }
    drawHandles(ctx) {
        const bounds = this.getBounds();
        const padding = 5;

        ctx.save();


        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);


        ctx.strokeRect(
            bounds.minX - padding,
            bounds.minY - padding,
            (bounds.maxX - bounds.minX) + padding * 2,
            (bounds.maxY - bounds.minY) + padding * 2
        );

        ctx.restore();
    }

    toSVG() {
        if (this.points.length < 2) return '';

        const pointsString = this.points.map(p => `${p.x},${p.y}`).join(' ');

        return `
            <polyline 
                points="${pointsString}" 
                fill="none" 
                stroke="${this.strokeColor}" 
                stroke-width="${this.lineWidth}" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            />`;
    }

}

class Ellipse extends HandleDrawable {
    handleSize = 8;
    constructor(width, height, fillColor, strokeColor, lineWidth) {
        super();
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.beginPath();
        ctx.ellipse(0, 0, Math.abs(this.width / 2), Math.abs(this.height / 2), 0, 0, 2 * Math.PI);

        ctx.fillStyle = this.fillColor;
        ctx.fill();

        if (this.lineWidth > 0) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }

        ctx.restore();
    }

    toSVG() {
        const degree = this.rotation * (180 / Math.PI);
        return `
        <g transform="translate(${this.position.x}, ${this.position.y}) rotate(${degree}) scale(${this.scale.x}, ${this.scale.y})">
            <ellipse 
                cx="0" 
                cy="0" 
                rx="${Math.abs(this.width / 2)}" 
                ry="${Math.abs(this.height / 2)}" 
                fill="${this.fillColor}" 
                stroke="${this.strokeColor}" 
                stroke-width="${this.lineWidth}"
            />
        </g>`;
    }
}

class Circle extends Ellipse {
    constructor(diameter, fillColor, strokeColor, lineWidth) {
        super(diameter, diameter, fillColor, strokeColor, lineWidth);
    }
}

class ContextMenuItem {
    context_menu = null;
    name = null;
    id = null;
    formated_name = null;
    element = null;
    hiddeable = false;
    callback = null;
    constructor(_context_menu, _name, _hiddeable, _callback) {
        this.context_menu = _context_menu
        this.name = _name
        this.id = `menu-${this.name}`
        this.formated_name = String(this.name).toLocaleUpperCase().replace(" ", "-")
        this.hiddeable = _hiddeable
        this.callback = _callback
        this.build();
    }

    build() {
        this.element = document.createElement('li')
        this.element.id = this.id
        this.element.textContent = this.name
        this.element.addEventListener('click', this.callback)
    }

    hide() {
        if (!this.hiddeable) return
        this.element.style.display = 'none'
    }

    show() {
        this.element.style.display = 'block'

    }


}

class ContextMenu {

    context_menu_div = null
    canvas = null
    drawables = null
    items = []
    rightClickedTarget = null;
    constructor(_canvas, _drawables) {
        this.canvas = _canvas;
        this.drawables = _drawables;

    }

    build() {
        this.context_menu_div = document.createElement("div")
        this.context_menu_div.classList.add("context-menu")
        this.context_menu_div.id = "custom-context-menu"

        const ul = document.createElement("ul");

        this.items.push(new ContextMenuItem(
            this,
            'Bring to Front',
            false,
            () => {
                if (this.rightClickedTarget) {
                    this.bringToFront(this.rightClickedTarget);
                }
            }
        ));

        this.items.push(new ContextMenuItem(
            this,
            'Send to Back',
            false,
            () => {
                if (this.rightClickedTarget) {
                    this.sendToBack(this.rightClickedTarget);
                }
            }
        ));

        this.items.push(new ContextMenuItem(
            this,
            'Delete',
            false,
            () => {
                if (this.rightClickedTarget) {
                    this.deleteDrawable(this.rightClickedTarget);
                }
            }
        ));

        const separator = document.createElement('li');
        separator.className = 'separator';

        ul.appendChild(this.items[0].element);
        ul.appendChild(this.items[1].element);
        ul.appendChild(separator);
        const deleteItem = this.items[2];
        deleteItem.element.style.color = 'red';
        ul.appendChild(deleteItem.element);
        this.context_menu_div.appendChild(ul);
        document.body.appendChild(this.context_menu_div)
    }

    initListeners() {
        this.canvas.canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            let mouseX = this.canvas.mouseX;
            let mouseY = this.canvas.mouseY;
            this.rightClickedTarget = null;

            for (let i = this.drawables.length - 1; i >= 0; i--) {
                if (!this.drawables[i].isPointInside(mouseX, mouseY))
                    continue;

                this.rightClickedTarget = this.drawables[i];
                break;
            }

            if (!this.rightClickedTarget) {
                this.context_menu_div.style.display = 'none'
                return
            }

            this.context_menu_div.style.left = `${e.clientX}px`
            this.context_menu_div.style.top = `${e.clientY}px`
            this.context_menu_div.style.display = `block`

        })


        window.addEventListener('click', (e) => {
            this.context_menu_div.style.display = 'none'

        })


    }


    deleteDrawable(drawableToDelete) {

        const index = this.drawables.indexOf(drawableToDelete);

        if (index > -1) {
            this.drawables.splice(index, 1);
        }

        if (program.dragTarget === drawableToDelete) {
            program.dragTarget = null;
        }

        if (program.selectedObject === drawableToDelete) {
            program.selectedObject = null;
        }

        if (this.rightClickedTarget === drawableToDelete) {
            this.rightClickedTarget = null;
        }
        program.layersPanel.update();
    }

    bringToFront(drawableToMove) {
        const index = this.drawables.indexOf(drawableToMove);
        if (index > -1) {
            this.drawables.splice(index, 1);
        }

        this.drawables.push(drawableToMove);
    }

    sendToBack(drawableToMove) {
        const index = this.drawables.indexOf(drawableToMove);
        if (index > -1) {
            this.drawables.splice(index, 1);
        }

        this.drawables.unshift(drawableToMove);
    }

}

class TopMenuBar {
    element;
    program;

    constructor(program) {
        this.program = program;
        this.element = document.createElement('nav');
        this.element.className = 'top-menu-bar';

        this.element.innerHTML = `
            <ul class="menu">
                <li class="menu-item dropdown">
                    <span>File</span>
                    <ul class="dropdown-content">
                        <li data-action="new">New</li>
                        <li class="dropdown-separator"></li>
                        <li class="dropdown" data-action="save">
                            <span>Save As...</span>
                            <ul class="dropdown-content">
                                <li data-action="save-png">PNG Image</li>
                                <li data-action="save-jpg">JPG Image</li>
                                <li data-action="save-svg">SVG File</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        `;

        document.body.prepend(this.element);
        this.addListeners();
    }

    addListeners() {
        this.element.querySelectorAll('.menu-item.dropdown > span').forEach(span => {
            span.addEventListener('click', (e) => {
                let content = span.nextElementSibling;
                this.element.querySelectorAll('.dropdown-content').forEach(dc => {
                    if (dc !== content) dc.classList.remove('show');
                });
                content.classList.toggle('show');
            });
        });


        this.element.querySelectorAll('.dropdown .dropdown > span').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                span.nextElementSibling.classList.toggle('show');
            });
        });


        this.element.querySelector('[data-action="new"]').addEventListener('click', () => {
            this.program.clearCanvas();
        });
        this.element.querySelector('[data-action="save-png"]').addEventListener('click', () => {
            this.program.saveAs('png');
        });
        this.element.querySelector('[data-action="save-jpg"]').addEventListener('click', () => {
            this.program.saveAs('jpg');
        });
        this.element.querySelector('[data-action="save-svg"]').addEventListener('click', () => {
            this.program.saveAs('svg');
        });

        window.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.element.querySelectorAll('.dropdown-content').forEach(dc => {
                    dc.classList.remove('show');
                });
            }
        });
    }
}


class Ribbon {
    element;
    program;
    toolButtons = {};
    currentDrawTool = 'rectangle';
    drawDropdownContent;
    mainDrawButton;

    constructor(program) {
        this.program = program;
        this.element = document.createElement('div');
        this.element.id = 'ribbon';

        let toolGroup = document.createElement('div');
        toolGroup.classList.add('tool-group');

        this.toolButtons['select'] = this._createButton('tool-select', 'Select', Statics.SELECT_ICON);
        this.toolButtons['select'].addEventListener('click', () => this.setActiveTool('select'));
        toolGroup.appendChild(this.toolButtons['select']);

        this._createDrawDropdown(toolGroup);

        this.toolButtons['pen'] = this._createButton('tool-pen', 'Pen', Statics.PEN_ICON);
        this.toolButtons['pen'].addEventListener('click', () => this.setActiveTool('pen'));
        toolGroup.appendChild(this.toolButtons['pen']);

        this.element.appendChild(toolGroup);

        let bgGroup = document.createElement('div');
        bgGroup.classList.add('tool-group');
        bgGroup.style.display = 'flex';
        bgGroup.style.alignItems = 'center';
        bgGroup.style.padding = '0 5px';

        let bgLabel = document.createElement('span');
        bgLabel.textContent = 'BG: ';
        bgLabel.style.fontSize = '14px';
        bgLabel.style.marginRight = '5px';
        bgLabel.style.fontFamily = 'sans-serif';

        let bgInput = document.createElement('input');
        bgInput.type = 'color';
        bgInput.value = '#f0f0f0';
        bgInput.style.border = 'none';
        bgInput.style.padding = '0';
        bgInput.style.width = '30px';
        bgInput.style.height = '30px';
        bgInput.style.cursor = 'pointer';
        bgInput.style.backgroundColor = 'transparent';

        bgInput.addEventListener('input', (e) => {
            this.program.setBackgroundColor(e.target.value);
        });

        bgGroup.appendChild(bgLabel);
        bgGroup.appendChild(bgInput);
        this.element.appendChild(bgGroup);

        let propGroup = document.createElement('div');
        propGroup.classList.add('tool-group');
        propGroup.style.display = 'flex';
        propGroup.style.alignItems = 'center';
        propGroup.style.padding = '0 5px';
        propGroup.style.gap = '8px';

        let fillContainer = document.createElement('div');
        fillContainer.style.display = 'flex';
        fillContainer.style.alignItems = 'center';

        let fillLabel = document.createElement('span');
        fillLabel.textContent = 'Fill:';
        fillLabel.style.fontSize = '12px';
        fillLabel.style.marginRight = '3px';

        this.fillInput = document.createElement('input');
        this.fillInput.type = 'color';
        this.fillInput.value = '#ff0000';
        this.fillInput.style.border = 'none';
        this.fillInput.style.width = '25px';
        this.fillInput.style.height = '25px';
        this.fillInput.style.cursor = 'pointer';

        this.fillInput.addEventListener('input', (e) => {
            this.program.setFillColor(e.target.value);
        });
        fillContainer.appendChild(fillLabel);
        fillContainer.appendChild(this.fillInput);

        let strokeContainer = document.createElement('div');
        strokeContainer.style.display = 'flex';
        strokeContainer.style.alignItems = 'center';

        let strokeLabel = document.createElement('span');
        strokeLabel.textContent = 'Stroke:';
        strokeLabel.style.fontSize = '12px';
        strokeLabel.style.marginRight = '3px';

        this.strokeInput = document.createElement('input');
        this.strokeInput.type = 'color';
        this.strokeInput.value = '#000000';
        this.strokeInput.style.border = 'none';
        this.strokeInput.style.width = '25px';
        this.strokeInput.style.height = '25px';
        this.strokeInput.style.cursor = 'pointer';

        this.strokeInput.addEventListener('input', (e) => {
            this.program.setStrokeColor(e.target.value);
        });
        strokeContainer.appendChild(strokeLabel);
        strokeContainer.appendChild(this.strokeInput);

        let widthContainer = document.createElement('div');
        widthContainer.style.display = 'flex';
        widthContainer.style.alignItems = 'center';

        let widthLabel = document.createElement('span');
        widthLabel.textContent = 'W:';
        widthLabel.style.fontSize = '12px';
        widthLabel.style.marginRight = '3px';

        this.widthInput = document.createElement('input');
        this.widthInput.type = 'number';
        this.widthInput.min = '0';
        this.widthInput.max = '50';
        this.widthInput.value = '2';
        this.widthInput.style.width = '40px';
        this.widthInput.style.padding = '2px';

        this.widthInput.addEventListener('input', (e) => {
            this.program.setDrawWidth(e.target.value);
        });
        widthContainer.appendChild(widthLabel);
        widthContainer.appendChild(this.widthInput);

        propGroup.appendChild(fillContainer);
        propGroup.appendChild(strokeContainer);
        propGroup.appendChild(widthContainer);

        this.element.appendChild(propGroup);

        document.body.prepend(this.element);
        this.setActiveTool('select');

        window.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.drawDropdownContent.classList.remove('show');
            }
        });
    }

    _createDrawDropdown(parentGroup) {
        let drawGroup = document.createElement('div');
        drawGroup.className = 'tool-dropdown-group';

        this.mainDrawButton = this._createButton('tool-draw-main', 'Draw Shape', Statics.RECT_ICON);
        this.mainDrawButton.addEventListener('click', () => {
            this.setActiveTool(this.currentDrawTool);
        });
        drawGroup.appendChild(this.mainDrawButton);

        let dropdownButton = this._createButton('tool-draw-dropdown', 'Select Shape', Statics.CARET_DOWN_ICON);
        drawGroup.appendChild(dropdownButton);

        this.drawDropdownContent = document.createElement('div');
        this.drawDropdownContent.className = 'draw-dropdown-content';

        const drawTools = [
            { name: 'rectangle', title: 'Rectangle', icon: Statics.RECT_ICON },
            { name: 'line', title: 'Line', icon: Statics.LINE_ICON },
            { name: 'triangle', title: 'Triangle', icon: Statics.TRIANGLE_ICON },
            { name: 'ellipse', title: 'Ellipse', icon: Statics.ELLIPSE_ICON },
            { name: 'circle', title: 'Circle', icon: Statics.CIRCLE_ICON },
        ];

        for (let tool of drawTools) {
            let item = document.createElement('button');
            item.innerHTML = `<img src="${tool.icon}" class="icon-img" /> <span>${tool.title}</span>`;
            
            item.addEventListener('click', () => {
                this.currentDrawTool = tool.name;
                this.mainDrawButton.innerHTML = `<img src="${tool.icon}" class="icon-img" />`;
                this.mainDrawButton.title = tool.title;
                this.setActiveTool(tool.name);
                this.drawDropdownContent.classList.remove('show');
            });
            this.drawDropdownContent.appendChild(item);
        }

        drawGroup.appendChild(this.drawDropdownContent);
        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.drawDropdownContent.classList.toggle('show');
        });

        parentGroup.appendChild(drawGroup);
    }

_createButton(id, title, iconPath) {
        let button = document.createElement('button');
        button.id = id;
        button.innerHTML = `<img src="${iconPath}" class="icon-img" alt="${title}" />`;
        button.title = title;
        button.classList.add('tool-button');
        return button;
    }

    setActiveTool(toolName) {
        this.toolButtons['select'].classList.toggle('active', toolName === 'select');
        this.toolButtons['pen'].classList.toggle('active', toolName === 'pen');

        const isDrawTool = ['rectangle', 'line', 'triangle', 'ellipse', 'circle'].includes(toolName);
        this.mainDrawButton.classList.toggle('active', isDrawTool);

        this.program.activeTool = toolName;
        this.program.updateCursor(this.program.canvas.mouseX, this.program.canvas.mouseY);

        if (toolName !== 'select') {
            this.program.selectedObject = null;
        }

        this.drawDropdownContent.classList.remove('show');
    }
}


class Canvas {
    isMouseDown = false;
    mouseX = 0;
    mouseY = 0;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id ${canvasId} not found`);
        }
        this.ctx = this.canvas.getContext('2d');
    }

    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    initMouseListeners() {
        this.canvas.addEventListener('mousemove', (event) => {
            let rect = this.canvas.getBoundingClientRect();
            this.mouseX = event.clientX - rect.left;
            this.mouseY = event.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (event) => {
            this.isMouseDown = event.button === 0;
        })

        this.canvas.addEventListener('mouseup', (event) => {
            this.isMouseDown = !(event.button === 0);
        })

        this.canvas.addEventListener('mouseleave', (event) => {
            this.isMouseDown = false;
        })
    }

    resize() {
        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.setSize(width, height);
            return true;
        }
        return false;
    }
}

class LayersPanel {
    constructor(program) {
        this.program = program;
        this.container = null;
        this.listElement = null;
        this.build();
    }

    build() {
        this.container = document.createElement('div');
        this.container.id = 'layers-panel';

        const header = document.createElement('div');
        header.id = 'layers-header';
        header.textContent = 'Layers / Figures';

        this.listElement = document.createElement('ul');
        this.listElement.id = 'layers-list';

        this.container.appendChild(header);
        this.container.appendChild(this.listElement);
    }

    _createEditableName(drawable, index, parentLi) {
        const span = document.createElement('span');
        span.textContent = drawable.name || `${drawable.constructor.name} ${index + 1}`;
        span.style.flexGrow = '1';
        span.style.paddingLeft = '5px';

        span.addEventListener('click', (e) => {
            e.stopPropagation();
            this.program.selectedObject = drawable;
            this.program.ribbon.setActiveTool('select');

            document.querySelectorAll('.layer-item').forEach(item => item.classList.remove('active'));
            parentLi.classList.add('active');
            this.program.draw();
        });

        span.addEventListener('dblclick', (e) => {
            e.stopPropagation();

            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.style.width = '100px';
            input.style.fontFamily = 'inherit';

            const commitChange = () => {
                const val = input.value.trim();
                if (val) drawable.name = val;
                this.update();
            };

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') commitChange();
            });

            input.addEventListener('blur', commitChange);

            parentLi.replaceChild(input, span);
            input.focus();
        });

        return span;
    }

    update() {
        this.listElement.innerHTML = '';

        for (let i = this.program.drawables.length - 1; i >= 0; i--) {
            const drawable = this.program.drawables[i];
            const li = document.createElement('li');
            li.className = 'layer-item';

            if (this.program.selectedObject === drawable) {
                li.classList.add('active');
            }

            li.addEventListener('click', () => {
                this.program.selectedObject = drawable;
                this.program.ribbon.setActiveTool('select');
                this.update();
                this.program.draw();
            });

            const preview = document.createElement('span');
            preview.className = 'layer-preview';
            let color = drawable.fillColor || drawable.strokeColor || '#000';
            if (color === 'transparent') color = drawable.strokeColor;
            preview.style.backgroundColor = color;

            const nameSpan = this._createEditableName(drawable, i, li);

            const delBtn = document.createElement('button');
            delBtn.className = 'layer-delete';
            delBtn.innerHTML = '&times;';
            delBtn.title = 'Delete Figure';

            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.program.context_menu.deleteDrawable(drawable);
            });

            li.appendChild(preview);
            li.appendChild(nameSpan);
            li.appendChild(delBtn);

            this.listElement.appendChild(li);
        }
    }
}

class Program {

    drawables = [];
    isDragging = false;
    dragTarget = null;
    dragOffset = { x: 0, y: 0 };

    resizeHandle = null;

    lastMouseX = 0;
    lastMouseY = 0;

    mouseMovedSinceDown = false;
    clickThreshold = 5;

    context_menu = null;

    ribbon = null;
    activeTool = 'select';

    dragStartX = 0;
    dragStartY = 0;

    selectedObject = null;

    constructor() {
        this.currentFillColor = '#ff0000';
        this.currentStrokeColor = '#000000';
        this.currentLineWidth = 2;

        this.canvas = new Canvas('main-canvas');
        this.backgroundColor = '#f0f0f0';
        this.ribbon = new Ribbon(this);

        this.topMenuBar = new TopMenuBar(this);

        const workspace = document.createElement('div');
        workspace.id = 'workspace-container'; // ID matched to CSS
        const canvasElement = this.canvas.canvas;
        canvasElement.parentNode.insertBefore(workspace, canvasElement);
        workspace.appendChild(canvasElement);

        this.layersPanel = new LayersPanel(this);
        workspace.appendChild(this.layersPanel.container);


        this.canvas.resize();

        window.addEventListener('resize', () => {
            if (this.canvas.resize()) {
                this.update();
                this.draw();
            }
        })

        this.canvas.clear();
        this.canvas.initMouseListeners();

        let rect1 = new Rectangle(100, 100, 'red');
        rect1.setPosition(150, 150);
        this.drawables.push(rect1);

        let rect2 = new Rectangle(150, 80, 'blue');
        rect2.setPosition(400, 300);
        this.drawables.push(rect2);

        this.context_menu = new ContextMenu(this.canvas, this.drawables);
        this.context_menu.build();
        this.context_menu.initListeners();
    }

    setFillColor(color) {
        this.currentFillColor = color;
        if (this.selectedObject && this.selectedObject.fillColor !== undefined) {
            this.selectedObject.fillColor = color;
        }
    }

    setStrokeColor(color) {
        this.currentStrokeColor = color;
        if (this.selectedObject) {
            this.selectedObject.strokeColor = color;
        }
    }

    setDrawWidth(width) {
        this.currentLineWidth = parseInt(width);
        if (this.selectedObject) {
            this.selectedObject.lineWidth = this.currentLineWidth;
        }
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
    }
    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.drawables = [];
            this.selectedObject = null;
            this.dragTarget = null;
            this.layersPanel.update();
            console.log('Canvas cleared');
        }
    }
    saveAs(format) {
        if (format === 'png' || format === 'jpg') {
            const dataURL = this.canvas.canvas.toDataURL(`image/${format}`);
            this.downloadURI(dataURL, `drawing.${format}`);
        } else if (format === 'svg') {

            const width = this.canvas.canvas.width;
            const height = this.canvas.canvas.height;

            let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

            svgContent += `<rect width="100%" height="100%" fill="${this.backgroundColor}" />`;

            for (const drawable of this.drawables) {
                if (typeof drawable.toSVG === 'function') {
                    svgContent += drawable.toSVG();
                }
            }
            svgContent += `</svg>`;
            const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            this.downloadURI(url, 'drawing.svg');
        }
    }
    downloadURI(uri, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    run() {
        this.mainLoop();
    };

    mainLoop() {
        this.update();
        this.draw();

        requestAnimationFrame(() => this.mainLoop());
    }

    update() {
        const mouseX = this.canvas.mouseX;
        const mouseY = this.canvas.mouseY;

        if (this.canvas.isMouseDown) {
            this.updateMouseDown(mouseX, mouseY);

        } else {
            this.updateMouseUp(mouseX, mouseY)
            this.updateCursor(mouseX, mouseY);
        }


    }

    updateMouseUp(mouseX, mouseY) {
        if (!this.isDragging) {
            return;
        }

        if (!this.mouseMovedSinceDown) {
            if (this.activeTool === 'select') {
                this.selectedObject = this.dragTarget;

                if (this.selectedObject) {
                    if (this.selectedObject.fillColor) {
                        this.ribbon.fillInput.value = this.selectedObject.fillColor;
                        this.currentFillColor = this.selectedObject.fillColor;
                    }
                    if (this.selectedObject.strokeColor) {
                        this.ribbon.strokeInput.value = this.selectedObject.strokeColor;
                        this.currentStrokeColor = this.selectedObject.strokeColor;
                    }
                    if (this.selectedObject.lineWidth) {
                        this.ribbon.widthInput.value = this.selectedObject.lineWidth;
                        this.currentLineWidth = this.selectedObject.lineWidth;
                    }
                }
                this.layersPanel.update();
            }
        }

        const isShapeTool = (this.activeTool === 'rectangle' ||
            this.activeTool === 'line' ||
            this.activeTool === 'triangle' ||
            this.activeTool === 'ellipse' ||
            this.activeTool === 'circle');

        if (isShapeTool) {
            if (this.dragTarget.width < this.clickThreshold ||
                this.dragTarget.height < this.clickThreshold) {
                this.context_menu.deleteDrawable(this.dragTarget);
            } else {
                this.selectedObject = this.dragTarget;
            }
            this.ribbon.setActiveTool('select');
        }

        if (this.activeTool === 'pen') {
            if (this.dragTarget.points.length < 2) {
                this.context_menu.deleteDrawable(this.dragTarget);
            } else {
                let bounds = this.dragTarget.getBounds();
                let centerX = (bounds.minX + bounds.maxX) / 2;
                let centerY = (bounds.minY + bounds.maxY) / 2;
                this.dragTarget.setPosition(centerX, centerY);
                this.selectedObject = this.dragTarget;
            }
            this.ribbon.setActiveTool('select');
        }

        this.isDragging = false;
        this.dragTarget = null;
        this.resizeHandle = null;
    }

    updateMouseDown(mouseX, mouseY) {
        let deltaX = mouseX - this.lastMouseX;
        let deltaY = mouseY - this.lastMouseY;
        if (this.isDragging) {

            if (!this.mouseMovedSinceDown) {
                this.mouseMovedSinceDown = (Math.abs(deltaX) > this.clickThreshold || Math.abs(deltaY) > this.clickThreshold);
            }

            if (this.dragTarget && this.mouseMovedSinceDown)
                this.handleDrag(deltaX, deltaY);


            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
            return;
        }

        this.isDragging = true;
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
        this.mouseMovedSinceDown = false;
        this.dragTarget = null;
        this.resizeHandle = null;

        let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        switch (this.activeTool) {
            case 'select':
                if (this.selectedObject) {
                    let handle = this.selectedObject.getHandleAtPoint(mouseX, mouseY);
                    if (handle) {
                        this.dragTarget = this.selectedObject;
                        this.resizeHandle = handle;
                        if (this.resizeHandle === 'body') {
                            this.context_menu.bringToFront(this.dragTarget);
                        }
                        return;
                    }
                }

                for (let i = this.drawables.length - 1; i >= 0; i--) {
                    let drawable = this.drawables[i];
                    let handle = drawable.getHandleAtPoint(mouseX, mouseY);
                    if (!handle) continue;
                    this.dragTarget = drawable;
                    this.resizeHandle = 'body';
                    this.context_menu.bringToFront(this.dragTarget);
                    break;
                }
                break


            case 'rectangle':
            case 'line':
            case 'triangle':
            case 'ellipse':
            case 'circle':
                this.dragStartX = mouseX;
                this.dragStartY = mouseY;
                let newShape;

                if (this.activeTool === 'rectangle')
                    newShape = new Rectangle(0, 0, this.currentFillColor, this.currentStrokeColor, this.currentLineWidth);
                else if (this.activeTool === 'line')
                    newShape = new Line(0, 0, this.currentStrokeColor, this.currentLineWidth);
                else if (this.activeTool === 'triangle')
                    newShape = new Triangle(0, 0, this.currentFillColor, this.currentStrokeColor, this.currentLineWidth);
                else if (this.activeTool === 'ellipse')
                    newShape = new Ellipse(0, 0, this.currentFillColor, this.currentStrokeColor, this.currentLineWidth);
                else if (this.activeTool === 'circle')
                    newShape = new Circle(0, this.currentFillColor, this.currentStrokeColor, this.currentLineWidth);

                newShape.setPosition(mouseX, mouseY);
                this.drawables.push(newShape);
                this.dragTarget = newShape;
                this.resizeHandle = 'draw-shape';
                this.layersPanel.update();
                break;
            case 'pen':
                let newPolyline = new Polyline(this.currentStrokeColor, this.currentLineWidth);
                newPolyline.addPoint(mouseX, mouseY);
                this.drawables.push(newPolyline);
                this.dragTarget = newPolyline;
                this.resizeHandle = 'draw-pen';
                this.layersPanel.update();
                break;
        }

    }

    handleDrag(deltaX, deltaY) {
        if (!this.dragTarget || !this.resizeHandle)
            return;


        let target = this.dragTarget;
        const currentX = this.lastMouseX + deltaX;
        const currentY = this.lastMouseY + deltaY;
        switch (this.resizeHandle) {
            case 'draw-shape':
                {
                    const newWidth = currentX - this.dragStartX;
                    const newHeight = currentY - this.dragStartY;
                    const newCenterX = this.dragStartX + (newWidth / 2);
                    const newCenterY = this.dragStartY + (newHeight / 2);

                    if (target instanceof Circle) {
                        const size = Math.max(Math.abs(newWidth), Math.abs(newHeight));
                        target.width = size;
                        target.height = size;

                        const signX = newWidth < 0 ? -1 : 1;
                        const signY = newHeight < 0 ? -1 : 1;
                        target.position.x = this.dragStartX + (size * signX) / 2;
                        target.position.y = this.dragStartY + (size * signY) / 2;

                    } else {
                        target.width = Math.abs(newWidth);
                        target.height = Math.abs(newHeight);
                        target.position.x = newCenterX;
                        target.position.y = newCenterY;
                    }
                    break;
                }
            case 'draw-pen':
                target.addPoint(currentX, currentY);
                break;
            case 'body':

                if (target instanceof Polyline) {
                    for (const point of target.points) {
                        point.x += deltaX;
                        point.y += deltaY;
                    }
                } else {
                    target.position.x += deltaX;
                    target.position.y += deltaY;
                }
                break;
            case 'left':
                target.width -= deltaX
                target.position.x += deltaX / 2
                break
            case 'right':
                target.width += deltaX
                target.position.x += deltaX / 2;
                break
            case 'top':
                target.height -= deltaY
                target.position.y += deltaY / 2
                break
            case 'bottom':
                target.height += deltaY
                target.position.y += deltaY / 2
                break
            case 'top-left':
                target.width -= deltaX
                target.height -= deltaY
                target.position.x += deltaX / 2
                target.position.y += deltaY / 2
                break
            case 'top-right':
                target.width += deltaX
                target.height -= deltaY
                target.position.x += deltaX / 2
                target.position.y += deltaY / 2
                break

            case 'bottom-left':
                target.width -= deltaX
                target.height += deltaY
                target.position.x += deltaX / 2
                target.position.y += deltaY / 2
                break

            case 'bottom-right':
                target.width += deltaX
                target.height += deltaY
                target.position.x += deltaX / 2
                target.position.y += deltaY / 2
                break
        }

    }

    handleClick(mouseX, mouseY) {

    }

    updateCursor(mouseX, mouseY) {
        if (this.isDragging) return;
        let cursor = 'default'

        switch (this.activeTool) {
            case 'select':
                if (this.selectedObject) {
                    const handle = this.selectedObject.getHandleAtPoint(mouseX, mouseY);
                    cursor = this.getCursorForHandle(handle);
                }

                if (cursor === null || cursor === 'default') {
                    cursor = 'default';
                    for (let i = this.drawables.length - 1; i >= 0; i--) {
                        const handle = this.drawables[i].getHandleAtPoint(mouseX, mouseY);
                        if (handle === 'body') {
                            cursor = 'move';
                            break;
                        }
                    }
                }
                break;

            case 'rectangle':
            case 'line':
            case 'triangle':
            case 'ellipse':
            case 'circle':
            case 'pen':
                cursor = 'crosshair';
                break;
        }
        this.canvas.canvas.style.cursor = cursor

    }


    getCursorForHandle(handle) {
        switch (handle) {
            case 'body':
                return 'move';
            case 'left':
            case 'right':
                return 'ew-resize';
            case 'top':
            case 'bottom':
                return 'ns-resize';
            case 'top-left':
            case 'bottom-right':
                return 'nwse-resize';
            case 'top-right':
            case 'bottom-left':
                return 'nesw-resize';
            default:
                return null;
        }
    }


    draw() {
        this.canvas.ctx.fillStyle = this.backgroundColor;
        this.canvas.ctx.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        for (const drawable of this.drawables) {
            drawable.draw(this.canvas.ctx);
        }

        if (this.selectedObject && this.activeTool === 'select') {
            if (typeof this.selectedObject.drawHandles === 'function') {
                this.selectedObject.drawHandles(this.canvas.ctx);
            }
        }

    }
}


window.addEventListener('load', () => {
    window.program = new Program();
    console.log('Program initialized');
    program.run();
});


/*
Copyright (c) 2025-2026 Serban Tudor Gabriel
*/