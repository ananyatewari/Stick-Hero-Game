//calling all the required html elements here
const scoreBox = document.getElementById("score"); 
const introductionMessage = document.getElementById("introduction"); 
const restartButton = document.getElementById("restart");
const perfectMessage = document.getElementById("perfect-area-message");
const endMessage = document.getElementById("end-message")
const endText = document.getElementById("end-text")
const homeOption = document.getElementById("home-option") //this redirects users to the home page once the game is over

//audio for background/game 
const jumpaudio = new Audio("./assets/jump.mp3")
const win = new Audio("./assets/win.mp3")
const lose = new Audio("./assets/lose.mp3")
const bgaudio = new Audio("./assets/bgmusic.mp3")


//playing the background music once the webpage loadss
window.onload = () => {
    bgaudio.play();
    bgaudio.loop = true;
    bgaudio.volume = 0.7;
}

//this is the original state of our hero with no user input
let phase = "waiting";
let lastTimeValue;

//x is horizontal distance and y is vertical distance of the character
let CharacterX; //this is used for placement
let CharacterY; //of the hero

//the screen has to be shifted each time the hero is donw moves forward
let screenOffset;

//this will keep track of all the platforms that we generate
let GamePlatform = [];

//this will keep track of all the bridges that are generated
let sticks = [];

//player score 
let score = 0;

//dimensions of the canvas
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight - 1000;
//let windowQuery = window.innerWidth


//PLEASE NOTE
//hero is the character in the game
const PlatformHeight = 100;
const CharacterDistanceEdge = 9;
const paddingX = 100;
const areasize = 10;
const backgroundSpeedMultiplier = 0.2;

const stickStretchingSpeed = 5; //speed of stick growing
const turningSpeed = 7; //speed of stick turning 
const heroSpeed = 6; //speed of hero walking
const transitioningSpeed = 2; //speed of the viewport shifting
const fallingSpeed = 1; //speed of falling

const heroImage = new Image();
heroImage.src = "./assets/hero.png";
// heroImage.height = 50
// heroImage.width = 50


//these are the dimensions of the hero
const heroWidth = 55;
const heroHeight = 65;

//calling the canvas element from html 
const canvas = document.getElementById("canvas-area");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d"); //this is beind done to tell the browser about what type of image do we paint on our page

//to put image in background
// const body = document.getElementsByTagName("body")
// body.style.backgroundSize = "contain"


//this is an array of messages that appears each time the user earns a point
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

//function to pick out these random messages and display
function randomMessage(){
    let x = Math.floor(Math.random() * 8)
    // console.log(x);
    perfectMessage.innerHTML = messages[x];
    // paintPlatform()

}
randomMessage()

//this returns the last element of all arrays in the file since there is no built in function for that
Array.prototype.last = function(){
    return this[this.length - 1];
};


//this is to change the value from radians to degrees
// Math.sinus = function (degree){
//     return Math.sin((degree / 180) * Math.PI);
// };

//getting the name from localstorage to display once the game endds
var nickname = localStorage.getItem("name");
console.log(nickname)

//this is to make the black instruction text disappear in 6.1 seconds
setTimeout(() => {
    introductionMessage.style.visibility = "hidden"
},6100)

//this is called when we click the restart button
resetGame();
function resetGame(){
    phase = "waiting";
    score = 0;
    screenOffset = 0;
    lastTimeValue = undefined;
    perfectMessage.style.visibility = "hidden";
    restartButton.style.visibility = "hidden";
    // scoreBox.innerText = score;

    GamePlatform = [{x: 50, y: 50}]; 
    //x gives us the horizontal coordinate length of the platform
    //y gives us the vertical

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
    generatePlatform(); //added this function multiple times to
    //compensate whenever the user skips a few blocks and moves forward in one turn

    sticks = [{x: GamePlatform[0].x + GamePlatform[0].y, length: 0, rotation: 0}];
    //length and rotation values are initialized to zero

    CharacterY = 0; //this suggests that the character starts at the top of the platform
    CharacterX = GamePlatform[0].x + GamePlatform[0].y - CharacterDistanceEdge;
    //x is the distance of the character from the x axis. first the width of x from axis + width of x
    //then subtracting to get the character a little inside the block

    draw();
}


