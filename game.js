//calling all the required html elements here
const scoreBox = document.getElementById("score");
const introductionMessage = document.getElementById("introduction");
const restartButton = document.getElementById("restart");
const perfectMessage = document.getElementById("perfect-area-message");
const endMessage = document.getElementById("end-message")
const endText = document.getElementById("end-text")
const homeOption = document.getElementById("home-option")

//this is the original state of our hero with no user input
let phase = "waiting";

let lastTimestamp;

//x is horizontal distance and y is vertical distance
let CharacterX;
let CharacterY;

//the screen has to be shifted each time the hero moves forward
let screenOffset;
let GamePlatform = [];
let bridges = [];

//player score 
let score = 0;

//dimensions of the canvas
// let windowQuery = window.innerWidth

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight - 700;
const GamePlatformHeight = 100;
const CharacterDistanceEdge = 10;
const paddingX = 100;
const perfectAreaSize = 10;
const backgroundSpeedMultiplier = 0.2;

const stretchingSpeed = 5; //speed of stick growing
const turningSpeed = 7; //speed of stick turning 
const heroSpeed = 6; //speed of hero walking
const transitioningSpeed = 2;
const fallingSpeed = 1; //speed of falling

const heroImage = new Image();
heroImage.src = "./assets/hero.png";
// heroImage.height = 50
// heroImage.width = 50

const heroWidth = 55;
const heroHeight = 65;

//positive messages (perfect area)
let messages = [
    "Marvellous!",
    "Miraculous!",
    "Stellar performance",
    "Absolutely splendid",
    "Glorious!",
    "You aced this",
    "Fantastic!",
    "Epic move"
]

//function to pick out these random messages
function randomMessage(){
    let x = Math.floor(Math.random() * 8)
    // console.log(x);
    perfectMessage.innerHTML = messages[x];

}
randomMessage()

//canvas element stuff
const canvas = document.getElementById("canvas-area");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// const body = document.getElementsByTagName("body")
// body.style.backgroundSize = "contain"




//this returns the last element of all arrays in the file
Array.prototype.last = function(){
    return this[this.length - 1];
};


//this is to change the value from radians to degrees
Math.sinus = function (degree){
    return Math.sin((degree / 180) * Math.PI);
};

//getting the name from localstorage
var nickname = localStorage.getItem("name");
console.log(nickname)

//this is to make the black intro text disappear in 5.1 seconds
setTimeout(() => {
    introductionMessage.style.visibility = "hidden"
},6100)


resetGame();
function resetGame(){
    phase = "waiting";
    lastTimestamp = undefined;
    screenOffset = 0;
    score = 0;
    restartButton.style.visibility = "hidden";
    // scoreBox.innerText = score;
    perfectMessage.style.visibility = "hidden";

    GamePlatform = [{x: 50, w: 50}];
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform(); 
    generatePlatform();

    bridges = [{x: GamePlatform[0].x + GamePlatform[0].w, length: 0, rotation: 0}];
    CharacterX = GamePlatform[0].x + GamePlatform[0].w - CharacterDistanceEdge;
    CharacterY = 0;
    draw()
}


