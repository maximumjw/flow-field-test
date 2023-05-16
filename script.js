const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
canvas.width=800;
canvas.height=800;
ctx.fillStyle='white';
ctx.strokeStyle='white';
ctx.lineWidth=1;
var mouse={
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove',
    function(event){
    mouse.x=event.x;
    mouse.y=event.y;
    console.log(mouse);
});
class Particle{
 constructor(effect){
    this.effect=effect;
    this.x=Math.floor(Math.random()*this.effect.width);
    this.y=Math.floor(Math.random()*this.effect.height);
    this.speedX;
    this.speedY;
    this.speedModifier=Math.floor(Math.random()*2+1);
    this.history=[{x:this.x,y:this.y}];
    this.maxLength=Math.floor(Math.random()*60+20);
    this.angle=0;
    this.newAngle=0;
    this.andgleCorrector=Math.random()*0.5+0.01;
    this.timer=this.maxLength;
    //this.colors=['#4c026b','#730d9e','9622c7','#b44ae0'];
    this.colors=['#0000FF','#1E90FF','#00BFFF','#ADD8E6'];
    this.color=this.colors[Math.floor(Math.random()*this.colors.length)];
 }
 draw(context){
    context.beginPath();
    context.moveTo(this.history[0],this.history[1]);
    for(let i=0;i<this.history.length;i++){
        context.lineTo(this.history[i].x,this.history[i].y);
    }
    context.strokeStyle=this.color;
    context.stroke();
 }
 update(){
    //대충 동작함 
    this.timer--;
    if(this.timer>=1){
        let x=Math.floor(this.x/this.effect.cellSize);
        let y=Math.floor(this.y/this.effect.cellSize);
        let index=y*this.effect.cols+x;
        if(this.effect.flowField[index]){
            this.newAngle=this.effect.flowField[index].colorAngle;
            if(this.angle>this.newAngle){
                this.angle-=this.andgleCorrector;
            }
            else if(this.angle<this.newAngle){
                this.angle+=this.andgleCorrector;
            }
            else this.angle=this.newAngle;
        }

        //this.speedX=Math.cos(this.angle)*0.5;
        //this.speedY=Math.sin(this.angle)*0.5;

        this.dir=[-1,1];
        this.speedX=Math.cos(this.angle)*this.dir[Math.floor(Math.random()*2)]*0.5;
        this.speedY=Math.sin(this.angle)*this.dir[Math.floor(Math.random()*2)]*0.5;
        
        /*if(this.effect.flowField[index]&&!this.dir){
            if(this.effect.flowField[index].dir>=0){
                this.dir=1;
            }
            else if(this.effect.flowField[index].dir<0){
                this.dir=-1;
            }
        }

        if(this.effect.flowField[index]){
            if(this.dir>=0){
                this.speedX=Math.cos(this.angle);
                this.speedY=Math.sin(this.angle);
            }
            else if(this.dir<0){
                this.speedX=Math.cos(this.angle)*(-1);
                this.speedY=Math.sin(this.angle)*(-1);
            }
        }*/


        this.x+=this.speedX*this.speedModifier;
        this.y+=this.speedY*this.speedModifier;
       if(mouse.x-this.x<50&&mouse.x-this.x>-50&&mouse.y-this.y<50&&mouse.y-this.y>-50){
          this.speedModifier=5;
       
       
         
        }
        else{
          this.speedModifier=0.8;
          
          
        }
        
        this.history.push({x:this.x,y:this.y});
        if(this.history.length>this.maxLength){
            this.history.shift();
        }
    }
    else if(this.history.length>1){
        //this.dir=0;
        this.history.shift();
    }
    else{
        this.reset();
    }
 }
 reset(){
    let attempts=0;
    let resetSuccess=false;

    while(attempts<50&&!resetSuccess){
        attempts++;
        let textIndex=Math.floor(Math.random()*this.effect.flowField.length);
        if(this.effect.flowField[textIndex].alpha>0){
            this.x=this.effect.flowField[textIndex].x;
            this.y=this.effect.flowField[textIndex].y;
            this.history=[{x:this.x, y:this.y}];
            this.timer=this.maxLength*2;
            resetSuccess=true;
        }
    }
    if(!resetSuccess){
        this.x=Math.random()*this.effect.width;
        this.y=Math.random()*this.effect.height;
        this.history=[{x:this.x, y:this.y}];
        this.timer=this.maxLength*2;
    }
 }
}
class Effect{
    constructor(canvas,ctx){
        this.canvas=canvas;
        this.context=ctx;
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.particles=[];
        this.numberOfParticles=5000;
        this.cellSize=5;
        this.rows;
        this.cols;
        this.flowField=[];
        this.debug=true;
        this.init();
        
        window.addEventListener('keydown',e=>{
            if(e.key=='d')this.debug=!this.debug;
        });
        window.addEventListener('resize',e=>{
            this.resize(e.target.innerWidth,e.target.innerHeight);
        })
    }   
    drawText(){
        this.context.font='450px Impact';
        this.context.textAlign='center';
        this.context.textBaseline='middle';
        const gradient1=this.context.createLinearGradient(0,0,this.width,this.height);
        gradient1.addColorStop(0.2, 'rgb(255,0,0)');
        gradient1.addColorStop(0.4, 'rgb(0,255,0)');
        gradient1.addColorStop(0.6, 'rgb(150,100,100)');
        gradient1.addColorStop(0.8, 'rgb(0,255,255)');
        const gradient2=this.context.createLinearGradient(0,0,this.width,this.height);
        gradient2.addColorStop(0.2, 'rgb(255,255,0');
        gradient2.addColorStop(0.4, 'rgb(200,5,50');
        gradient2.addColorStop(0.6, 'rgb(150,255,255');
        gradient2.addColorStop(0.8, 'rgb(255,255,150');
        const gradient3=this.context.createRadialGradient(this.width*0.5,this.height*0.5,10,this.width*0.5,this.height*0.5,this.width);
        gradient3.addColorStop(0.2, 'rgb(0,0,255)');
        gradient3.addColorStop(0.4, 'rgb(200,255,0)');
        gradient3.addColorStop(0.6, 'rgb(0,0,255)');
        gradient3.addColorStop(0.8, 'rgb(0,0,0)');
        const gradient4=this.context.createRadialGradient(this.width*0.5,this.height*0.5,10,this.width*0.5,this.height*0.5,this.width);
        gradient4.addColorStop(0.2, 'rgb(128,0,128)');
        gradient4.addColorStop(0.4, 'rgb(218,112,214)');
        gradient4.addColorStop(0.6, 'rgb(255,0,255)');
        gradient4.addColorStop(0.8, 'rgb(128,0,128)');
        const gradient5=this.context.createRadialGradient(this.width*0.7,this.height*0.7,10,this.width*0.5,this.height*0.5,this.width);
        gradient5.addColorStop(0.1, 'rgb(0,0,225)');
        gradient5.addColorStop(0.4, 'rgb(30,144,255)');
        gradient5.addColorStop(0.6, 'rgb(0,191,255)');
        gradient5.addColorStop(0.8, 'rgb(173,216,230)');
        //27:35 색깔 실험 
        this.context.fillStyle=gradient5;
        this.context.fillText('SASA',this.width*0.5,this.height*0.5,this.width);

    }   
    init(){
        //create flow field
        this.rows=Math.floor(this.height/this.cellSize);
        this.cols=Math.floor(this.width/this.cellSize);
        this.flowField=[];

        //draw text
        this.drawText();

        //scan pixel data
        const pixels=this.context.getImageData(0,0,this.width,this.height).data;
        for(let y=0;y<this.height;y+=this.cellSize){
            for(let x=0;x<this.width;x+=this.cellSize){
                const index= (y*this.width+x)*4;
                const red=pixels[index];
                const green=pixels[index+1];
                const blue=pixels[index+2];
                const alpha=pixels[index+3];
                const grayscale=(red+green+blue)/3;
                const colorAngle=((grayscale/255)*6.28).toFixed(2);
                this.flowField.push({
                    x:x,
                    y:y,
                    alpha:alpha,
                    colorAngle:colorAngle,
                    dir:Math.random()*(-1)+0.5
                });
            }
        }   
        //create particles
        this.particles=[];
        for(let i=0;i<this.numberOfParticles;i++){
            this.particles.push(new Particle(this));
        }
        this.particles.forEach(particle=>particle.reset());
    }    
    drawGrid(){
        this.context.save();
        this.context.strokeStyle='white';
        this.context.lineWidth=0.3;
        for(let c=0;c<this.cols;c++){
            this.context.beginPath();
            this.context.moveTo(this.cellSize*c,0);
            this.context.lineTo(this.cellSize*c,this.height);
            this.context.stroke();
        }
        for(let r=0;r<this.rows;r++){
            this.context.beginPath();
            this.context.moveTo(0,this.cellSize*r);
            this.context.lineTo(this.width,this.cellSize*r);
            this.context.stroke();
        }
        this.context.restore();
    }  
    resize(width,height){
        this.canvas.width=width;
        this.canvas.height=height;
        this.width=this.canvas.width;
        this.height=this.canvas.height;
    }
    render(){
        if(this.debug) {
            this.drawGrid();
            this.drawText();
        }
        this.particles.forEach(particle=>{
            particle.draw(this.context);
            particle.update();
        });
    }
}

const effect=new Effect(canvas,ctx);

effect.render(ctx);
console.log(effect);
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.render();
    requestAnimationFrame(animate);
}
animate();