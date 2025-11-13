
class Statics{
    static SELECT_ICON =`<svg fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier"> <title>move</title> <path d="M7 23.375l3.625 3.625c0.156 0.156 0.344 0.25 0.563 0.219 0.25 0 0.469-0.063 0.625-0.219l3.594-3.625c0.5-0.5 0.344-0.875-0.375-0.875h-2.438v-5.125h5.063v2.5c0 0.719 0.438 0.844 0.938 0.344l3.594-3.594c0.156-0.156 0.219-0.344 0.219-0.594 0.031-0.219-0.063-0.438-0.219-0.625l-3.594-3.563c-0.5-0.5-0.938-0.375-0.906 0.344v2.438h-5.094v-5.063h2.438c0.719 0 0.875-0.406 0.375-0.906l-3.594-3.563c-0.313-0.313-0.875-0.344-1.188 0l-3.625 3.563c-0.5 0.5-0.344 0.906 0.375 0.906h2.438v5.031h-5.031v-2.406c0-0.719-0.438-0.844-0.938-0.344l-3.594 3.563c-0.156 0.156-0.219 0.375-0.25 0.625 0 0.25 0.094 0.438 0.25 0.594l3.594 3.594c0.5 0.5 0.906 0.375 0.906-0.344v-2.469h5.063v5.094h-2.438c-0.719 0-0.875 0.375-0.375 0.875z"></path> </g>
    </svg>`
    
    static RECT_ICON=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M4 4h16v16H4z"/>
    </svg>`;

    static LINE_ICON=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M5 19L19 5"/>
    </svg>`;

    static TRIANGLE_ICON=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2L2 22h20z"/>
    </svg>`;

    static PEN_ICON=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41zM3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z"/>
    </svg>`

    static CARET_DOWN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M5 8l5 5 5-5z"/></svg>`;
}

class Drawable{
    constructor(){
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
        this.scale = { x: 1, y: 1 };
    }

    setPosition(x, y){
        this.position.x = x;
        this.position.y = y;
    }

    setRotation(angle){
        this.rotation = angle;
    }

    setScale(sx, sy){
        this.scale.x = sx;
        this.scale.y = sy;
    }
    
    draw(ctx){
        // To be implemented
    }

    isPointInside(x,y){
        return false;
    }

    getHandleAtPoint(x,y){
        return -1;
    }

}


class HandleDrawable extends Drawable{
    constructor(){
        super();
        this.width=0;
        this.height=0;
        this.color='black';
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
    }

    isPointInside(x, y){
        let halfWidth = (this.width * this.scale.x ) / 2;
        let halfHeight = (this.height * this.scale.y ) / 2;
        
        let left = this.position.x - halfWidth;
        let right = this.position.x + halfWidth;
        let top = this.position.y - halfHeight;
        let bottom = this.position.y + halfHeight;
        
        return (x >= left && x <= right && y >= top && y <= bottom);
    }



    drawHandles(ctx){
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);


        let halfW = this.width / 2;
        let halfH = this.height / 2;
        let handleOffset = this.handleSize / 2;

        let handles = [
            { x: -halfW, y: -halfH }, // top-left
            { x: 0,     y: -halfH }, // top
            { x: halfW,  y: -halfH }, // top-right
            { x: -halfW, y: 0 },     // left
            { x: halfW,  y: 0 },     // right
            { x: -halfW, y: halfH },  // bottom-left
            { x: 0,     y: halfH },  // bottom
            { x: halfW,  y: halfH }   // bottom-right
        ];

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        for(let handle of handles){
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

    getHandleAtPoint(x, y){
        let halfW = this.width / 2;
        let halfH = this.height / 2;
        let halfHandle = this.handleSize / 2;
        let left = this.position.x - halfW;
        let right = this.position.x + halfW;
        let top = this.position.y - halfH;
        let bottom = this.position.y + halfH;
        if(x>= left - halfHandle && x <= left + halfHandle
            && y >= top - halfHandle && y <= top + halfHandle
        ) return 'top-left';

        if(x>= this.position.x - halfHandle && x <= this.position.x + halfHandle
            && y >= top - halfHandle && y <= top + halfHandle
        ) return 'top';

        if(x>= right - halfHandle && x <= right + halfHandle
            && y >= top - halfHandle && y <= top + halfHandle
        ) return 'top-right';

        if(x>= left - halfHandle && x <= left + halfHandle
            && y >= this.position.y - halfHandle && y <= this.position.y + halfHandle
        ) return 'left';

        if(x>= right - halfHandle && x <= right + halfHandle
            && y >= this.position.y - halfHandle && y <= this.position.y + halfHandle
        ) return 'right';

        if(x>= left - halfHandle && x <= left + halfHandle
            && y >= bottom - halfHandle && y <= bottom + halfHandle
        ) return 'bottom-left';

        if(x>= this.position.x - halfHandle && x <= this.position.x + halfHandle
            && y >= bottom - halfHandle && y <= bottom + halfHandle
        ) return 'bottom';

        if(x>= right - halfHandle && x <= right + halfHandle
            && y >= bottom - halfHandle && y <= bottom + halfHandle
        ) return 'bottom-right';

        if(this.isPointInside(x,y)) return 'body';

        return null;
    }
}

class Rectangle extends HandleDrawable{
    handleSize = 8;

