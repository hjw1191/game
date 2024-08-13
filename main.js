let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundimage, spaceshipimage, bulletimage, enemyimage,gameoverimage;
let gameOver=false ;// ture 이면 게임이 끝남
scroe=0;

// 우주선 좌표
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

let bulletList= [] //총알들을 저장하는 리스트
function Bullet(){
    this.x=0;
    this.y=0;
    this.inint=function(){
        this.x= spaceshipX + 12;
        this.y= spaceshipY
        this.alive=true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this)
    }
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit=function(){
        //총알.y <= 적군.y and
        //총알.x >= 적군.x and 총알.x <= 적군.x + 적군의넓이
        for(let i=0; i < enemyList.length; i++){
            {
        if(this.y <= enemyList[i].y &&  this.x >= enemyList[i].x 
            && this.x <= enemyList[i].x+40){
                //총알이 죽게됨 적군이 없어짐, 점수획득
                scroe++;
                this.alive = false //죽은총알
                enemyList.splice(i,1);
        
        }
        }
    }
}
}



function loadimage(){
    backgroundimage = new Image();
    backgroundimage.src = "images/background.gif";
    backgroundimage.onload = function() {
        console.log("Background image loaded");
    };

    spaceshipimage = new Image();
    spaceshipimage.src = "images/spaceship.png";
    spaceshipimage.onload = function() {
        console.log("Spaceship image loaded");
        
    };

    bulletimage = new Image();
    bulletimage.src = "images/bullet.png";
    bulletimage.onload = function() {
        console.log("Bullet image loaded");
       
    };

    enemyimage = new Image();
    enemyimage.src = "images/enemy.png";
    enemyimage.onload = function() {
        console.log("Enemy image loaded");
    
    }; 

    gameoverimage = new Image();
    gameoverimage.src = "images/gameover.png";
    gameoverimage.onload = function(){
        console.log("gameover image loaded");
    };    


}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList=[]
function Enemy(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.y=0
        this.x=generateRandomValue(0,canvas.width-48)
        enemyList.push(this)
    };
this.update=function(){
    this.y +=2 // 적군의 속도 조절 

    if(this.y >= canvas.height-48){
        gameOver = true;
        console.log(gameOver);
    }
}
}



let keysDown={};
function setupKeyborardListener(){ 
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true;
        console.log("무슨키",event.keyCode) ;
        console.log("키다운객체에 들어간 값은?", keysDown);
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];
        

        if(event.keyCode == 32){
            creatBullt() //총알생성
            

        }
    });
}

function creatBullt(){
    console.log("총알생성!");
    let b = new Bullet() ; // 총알하나생성
    b.inint();
    console.log("새로운 총알리스트", bulletList);
}


function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000);
}


function update(){
    if( 39 in keysDown) {
     spaceshipX += 5;    // 우주선의 속도
    }// right
    if(37 in keysDown){
        spaceshipX -= 5;
    } //left

    if(spaceshipX <=0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-40){
        spaceshipX = canvas.width-40;
    }
  
    // 우주선의 좌표값이 무한대로 업데이트가 아닌! 경기장안에만있게

    // 총알의 y좌표 업데이트하는 함수 호촐
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
        }
    }

    for(let i=0; i<enemyList.length;i++){
        enemyList[i].update();
    }
}



function render(){
    ctx.drawImage(backgroundimage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipimage,spaceshipX,spaceshipY);
    ctx.fillText(`Scroe:${scroe}`,20 ,20);
    ctx.fillStyle="white";
    ctx.font = "20px Arial";

    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletimage, bulletList[i].x, bulletList[i].y);
    }
    }

    for(let i = 0; i < enemyList.length; i++){
        ctx.drawImage(enemyimage, enemyList[i].x, enemyList[i].y);
    }

}

function main(){
    if(!gameOver){
    update(); // 좌표값을 업데이트 하고
    render(); // 그려주고
    requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverimage, 10, 100, 380, 380);
    }
}

loadimage();
setupKeyborardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고 오른쪽 누르면 x값 증가 왼쪽 감소
// 다시 render 그려준다.

//총알만들기
//1. 스페잇바를 누르면 총알 발사
//2. 총알 발사 = 총알의 y값이 -- , 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
//3. 발사된 총알들의 총알 배열에 저장
//4. 총알들은 x,y좌표값이 있어야한다.
//5. 총알 배열을 가지고 rander 그려준다.

//적군 만들기
//x,y,init,update
//적군의 위치가 랜덤
//적군은 밑으로 내려옴
//1초마다 하나씩  나옴
// 적군의 우주선이 바닥에 닿으면 게임오버
// 적군과 총알이 만나면 우주선이 사라짐 점수 1점 획득


//적군이 죽는다
// 총알.y <= 적군.y And
// 총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이 

// 닿았다.

// 총알이 죽게됨 적군의 우주선이 없어짐, 점수획득
