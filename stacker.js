var c = document.querySelector("#myCanvas");
var ctx = c.getContext("2d");

var spacePressed = false;
var spaceReleased = true;
var barSize = 200;
var barPos = 400;
var barHeight = 1100;
var barDir = 1;
var barSpeed = 10;

var bars = [new Bar(400, 1150,200)];

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
    barPos += barDir * barSpeed;

    if(spacePressed) {
        var posDiff = barPos - bars[bars.length - 1].pos

        if (Math.abs(posDiff) >= barSize / 2 + bars[bars.length - 1].size / 2) {
            callGameOver();
        }

        barSize = barSize - (Math.abs(posDiff));
        barPos -= posDiff / 2;
        bars.push(new Bar(barPos, barHeight, barSize));
        barHeight -= 50;
        spacePressed = false;
    }
    else if (barPos < 200 || barPos > 600) {
        barDir = -barDir;
    }

    render();

    clearTimeout(theGameLoop);
    if (gameLoopOn)
        theGameLoop = setTimeout(gameLoop, 50);
}

function render() {
    ctx.clearRect(0, 0, 800, 1200);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 1200);

    for (let i = 0; i < bars.length; i++) {
        const elem = bars[i];

        ctx.fillStyle = colors[getLoopingIndex(i, colors.length)];
        
        ctx.fillRect(elem.pos - (elem.size / 2), elem.height, elem.size, 50)
    }

    ctx.fillStyle = colors[getLoopingIndex(bars.length, colors.length)];
    ctx.fillRect(barPos - (barSize / 2), barHeight, barSize, 50);

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
    ctx.fillRect(300,350,200,80);
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", 400, 400);
    ctx.stroke();
}

function Bar(pos, height, size) {
    this.pos = pos;
    this.height = height;
    this.size = size;
}