localStorage.clear()

const textBox = document.getElementById("text-content");
const introText = document.getElementById("intro-text");
const playNow = document.getElementById("play-now");
const aboutGame = document.getElementById("about");
const madeBy = document.getElementById("made-by");
const rules1 = document.getElementById("rules1");
const more = document.getElementById("more");
const rules2 = document.getElementById("rules2");
const backHome = document.getElementById("back-home");
const enterName = document.getElementById("enter-name");
const startPlaying = document.getElementById("start-playing");
const startGame = document.getElementById("start-game");
const playerName = document.getElementById("player-name");
const popupHover = document.getElementById("popup-hover");
const credits = document.getElementById("credits");
const closePopup = document.getElementById("close-popup");
const creditsPopup = document.getElementById("credits-popup");


const nameValue = document.getElementById("name-value");
const nicknameValue = document.getElementById("nickname-value")
//use this to put an ending message

window.onload = () => {
    introText.style.display  = "block";
    madeBy.style.display = "block";
}

aboutGame.onclick = () => {
    rules1.style.display = "block";
    introText.style.display = "none";
}

more.onclick = () => {
    rules1.style.display = "none";
    rules2.style.display = "block";
}

backHome.onclick = () => {
    rules2.style.display = "none";
    introText.style.display = "block";
}

playNow.onclick = () => {
    enterName.style.display = "block";
    introText.style.display = "none";
}

startPlaying.onclick = () => {
    enterName.style.display = "block";
    rules2.style.display = "none";
}

startGame.onclick = () => {
localStorage.setItem("name", nicknameValue.value);

    if (nameValue.value.length > 0 && nicknameValue.value.length > 0)
    window.location.href = "game.html";

    else{
        if (nameValue.value.length == 0 && nicknameValue.value.length == 0)
            alert("Enter your name and nick name")
        else if (nameValue.value.length == 0)
            alert("Enter your name");
        else if (nicknameValue.value.length == 0)
            alert("Enter you nick name")
    }
}

//setting the item in local storage so that we can access it in game.js

credits.addEventListener ("mouseover", () =>{
    popupHover.style.display = "block";
})

credits.addEventListener ("mouseleave", () => {
    popupHover.style.display = "none";
})

credits.onclick = () => {
    creditsPopup.style.display = "block";
    closePopup.style.display = "block";
}

closePopup.onclick = () => {
    creditsPopup.style.display = "none";
    closePopup.style.display = "none";
}