function generatePlatform(){
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    const lastPlatform = GamePlatform[GamePlatform.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x = 
    furthestX + 
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
    const w = 
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    GamePlatform.push({x, w});

    randomMessage()
}

resetGame();

var timer = document.getElementById("time-count")

function startTimer(){
var time = 60;
timer.innerText = 60;
var timeLeft = setInterval(() => {
    time--;
    timer.innerText = time;
    if (time == 0 && score > 6){
        endText.innerHTML = `FABULOUS ${nickname} !<br>
        Your score is ${score}`
        endMessage.style.display = "block"
        restartButton.style.visibility = "visible"
        clearInterval(timeLeft)
        localStorage.setItem("score",score)
    }
    else if (score < 6 && time == 0){
        endText.innerHTML = `WELL DONE ${nickname} !<br>
        Your score is ${score}`
        clearInterval(timeLeft)
        endMessage.style.display = "block"
        restartButton.style.visibility = "visible"
        localStorage.setItem("score",score)


    }
    if (phase == "falling"){
        endText.innerHTML = `BAD LUCK! ${nickname} !<br>
                Your score is ${score}`
                clearInterval(timeLeft)
                endMessage.style.display = "block"
                restartButton.style.visibility = "visible"
                // localStorage.setItem("score",score)
    }
},1000)
}
startTimer()

homeOption.onclick = () => {
    window.location.href = "./index.html";
}


//when user holds the mouse, the stick grows
window.addEventListener("mousedown", function (event){
    if (phase === "waiting"){
        lastTimestamp = undefined;
        phase = "stretching";
        window.requestAnimationFrame(animate);
        introductionMessage.style.visibility = "hidden"
    }
});

//it stops growing here
window.addEventListener("mouseup", function (event){
    if (phase === "stretching"){
        phase = "turning";
        introductionMessage.style.visibility = "hidden"        
    }
});

//same except we can press any key for the task to perform itself
window.addEventListener("keydown", function (event){
    if (phase === "waiting"){
        lastTimestamp = undefined;
        phase = "stretching";
        window.requestAnimationFrame(animate);
        introductionMessage.style.visibility = "hidden"
    }
});

window.addEventListener("keyup", function (event){
    if (phase === "stretching"){
        phase = "turning";
        introductionMessage.style.visibility = "hidden"
    }
});


restartButton.addEventListener('click', function(event){
    event.preventDefault();
    resetGame();
    restartButton.style.visibility = "hidden";
    perfectMessage.style.visibility = "hidden";
    endMessage.style.display = "none"
    startTimer()
    score = 0;
    scoreBox.innerText = score
});



window.requestAnimationFrame(animate);

function animate(timestamp){
    if (!lastTimestamp){
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
    }

    switch (phase){

        case "waiting":
            return;

        case "stretching":{
            bridges.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
            break;
        }

        case "turning": {
            bridges.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

            if (bridges.last().rotation > 90){
                bridges.last().rotation = 90;

                const [nextPlatform] = thePlatformTheStickHits();
                if (nextPlatform){
                    scoreBox.innerHTML = score;

                    generatePlatform();
                }
                phase = "walking";
            }
            break;
        }
        case "walking": {
            CharacterX += (timestamp - lastTimestamp) / heroSpeed;
            const [nextPlatform] = thePlatformTheStickHits();
            if(nextPlatform){
                const maxHeroX = nextPlatform.x + nextPlatform.w - CharacterDistanceEdge;
                if(CharacterX > maxHeroX){
                    CharacterX = maxHeroX;
                    phase = "transitioning";
                score++;
                scoreBox.innerText = score;
                    
                }
            } else {
                const maxHeroX = bridges.last().x + bridges.last().length + heroWidth;
                if (CharacterX > maxHeroX){
                    CharacterX = maxHeroX;
                    phase = "falling";
                }
            }
            break;
        }
        case "transitioning": {
            screenOffset += (timestamp - lastTimestamp) / transitioningSpeed;
            const [nextPlatform] = thePlatformTheStickHits();
            if (screenOffset > nextPlatform.x + nextPlatform.w - paddingX){
                bridges.push({
                    x: nextPlatform.x + nextPlatform.w,
                    length: 0,
                    rotation: 0
                });
                phase = "waiting";
            }
            break;
        }
        case "falling": {
            if(bridges.last().rotation < 180)
            bridges.last().rotation += (timestamp - lastTimestamp) / turningSpeed;
            CharacterY += (timestamp - lastTimestamp) / fallingSpeed;
            const maxHeroY =
            GamePlatformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
            if(CharacterY > maxHeroY){
                endText.innerHTML = `BAD LUCK ${nickname} !<br>
                Your score is ${score}`
                clearInterval(timeLeft)
                endMessage.style.display = "block"
                restartButton.style.visibility = "visible"
                localStorage.setItem("score",score)

                return;
            }
            break;
        }
        
    }
    draw();
    window.requestAnimationFrame(animate);
    lastTimestamp = timestamp;
}

function thePlatformTheStickHits(){
    const stickRotation = bridges.last().rotation;

    const stickFarX = bridges.last().x + bridges.last().length;
    const platformTheStickHits = GamePlatform.find((platform) => {
        const platformFarX = platform.x + platform.w;
        return platform.x < stickFarX && stickFarX < platformFarX;
    });

    if (
        platformTheStickHits &&
        isStickWithinPerfectArea(platformTheStickHits, stickFarX)
    ) {
        return [platformTheStickHits, true];
    }
    return [platformTheStickHits, false];
}

function isStickWithinPerfectArea(platform, stickFarX){
    const perfectAreaStartX = platform.x + platform.w / 2 - perfectAreaSize / 2;
    const perfectAreaEndX = platform.x + platform.w / 2 + perfectAreaSize / 2;

    perfectMessage.style.visibility = "visible";
    setTimeout(() => {
        perfectMessage.style.visibility = "hidden"
    },400)

    return perfectAreaStartX < stickFarX && stickFarX < perfectAreaEndX;

}

function draw(){
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.translate(
        (window.innerWidth - canvasWidth) / 2 - screenOffset,
        (window.innerHeight - canvasHeight) / 2
    );
    drawPlatforms();
    drawCharacter();
    drawBridges();
    ctx.restore();
}

function drawPlatforms(){
    GamePlatform.forEach(({ x, w}) =>{
        ctx.fillStyle = '#222222';
        ctx.fillRect(
            x,
            canvasHeight - GamePlatformHeight,
            w,
            GamePlatformHeight + (window.innerHeight - canvasHeight) / 2

        );
    });
}

function drawCharacter(){
    ctx.drawImage(
         heroImage,
         CharacterX - heroWidth,
         CharacterY + canvasHeight - GamePlatformHeight - heroHeight + 2,
         heroWidth,
         heroHeight - 4
    )
 }

function drawBridges(){
    bridges.forEach((stick) =>{
        ctx.save();

        ctx.translate(stick.x, canvasHeight - GamePlatformHeight);
        ctx.rotate((Math.PI / 180) * stick.rotation);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -stick.length);
        ctx.stroke();
        ctx.restore();
    });
}