//this function helps in generating blocks on which the hero walks
function generatePlatform(){
    //width of the blocks
    const maximumWidth = 100;
    const minimumWidth = 20;

    //gap between the blocks
    const minimumSpace = 50;
    const maximumSpace = 213;

    const blockAtLast = GamePlatform[GamePlatform.length - 1]; //this gives us the last platform using indexes in the gameplatform array
    let previouslyGenerated = blockAtLast.x + blockAtLast.y; //adding the values of x and y of the previous bloock

    const x = previouslyGenerated + minimumSpace +Math.floor(Math.random() * (maximumSpace - minimumSpace));
    //adding lastforx ensures that the platform is generated after the previously generated platform

    const y = minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    GamePlatform.push({x, y}); //adding these platforms to the empty array that we created

    randomMessage()
}

resetGame();

const winArray = [
    "You're the boss of the game, ",
    "You're on fire ! Victory looks good on you, ",
    "Victory is yours ! Well played ",
    "You've got the magic touch ! Way to go ",
    "Winner winner, pixelated dinner ! Celebrate your triumph "
]

const loseArray = [
    "Almost there! A little setback won't stop your gaming journey ",
    "Defeat today, glory tomorrow! Keep honing your skills ",
    "Oopsie daisy! It happens to the best of us. Ready for a rematch ? ",
    "Chin up, champ! You're just one game away from a comeback ",
    "A valiant effort! Shake off the loss and get ready for the next game "
]

function randomNumber(){
    let a = Math.floor(Math.random() * 5)
    return a
}

//function for timer
var timer = document.getElementById("time-count")
var timeLeft;

