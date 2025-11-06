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

class Rectangle extends Drawable{
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
        let halfWidth = (this.width * this.scale.x ) / 2;
        let halfHeight = (this.height * this.scale.y ) / 2;
        let halfHandle = this.handleSize / 2;

        let left = this.position.x - halfWidth;
        let right = this.position.x + halfWidth;
        let top = this.position.y - halfHeight;
        let bottom = this.position.y + halfHeight;


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


class ContextMenu{

    context_menu_div =null
    canvas=null
    drawables=null

    rightClickedTarget=null;
    constructor(_canvas,_drawables){
        this.canvas=_canvas;
        this.drawables=_drawables;

    }

    

    build(){

        this.context_menu_div = document.createElement("div")
        this.context_menu_div.classList.add("context-menu")
        this.context_menu_div.id = "custom-context-menu"

        this.context_menu_div.innerHTML =`
        <ul>
            <li id="menu-bring-front">Bring to Front</li>
            <li id="menu-send-back">Send to Back</li>
            <li class="separator"></li>
            <li id="menu-delete" style="color: red;">Delete</li>
        </ul>
        `
        
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

        document.getElementById('menu-delete')
        .addEventListener('click',()=>{
            if(!this.rightClickedTarget)return;
            this.deleteDrawable(this.rightClickedTarget)

        })
        document.getElementById('menu-bring-front')
        .addEventListener('click',()=>{
            if(!this.rightClickedTarget)return;
            this.bringToFront(this.rightClickedTarget)

        })
        document.getElementById('menu-send-back')
        .addEventListener('click',()=>{
            if(!this.rightClickedTarget)return;
            this.sendToBack(this.rightClickedTarget)

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
    clickThreshold=1;

    context_menu=null;

    constructor(){

        this.canvas = new Canvas('main-canvas');

        let pageSize = getPageSize();

        this.canvas.setSize(pageSize.width, pageSize.height);
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
            return;
        }

        this.updateMouseUp(mouseX,mouseY)

    }

    updateMouseUp(mouseX, mouseY){
        if(this.isDragging){
            if(this.dragTarget && !this.mouseMovedSinceDown){
                this.handleClick(mouseX, mouseY);
            }

            this.isDragging = false;
            this.resizeHandle = null;
        }

        this.updateCursor(mouseX, mouseY);
    }

    updateMouseDown(mouseX, mouseY){
        let deltaX = mouseX -  this.lastMouseX;
        let deltaY = mouseY -  this.lastMouseY;
        if(this.isDragging){

            this.mouseMovedSinceDown = !this.mouseMovedSinceDown && (Math.abs(deltaX) > this.clickThreshold || Math.abs(deltaY) > this.clickThreshold);

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
        
        let foundTarget =false;
        for(let i = this.drawables.length -1; i >=0 ; i--){
            let drawable = this.drawables[i];
            let handle = drawable.getHandleAtPoint(mouseX, mouseY);
            if(!handle)continue;

            this.dragTarget = drawable;
            this.resizeHandle = handle;
            foundTarget=true;
            break;
        }

        if(foundTarget)return;

        this.dragTarget=null
        this.resizeHandle=null


    }

    handleDrag(deltaX, deltaY){
        if(!this.dragTarget || !this.resizeHandle) 
            return;

        let target = this.dragTarget
        
        switch(this.resizeHandle){
            case 'body':
                target.position.x+=deltaX
                target.position.y+=deltaY
                break
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
        console.log(`Clicked on ${this.dragTarget.color} rectangle`)

    }

    updateCursor(mouseX, mouseY){
        let cursor = 'default'

        if(this.isDragging)return;
        for(let i = this.drawables.length-1;i>=0;i--){

            if(this.drawables[i]!==this.dragTarget &&
                this.dragTarget!==null
            )continue;

            let handle = this.drawables[i].getHandleAtPoint(mouseX,mouseY);
            if(!handle)continue;
            switch (handle) {
                case 'body':
                    cursor = 'move';
                    break;
                case 'left':
                case 'right':
                    cursor = 'ew-resize';
                    break;
                case 'top':
                case 'bottom':
                    cursor = 'ns-resize';
                    break;
                case 'top-left':
                case 'bottom-right':
                    cursor = 'nwse-resize';
                    break;
                case 'top-right':
                case 'bottom-left':
                    cursor = 'nesw-resize';
                    break;
            }
            break;

        }
        this.canvas.canvas.style.cursor=cursor
    }


    draw(){
        this.canvas.clear();
        for(const drawable of this.drawables){
            drawable.draw(this.canvas.ctx);
        }

        if(this.dragTarget){
            this.dragTarget.drawHandles(this.canvas.ctx);
        }

    }
}


window.addEventListener('load', () => {
    let program = new Program();
    console.log('Program initialized');
    program.run();  
});
