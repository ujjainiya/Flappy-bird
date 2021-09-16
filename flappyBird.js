// SELECT canva
const canva = document.getElementById("bird");
const context = canva.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI/180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "images/sprite.png";



// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// START BUTTON COORD
const startBtn = {
    x : 120,
    y : 250,
    w : 75,
    h : 25
}

// CONTROL THE GAME
canva.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
           
            break;
        case state.game:
            if(bird.y - bird.radius <= 0) return;
            bird.flap();
           
            break;
        case state.over:
            let rect = canva.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});


// BACKGROUND
const bg = {
    X1 : 0,
    Y1 : 0,
    w : 300,
    h : 225,
    x : 0,
    y : canva.height - 225,
    
    draw : function(){
        context.drawImage(sprite, this.X1, this.Y1, this.w, this.h, this.x, this.y, this.w, this.h);
        
        context.drawImage(sprite, this.X1, this.Y1, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}

// FOREGROUND
const fg = {
    X1: 300,
    Y1: 0,
    w: 220,
    h: 150,
    x: 0,
    y: canva.height - 150,
    
    dx : 2,
    
    draw : function(){
        context.drawImage(sprite, this.X1, this.Y1, this.w, this.h, this.x, this.y, this.w, this.h);
        
        context.drawImage(sprite, this.X1, this.Y1, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

// BIRD
const bird = {
    animation : [
        {X1: 276, Y1 : 112},
        {X1: 276, Y1 : 139},
        {X1: 276, Y1 : 164},
        {X1: 276, Y1 : 139}
    ],
    x : 50,
    y : 150,
    w : 35,
    h : 26,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.2,
    jump : 3,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        let bird = this.animation[this.frame];
        
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.drawImage(sprite, bird.X1, bird.Y1, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        context.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    update: function(){
         this.period = state.current == state.getReady ? 10 : 5;
        this.frame += frames%this.period == 0 ? 1 : 0;
        
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.y = 150; 
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= canva.height - fg.h){
                this.y = canva.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    
                }
            }
            
             if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    }
}


const getReady = {
    X1 : 0,
    Y1 : 228,
    w : 173,
    h : 152,
    x : canva.width/2 - 173/2,
    y : 80,
    
    draw: function(){
        if(state.current == state.getReady){
            context.drawImage(sprite, this.X1, this.Y1, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

const gameOver = {
    X1 : 175,
    Y1 : 228,
    w : 225,
    h : 202,
    x : canva.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(state.current == state.over){
            context.drawImage(sprite, this.X1, this.Y1, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}


const pipes = {
    position : [],
    
    top : {
        X1 : 553,
        Y1 : 0
    },
    bottom:{
        X1 : 502,
        Y1 : 0
    },
    
    w : 53,
    h : 400,
    gap : 85,
    maxYPos : -150,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            context.drawImage(sprite, this.top.X1, this.top.Y1, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            context.drawImage(sprite, this.bottom.X1, this.bottom.Y1, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : canva.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            // COLLISION 
            // TOP PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
               
            }
            // BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                
            }
            
            //  PIPES TO THE LEFT
            p.x -= this.dx;
            
           
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

// SCORE
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        context.fillStyle = "#FFF";
        context.strokeStyle = "#000";
        
        if(state.current == state.game){
            context.lineWidth = 2;
            context.font = "35px Teko";
            context.fillText(this.value, canva.width/2, 50);
            context.strokeText(this.value, canva.width/2, 50);
            
        }else if(state.current == state.over){
            // SCORE VALUE
            context.font = "25px Teko";
            context.fillText(this.value, 225, 186);
            context.strokeText(this.value, 225, 186);
            // BEST SCORE
            context.fillText(this.best, 225, 228);
            context.strokeText(this.best, 225, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}

// DRAW
function draw(){
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canva.width, canva.height);
    
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();