function startTimer(){
var time = 50;
timer.innerText = 50;

var timeLeft = setInterval(() => {
    time--;
    timer.innerText = time;
    if (time <= 0){
        endText.innerHTML = `${winArray[randomNumber()]}${nickname} !<br>
        Your score is ${score}`
        endMessage.style.display = "block"
        restartButton.style.visibility = "visible"
        clearInterval(timeLeft)
        localStorage.setItem("score",score)
        win.play()
    }

    // else if (score < 6 && time == 0){
    //     endText.innerHTML = `${winArray(randomNumber)}${nickname} !<br>
    //     Your score is ${score}`
    //     clearInterval(timeLeft)
    //     endMessage.style.display = "block"
    //     restartButton.style.visibility = "visible"
    //     localStorage.setItem("score",score)
    //     win.play()
    // }


    if (phase == "falling"){
        endText.innerHTML = `${loseArray[randomNumber()]}${nickname} <br>
                Your score is ${score}`
                clearInterval(timeLeft)
                endMessage.style.display = "block"
                restartButton.style.visibility = "visible"
                localStorage.setItem("score",score)
                lose.play()
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
        lastTimeValue = undefined;
        phase = "stretching";
        window.requestAnimationFrame(animateStickHero);
        introductionMessage.style.visibility = "hidden"
        jumpaudio.play()
        jumpaudio.volume = 1
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
        lastTimeValue = undefined;
        phase = "stretching";
        window.requestAnimationFrame(animateStickHero);
        introductionMessage.style.visibility = "hidden"
        jumpaudio.play()
        jumpaudio.volume = 1
    }
});

window.addEventListener("keyup", function (event){
    if (phase === "stretching"){
        phase = "turning";
        introductionMessage.style.visibility = "hidden"
    }
});

window.addEventListener ("touchstart", function (event){
    if (phase === "waiting"){
        lastTimeValue = undefined;
        phase = "stretching";
        window.requestAnimationFrame(animateStickHero);
        introductionMessage.style.visibility = "hidden"
        jumpaudio.play()
        jumpaudio.volume = 1
    }
})

//this is primarily for mobile responsiveness
window.addEventListener ("touchend", function (event) {
    if (phase === "stretching"){
        phase = "turning";
        introductionMessage.style.visibility = "hidden"
    }
})

//what all happens when we click the start button
restartButton.addEventListener('click', function(event){
    event.preventDefault();
    resetGame();
    restartButton.style.visibility = "hidden";
    perfectMessage.style.visibility = "hidden";
    endMessage.style.display = "none"
    startTimer()
    score = 0;
    scoreBox.innerText = score
    localStorage.setItem("score",score)

});

//to change the colour of the blocks
// function randomColour(){
//     var c = Math.floor(Math.random() * 6)
//     console.log(c);
//     return c
// }

// var colours = [
//     "#b38b6d",
//     "#622A0F",
//     "#3A1F04",
//     "#613613",
//     "#795C32",
//     "#7F461B"
// ]

// let colourOfTheBlock = colours[randomColour()]


window.requestAnimationFrame(animateStickHero); //this is an inbuilt funciton to initiate smooth transitions, continuous animation
//browser will call this function each time before a new generation takes place(paint in this case)


function animateStickHero(time){

    if (!lastTimeValue){
        lastTimeValue = time; //initially, lasttimevalue is set to undefined but later we set it equal to time and then call the animation function
        window.requestAnimationFrame(animateStickHero); //calling this function again if there is no value for the variable
        return;
    }

    switch (phase){

        case "waiting":
            return;

        case "stretching":{
            sticks.last().length += (time - lastTimeValue) / stickStretchingSpeed;
            break;
        }

        case "turning": {
            //it is needed to add this to make the turning smooth
            sticks.last().rotation += (time - lastTimeValue) / turningSpeed;

            if (sticks.last().rotation > 90){ //to see if it is rotating greater to 90 or not. if not, change it to 90
                sticks.last().rotation = 90; 

                const [nextPlatform] = thePlatformTheStickHits(); 
                if (nextPlatform) { //if the stick hits the next platform successfully, update score and make new platform
                    scoreBox.innerHTML = score;
                    generatePlatform();
                }
                phase = "walking";
            }
            break;
        }
        case "walking": {
            CharacterX += (time - lastTimeValue) / heroSpeed;
            const [nextPlatform] = thePlatformTheStickHits();

            if(nextPlatform){
                const maximumhero = nextPlatform.x + nextPlatform.y - CharacterDistanceEdge; 
                //minus edge distance to make a short gap between the end of the block and the hero

                if(CharacterX > maximumhero){
                    CharacterX = maximumhero;
                    phase = "transitioning"; //player won case
                score++;
                localStorage.setItem("score",score)
                scoreBox.innerText = score;

                // randomColour()
                // paintPlatform()
                }
            } 
            
            else {
                const maximumhero = sticks.last().x + sticks.last().length + heroWidth;
                //add the width of the hero to make the hero travel a short distance before falling

                if (CharacterX > maximumhero){
                    CharacterX = maximumhero;
                    phase = "falling"; //player lost case
                }
            }
            break;
        }
        case "transitioning": { //when thr player places the stick successfully, the screen view shifts
            screenOffset += (time - lastTimeValue) / transitioningSpeed;

            const [nextPlatform] = thePlatformTheStickHits();

            if (screenOffset > nextPlatform.x + nextPlatform.y - paddingX){ //paddingx is a minimum distance
                sticks.push({ //pushing the properties of the bridge in objects in the intiial array
                    x: nextPlatform.x + nextPlatform.y,
                    length: 0,
                    rotation: 0
                });
                phase = "waiting"; //changes to the initial phase waiting for user input
            }
            break;
        }
        case "falling": { //when hero falls after missing the stick

            if(sticks.last().rotation < 180) //checking if the bridge has fallen or not

            sticks.last().rotation += (time - lastTimeValue) / turningSpeed;
            //this is for the bridge to rotate when hero falls

            CharacterY += (time - lastTimeValue) / fallingSpeed;
            //this is the vertical falling  

            const maxHeroY = PlatformHeight + 100 + (window.innerHeight - canvasHeight) / 2; 
            //this is the vertical distance travelled by hero while falling
            
            if(CharacterY > maxHeroY){
                // endText.innerHTML = `BAD LUCK ${nickname} !<br>
                // Your score is ${score}`
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
    window.requestAnimationFrame(animateStickHero);
    lastTimeValue = time;
}


function thePlatformTheStickHits(){

    const stickFarDistance = sticks.last().x + sticks.last().length;

    const platformTheStickHits = GamePlatform.find((platform) => { //this identifies the platform on which the stick hits
        const platformX = platform.x + platform.y;
        return platform.x < stickFarDistance && stickFarDistance < platformX;
        //returns both conditions for checking
    });

    if (
        platformTheStickHits && areaCheck (platformTheStickHits, stickFarDistance)
    ) {
        return [platformTheStickHits, true];
    }
    return [platformTheStickHits, false];
}


//to check if the stick hits within the specified area of the block
function areaCheck (platform, stickFarDistance){
    const areastart = platform.x + platform.y / 2 - areasize / 2;
    const areaend = platform.x + platform.y / 2 + areasize / 2;

    perfectMessage.style.visibility = "visible";
    setTimeout(() => {
        perfectMessage.style.visibility = "hidden"
    },400)

    return areastart < stickFarDistance && stickFarDistance < areaend; 
    //this returns both the conditions whether the stick distance covered is greater than the area size

}

function draw(){

    context.save();
    context.clearRect(0, 0, window.innerWidth, window.innerHeight); 
    //this clears the entire canvas by adding a transparent rectangle over the entire surface

    context.translate(
        (window.innerWidth - canvasWidth) / 2 - screenOffset,
        (window.innerHeight - canvasHeight) / 2
    ); //this shifts the entire canvas with each stick movement of the hero

    showCharacter();
    paintPlatform();
    drawStick();
    context.restore(); //get rid of temporary changes
}

// function paintPlatform(){
    //     GamePlatform.forEach(({x, w}) =>{
        //         context.fillStyle = colours[randomColour()];
        
        //         context.fillRect(
            //             x,
            //             canvasHeight - PlatformHeight,
            //             w,
            //             PlatformHeight + (window.innerHeight - canvasHeight) / 2
        //);
    //});
//}
//this is being done to change the colour of the randomly generated blocks

function paintPlatform(){  //this helps in generating the blocks on which the hero walks on

    GamePlatform.forEach((coordinateObject)=>{

    // for (let i = 0; i < GamePlatform.length; i++){
        context.fillStyle = "#351E19"
    //     break

        context.fillRect(
            coordinateObject.x,
            canvasHeight - PlatformHeight,
            coordinateObject.y,
            PlatformHeight + (window.innerHeight - canvasHeight) / 2
        )
    })
}


//this does not draw the character, it displays it on the screen with the image url written above
function showCharacter(){
    context.drawImage(
         heroImage, //this references to the image url
         CharacterX - heroWidth, //this gives the x coordinate
         CharacterY + canvasHeight - PlatformHeight - heroHeight + 2, //this gives the y coordinate

         heroWidth, //this tells the dimensions 
         heroHeight - 4 //of the hero while playing the game
    )
}

function drawStick(){
    sticks.forEach((stick) =>{
        
        context.save(); //this is used to make temporary changes

        context.translate(stick.x, canvasHeight - PlatformHeight); //position where stick is to be drawn
        context.rotate((Math.PI / 180) * stick.rotation); //converted in degrees 

        context.beginPath(); //drawing path start freshly
        context.lineWidth = 4.1;

        context.moveTo(0, 0); 
        context.lineTo(0, -stick.length); //starting and ending point
        context.stroke(); //main drawing
        
        context.restore(); //restore the temporary changes (undo them)

    });
}


