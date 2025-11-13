
class Statics{
    static SELECT_ICON =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M3.41 12.59l2.83 2.83c.39.39 1.02.39 1.41 0l6-6c.39-.39.39-1.02 0-1.41l-6-6c-.39-.39-1.02-.39-1.41 0l-2.83 2.83c-.39.39-.39 1.02 0 1.41L5.59 8H3c-.55 0-1 .45-1 1s.45 1 1 1h2.59l-2.18 2.18c-.39.39-.39 1.03 0 1.41z" transform="rotate(-45 12 12) translate(-2 -2)"/>
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



class Ribbon{
    element;

    toolsButtons={}
    tools=[
        {name:'select',icon:Statics.SELECT_ICON,title:'Select' },
        {name:'rectangle',icon:Statics.RECT_ICON,title:'Rectangle' },
        {name:'line',icon:Statics.LINE_ICON,title:'Line' },
        {name:'triangle',icon:Statics.TRIANGLE_ICON,title:'Triangle' },
        {name:'pen',icon:Statics.PEN_ICON,title:'Pen' },
    ]

    onToolCahnge;

    constructor(onToolChangeCallback){
        this.onToolCahnge=onToolChangeCallback;

        this.element= document.createElement('div');
        this.element.id='ribbon';

        let toolGroup = document.createElement('div');
        toolGroup.classList.add('tool-group');


        for(let tool of this.tools){

            let btn = this._createButton(`tool-${tool.name}`,tool.title,tool.icon);
            btn.addEventListener('click',()=>{
                this.setActiveTool(tool.name);
            });
            toolGroup.appendChild(btn);
            this.toolsButtons[tool.name]=btn;
        }
        
        this.element.appendChild(toolGroup);
        document.body.prepend(this.element);

        this.setActiveTool('select');
    }

    _createButton(id,title,svgIconHtml){
        let button = document.createElement('button');
        button.id = id;
        button.innerHTML = svgIconHtml;
        button.title = title;
        button.classList.add('tool-button');
        return button;
    }

    setActiveTool(toolName){
        for(let name in this.toolsButtons){
            this.toolsButtons[name].classList.toggle('active',name === toolName);
        }
        if(this.onToolCahnge)
            this.onToolCahnge(toolName);

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

function getPageSize(){
    let body = document.body,
        html = document.documentElement;

    let width = Math.max( body.scrollWidth, body.offsetWidth, 
                           html.clientWidth, html.scrollWidth, html.offsetWidth );

    let height = Math.max( body.scrollHeight, body.offsetHeight, 
                            html.clientHeight, html.scrollHeight, html.offsetHeight );

    return { width: width, height: height };
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

        this.ribbon = new Ribbon((toolName) => {
            this.activeTool = toolName;
            this.updateCursor(this.canvas.mouseX, this.canvas.mouseY);
            console.log(`Active tool changed to: ${toolName}`);

            if(toolName !=='select'){
                this.selectedObject = null;
            }
        });

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

        let isDrawingTool = (this.activeTool==='rectangle' || 
                            this.activeTool==='line' || 
                            this.activeTool==='triangle' || 
                            this.activeTool==='pen');

        if(isDrawingTool){
            if(this.dragTarget.width < this.clickThreshold || 
                this.dragTarget.height < this.clickThreshold){
                    this.context_menu.deleteDrawable(this.dragTarget);
            }else{
                this.selectedObject = this.dragTarget;
            }
            this.ribbon.setActiveTool('select');

        }

        if(this.activetool==='pen'){
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
    let program = new Program();
    console.log('Program initialized');
    program.run();  
});
