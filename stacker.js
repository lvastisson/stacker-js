var c = document.querySelector("#myCanvas");
var ctx = c.getContext("2d");

var areaWidth = 800;
var areaHeight = 1200;

var spacePressed = false;
var spaceReleased = true;
var barSize = 200;
var barPos = areaWidth / 2;
var barHeight = areaHeight - 100;
var barDir = 1;
var barSpeed = 10;
var speedIncreaseIncrement = 2;
var stepsBeforeSpeedIncrease = 5;

var score = 0;

var bars = [new Bar(areaWidth / 2, areaHeight - 50,barSize)];

var colors = ['white', 'red', 'gray', 'yellow', 'orange', 'purple', 'green', 'pink'];

var theGameLoop;
var gameLoopOn = true;

function runGame() {

    for (let index = 0; index < 100; index++) {
        
        console.log(getLoopingIndex(index, colors.length - 1));
    }

    initializeGame();
    gameLoop();
}

function initializeGame() {
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32 && spaceReleased) {
            event.preventDefault();
            
            spacePressed = true;
            spaceReleased = false;
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 32) {
            event.preventDefault();
            
            spaceReleased = true;
        }
    });
}

function gameLoop() {
    if(spacePressed) {
        var posDiff = barPos - bars[bars.length - 1].pos

        if (Math.abs(posDiff) >= barSize / 2 + bars[bars.length - 1].size / 2) {
            callGameOver();
        }
        else {
            score++;
        }

        barSize = barSize - (Math.abs(posDiff));
        barPos -= posDiff / 2;
        bars.push(new Bar(barPos, barHeight, barSize));
        barHeight -= 50;
        spacePressed = false;

        if (bars.length % stepsBeforeSpeedIncrease == 0) {
            barSpeed += speedIncreaseIncrement;
        }        
    }
    else if (barPos < 200 || barPos > areaWidth - 200) {
        barDir = -barDir;
    }

    barPos += barDir * barSpeed;

    render();

    clearTimeout(theGameLoop);
    if (gameLoopOn)
        theGameLoop = setTimeout(gameLoop, 50);
}

function render() {
    ctx.clearRect(0, 0, areaWidth, areaHeight);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, areaWidth, areaHeight);

    for (let i = 0; i < bars.length; i++) {
        const elem = bars[i];

        ctx.fillStyle = colors[getLoopingIndex(i, colors.length)];
        
        ctx.fillRect(elem.pos - (elem.size / 2), elem.height, elem.size, 50)
    }

    ctx.fillStyle = colors[getLoopingIndex(bars.length, colors.length)];
    ctx.fillRect(barPos - (barSize / 2), barHeight, barSize, 50);

    ctx.stroke();

    displayScore();
}

function displayScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 0, 20);
    ctx.stroke();
}

function getLoopingIndex(index, maxIndex) {
    return index - (Math.floor(index / maxIndex) * maxIndex);
}

function callGameOver() {
    gameLoopOn = false;
    clearTimeout(theGameLoop);
    setTimeout(gameOver, 100);
}

function gameOver() {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillRect(areaWidth / 2 - 100, areaHeight / 2 - 50,200,80);
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", areaWidth / 2, areaHeight / 2);
    ctx.stroke();
}

function Bar(pos, height, size) {
    this.pos = pos;
    this.height = height;
    this.size = size;
}