    constructor(width, height, color){
        super();
        this.width = width;
        this.height = height;
        this.color = color;
    }
    

    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
    }
   
}

class Line extends HandleDrawable{
    constructor(width, height, color){
        super();
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class Triangle extends HandleDrawable{
    constructor(width, height, color){
        super();
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw an isosceles triangle
        ctx.moveTo(0, -this.height / 2); // Top point
        ctx.lineTo(this.width / 2, this.height / 2); // Bottom-right
        ctx.lineTo(-this.width / 2, this.height / 2); // Bottom-left
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

class Polyline extends Drawable{
    constructor(color){
        super();
        this.points = [];
        this.color = color;
    }
    addPoint(x, y){
        this.points.push({ x: x, y: y });
    }

    draw(ctx) {
        if (this.points.length < 2) return;

        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
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
        // Use bounds for simple selection
        const bounds = this.getBounds();
        // Add a small buffer for easier clicking
        const buffer = 5; 
        
        return (x >= bounds.minX - buffer && x <= bounds.maxX + buffer &&
                y >= bounds.minY - buffer && y <= bounds.maxY + buffer);
    }

    getHandleAtPoint(x, y) {
        // Polylines can be moved (body) but not resized with handles
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


}

class ContextMenuItem{
    context_menu=null;
    name = null;
    id=null;
    formated_name=null;
    element=null;
    hiddeable=false;
    callback=null;
    constructor(_context_menu,_name,_hiddeable,_callback){
        this.context_menu =_context_menu
        this.name=_name
        this.id=`menu-${this.name}`
        this.formated_name=String(this.name).toLocaleUpperCase().replace(" ","-")
        this.hiddeable=_hiddeable
        this.callback=_callback
        this.build();
    }

    build(){
        this.element=document.createElement('li')
        this.element.id=this.id
        this.element.textContent=this.name
        this.element.addEventListener('click',this.callback)
    }

    hide(){
        if(!this.hiddeable)return
        this.element.style.display='none'
    }

    show(){
        this.element.style.display='block'

    }
    

}

class ContextMenu{

    context_menu_div =null
    canvas=null
    drawables=null
    items=[]
    rightClickedTarget=null;
    constructor(_canvas,_drawables){
        this.canvas=_canvas;
        this.drawables=_drawables;

    }

    

    build(){

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

    initListeners(){
        this.canvas.canvas.addEventListener("contextmenu", (e)=>{
            e.preventDefault();

            let mouseX= this.canvas.mouseX;
            let mouseY= this.canvas.mouseY;
            this.rightClickedTarget=null;

            for(let i =this.drawables.length -1 ;i>=0;i--){
                if(!this.drawables[i].isPointInside(mouseX,mouseY))
                    continue;

                this.rightClickedTarget=this.drawables[i];
                break;
            }

            if(!this.rightClickedTarget){
                this.context_menu_div.style.display='none'
                return
            }

            this.context_menu_div.style.left = `${e.clientX}px`
            this.context_menu_div.style.top = `${e.clientY}px`
            this.context_menu_div.style.display =`block`

            console.log(`Right-clicked on ${this.rightClickedTarget.color} rectangle`);

        })


        window.addEventListener('click',(e)=>{
            this.context_menu_div.style.display='none'

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
        if (this.rightClickedTarget === drawableToDelete) {
            this.rightClickedTarget = null;
        }
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
        // Handle dropdown opening/closing
        this.element.querySelectorAll('.menu-item.dropdown > span').forEach(span => {
            span.addEventListener('click', (e) => {
                let content = span.nextElementSibling;
                // Close other menus
                this.element.querySelectorAll('.dropdown-content').forEach(dc => {
                    if (dc !== content) dc.classList.remove('show');
                });
                content.classList.toggle('show');
            });
        });

        // Handle nested dropdowns
        this.element.querySelectorAll('.dropdown .dropdown > span').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent parent menu from closing
                span.nextElementSibling.classList.toggle('show');
            });
        });

        // Handle actions
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

        // Close menus when clicking elsewhere
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

        // 1. Select Tool
        this.toolButtons['select'] = this._createButton('tool-select', 'Select', Statics.SELECT_ICON);
        this.toolButtons['select'].addEventListener('click', () => this.setActiveTool('select'));
        toolGroup.appendChild(this.toolButtons['select']);

        // 2. Draw Dropdown
        this._createDrawDropdown(toolGroup);

        // 3. Pen Tool
        this.toolButtons['pen'] = this._createButton('tool-pen', 'Pen', Statics.PEN_ICON);
        this.toolButtons['pen'].addEventListener('click', () => this.setActiveTool('pen'));
        toolGroup.appendChild(this.toolButtons['pen']);


        this.element.appendChild(toolGroup);
        document.body.prepend(this.element);

        this.setActiveTool('select');
    }

    _createDrawDropdown(parentGroup) {
        let drawGroup = document.createElement('div');
        drawGroup.className = 'tool-dropdown-group';

        // Main button (shows current tool)
        this.mainDrawButton = this._createButton('tool-draw-main', 'Draw Shape', Statics.RECT_ICON);
        this.mainDrawButton.addEventListener('click', () => {
            this.setActiveTool(this.currentDrawTool);
        });
        drawGroup.appendChild(this.mainDrawButton);

        // Dropdown arrow button
        let dropdownButton = this._createButton('tool-draw-dropdown', 'Select Shape', Statics.CARET_DOWN_ICON);
        drawGroup.appendChild(dropdownButton);

        // Dropdown content (hidden)
        this.drawDropdownContent = document.createElement('div');
        this.drawDropdownContent.className = 'draw-dropdown-content';

        const drawTools = [
            { name: 'rectangle', title: 'Rectangle', icon: Statics.RECT_ICON },
            { name: 'line', title: 'Line', icon: Statics.LINE_ICON },
            { name: 'triangle', title: 'Triangle', icon: Statics.TRIANGLE_ICON },
        ];

        for (let tool of drawTools) {
            let item = document.createElement('button');
            item.innerHTML = `${tool.icon} <span>${tool.title}</span>`;
            item.addEventListener('click', () => {
                this.currentDrawTool = tool.name;
                this.mainDrawButton.innerHTML = tool.icon;
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

    _createButton(id, title, svgIconHtml) {
        let button = document.createElement('button');
        button.id = id;
        button.innerHTML = svgIconHtml;
        button.title = title;
        button.classList.add('tool-button');
        return button;
    }

    setActiveTool(toolName) {
        this.toolButtons['select'].classList.toggle('active', toolName === 'select');
        this.toolButtons['pen'].classList.toggle('active', toolName === 'pen');

        const isDrawTool = ['rectangle', 'line', 'triangle'].includes(toolName);
        this.mainDrawButton.classList.toggle('active', isDrawTool);
        
        // Update program's active tool
        this.program.activeTool = toolName;
        this.program.updateCursor(this.program.canvas.mouseX, this.program.canvas.mouseY);
        console.log(`Active tool changed to: ${toolName}`);

        // Deselect object if switching to a drawing tool
        if (toolName !== 'select') {
            this.program.selectedObject = null;
        }

        // Close dropdown
        this.drawDropdownContent.classList.remove('show');
    }
}


class Canvas{
    isMouseDown = false;
    mouseX = 0;
    mouseY = 0;

    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas){
            throw new Error(`Canvas with id ${canvasId} not found`);
        }
        this.ctx = this.canvas.getContext('2d');
    }

    setSize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    initMouseListeners(){
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

    resize(){
        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;
        if(this.canvas.width !== width || this.canvas.height !== height){
            this.setSize(width, height);
            console.log(`Canvas resized to ${width}x${height}`);
            return true;
        }
        return false;
    }



}


class Program{

    drawables = [];
    isDragging = false;
    dragTarget = null;
    dragOffset = { x: 0, y: 0 };

    resizeHandle=null;

    lastMouseX=0;
    lastMouseY=0;

    mouseMovedSinceDown=false;
    clickThreshold=5;

    context_menu=null;

    ribbon = null;
    activeTool='select';

    dragStartX=0;
    dragStartY=0;

    selectedObject = null;

    constructor(){

        this.canvas = new Canvas('main-canvas');
        this.ribbon = new Ribbon(this);

        this.topMenuBar = new TopMenuBar(this); // ADD THIS

        this.canvas.resize();
    
        window.addEventListener('resize', () => {
            if(this.canvas.resize()){
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

        this.context_menu= new ContextMenu(this.canvas,this.drawables);
        this.context_menu.build();
        this.context_menu.initListeners();
        
    }
    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.drawables = [];
            this.selectedObject = null;
            this.dragTarget = null;
            console.log('Canvas cleared');
        }
    }
    saveAs(format) {
        if (format === 'png' || format === 'jpg') {
            const dataURL = this.canvas.canvas.toDataURL(`image/${format}`);
            this.downloadURI(dataURL, `drawing.${format}`);
        } else if (format === 'svg') {
            // SVG export is very complex and requires a separate library
            // or a function to convert all 'drawables' to SVG path data.
            console.warn('SVG export is not yet implemented.');
            alert('SVG export is not yet implemented. This feature requires building an SVG string from all drawn objects.');
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

    run(){
        this.mainLoop();
    };

    mainLoop(){
        this.update();
        this.draw();

        requestAnimationFrame(() => this.mainLoop());
    }

    update(){
        const mouseX = this.canvas.mouseX;
        const mouseY = this.canvas.mouseY;
        
        if(this.canvas.isMouseDown){
            this.updateMouseDown(mouseX, mouseY);
            
        }else{
            this.updateMouseUp(mouseX,mouseY)
            this.updateCursor(mouseX, mouseY);
        }


    }

    updateMouseUp(mouseX, mouseY){
        if(!this.isDragging){
            return;
        }
        // if(this.dragTarget && !this.mouseMovedSinceDown){
        //     this.handleClick(mouseX, mouseY);
        // }

        if(!this.mouseMovedSinceDown){
            if(this.activeTool==='select'){
                this.selectedObject = this.dragTarget;
            }
        }

        const isShapeTool = (this.activeTool==='rectangle' || 
                         this.activeTool==='line' || 
                         this.activeTool==='triangle');

        if (isShapeTool) {
            // Check if it was a "click" (no real size)
            if(this.dragTarget.width < this.clickThreshold || 
            this.dragTarget.height < this.clickThreshold){
                this.context_menu.deleteDrawable(this.dragTarget);
            } else {
                this.selectedObject = this.dragTarget;
            }
            this.ribbon.setActiveTool('select');
        }

        if(this.activeTool==='pen'){
            if(this.dragTarget.points.length <2){
                this.context_menu.deleteDrawable(this.dragTarget);
            }else{
                let bounds = this.dragTarget.getBounds();
                let centerX = (bounds.minX + bounds.maxX) /2;
                let centerY = (bounds.minY + bounds.maxY) /2;
                this.dragTarget.setPosition(centerX,centerY);
                this.selectedObject = this.dragTarget;
            }
            this.ribbon.setActiveTool('select');
        }

        this.isDragging = false;
        this.dragTarget = null;
        this.resizeHandle = null;
    }

    updateMouseDown(mouseX, mouseY){
        let deltaX = mouseX -  this.lastMouseX;
        let deltaY = mouseY -  this.lastMouseY;
        if(this.isDragging){

            // this.mouseMovedSinceDown = !this.mouseMovedSinceDown && (Math.abs(deltaX) > this.clickThreshold || Math.abs(deltaY) > this.clickThreshold);
            if(!this.mouseMovedSinceDown){
                this.mouseMovedSinceDown = (Math.abs(deltaX) > this.clickThreshold || Math.abs(deltaY) > this.clickThreshold);
            }

            if(this.dragTarget && this.mouseMovedSinceDown)
                this.handleDrag(deltaX, deltaY);


            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
            return;
        }

        this.isDragging = true;
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
        this.mouseMovedSinceDown = false;
        this.drawTarget = null;
        this.resizeHandle = null;

        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

        switch(this.activeTool){
            case 'select':
                if(this.selectedObject){
                    let handle = this.selectedObject.getHandleAtPoint(mouseX,mouseY);
                    if(handle){
                        this.dragTarget = this.selectedObject;
                        this.resizeHandle = handle;
                        if(this.resizeHandle==='body'){
                            this.context_menu.bringToFront(this.dragTarget);
                        }
                        return;
                    }
                }

                for(let i = this.drawables.length-1;i>=0;i--){
                    let drawable = this.drawables[i];
                    let handle = drawable.getHandleAtPoint(mouseX,mouseY);
                    if(!handle)continue;
                    this.dragTarget = drawable;
                    this.resizeHandle = 'body';
                    this.context_menu.bringToFront(this.dragTarget);
                    break;
                }
                break 

            
            case 'rectangle':
            case 'line':
            case 'triangle':
                this.dragStartX = mouseX;
                this.dragStartY = mouseY;

                let newShape;

                if(this.activeTool==='rectangle'){
                    newShape = new Rectangle(0,0,randomColor);
                }else if(this.activeTool==='line'){
                    newShape = new Line(0,0,randomColor);
                }else if(this.activeTool==='triangle'){
                    newShape = new Triangle(0,0,randomColor);
                }
                
                newShape.setPosition(mouseX,mouseY);
                this.drawables.push(newShape);
                this.dragTarget = newShape;
                this.resizeHandle = 'draw-shape';
                break;
            case 'pen':
                let newPolyline = new Polyline(randomColor);
                newPolyline.addPoint(mouseX,mouseY);
                this.drawables.push(newPolyline);
                this.dragTarget = newPolyline;
                this.resizeHandle = 'draw-pen';
                break;
        }

    }

    handleDrag(deltaX, deltaY){
        if(!this.dragTarget || !this.resizeHandle) 
            return;


        let target = this.dragTarget;
        const currentX = this.lastMouseX + deltaX;
        const currentY = this.lastMouseY + deltaY;
        switch(this.resizeHandle){
            case 'draw-shape':{ // Used for rect, line, triangle
                const newWidth = currentX - this.dragStartX;
                const newHeight = currentY - this.dragStartY;
                const newCenterX = this.dragStartX + (newWidth / 2);
                const newCenterY = this.dragStartY + (newHeight / 2);

                target.width = Math.abs(newWidth);
                target.height = Math.abs(newHeight);
                target.position.x = newCenterX;
                target.position.y = newCenterY;
                break;
            }
            case 'draw-pen':
                target.addPoint(currentX, currentY);
                break;
            case 'body':
                // For Polyline, which has no 'position'
                if (target instanceof Polyline) {
                    // Move all points by delta
                    for (const point of target.points) {
                        point.x += deltaX;
                        point.y += deltaY;
                    }
                } else {
                    // For all other shapes
                    target.position.x += deltaX;
                    target.position.y += deltaY;
                }
                break;
            case 'left':
                target.width -= deltaX
                target.position.x += deltaX/2
                break
            case 'right':
                target.width+= deltaX
                target.position.x +=deltaX/2;
                break
            case 'top':
                target.height -= deltaY
                target.position.y += deltaY/2
                break
            case 'bottom':
                target.height += deltaY
                target.position.y += deltaY/2
                break
            case 'top-left':
                target.width -= deltaX
                target.height -= deltaY
                target.position.x +=deltaX/2
                target.position.y += deltaY/2
                break
            case 'top-right':
                target.width += deltaX
                target.height -= deltaY
                target.position.x +=deltaX/2
                target.position.y += deltaY/2
                break

            case 'bottom-left':
                target.width -= deltaX
                target.height += deltaY
                target.position.x +=deltaX/2
                target.position.y += deltaY/2
                break

            case 'bottom-right':
                target.width += deltaX
                target.height += deltaY
                target.position.x +=deltaX/2
                target.position.y += deltaY/2
                break
        }

    }

    handleClick(mouseX, mouseY){
        // if(this.activeTool==='select'){
        //     console.log(`Clicked on ${this.dragTarget.color} rectangle`)
        // }
    }

    updateCursor(mouseX, mouseY){
        if(this.isDragging)return;
        let cursor = 'default'
        
        switch (this.activeTool) {
            case 'select':
                if (this.selectedObject) {
                    const handle = this.selectedObject.getHandleAtPoint(mouseX, mouseY);
                    cursor = this.getCursorForHandle(handle);
                }

                if (cursor === null || cursor === 'default') {
                    cursor = 'default'; // Reset
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
            case 'pen':
                cursor = 'crosshair';
                break;
        }
        this.canvas.canvas.style.cursor=cursor

    }

   
    getCursorForHandle(handle){
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


    draw(){
        this.canvas.clear();
        for(const drawable of this.drawables){
            drawable.draw(this.canvas.ctx);
        }

       if(this.selectedObject && this.activeTool==='select'){
            // Only HandleDrawable and its children have drawHandles
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
