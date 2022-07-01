var c = document.querySelector("#myCanvas");
var ctx = c.getContext("2d");

var areaWidth = window.innerWidth;
var areaHeight = window.innerHeight;

var spacePressed = false;
var spaceReleased = true;
var barWidth = 400;
var barSizeX = barWidth;
var barSizeY = 50;
var barPos = areaWidth / 2;
var barHeight = areaHeight - barSizeY * 2;

var barDir = 1;
var barSpeed = 10;
var speedIncreaseIncrement = 2;
var stepsBeforeSpeedIncrease = 5;

var previousHeightOffset = 0;
var currentHeightOffset = 0;
var targetHeightOffset = 0;
var heightChangeSpeed = 10;

var score = 0;

var bars = [new Bar(areaWidth / 2, areaHeight - barSizeY, barSizeX)];

var colors = [
  '#09522f',
  '#175c39',
  '#236643',
  '#2d714d',
  '#387b57',
  '#428662',
  '#4d906c',
  '#579b77',
  '#61a682',
  '#6cb18e',
  '#76bd99',
  '#81c8a5',
  '#8cd4b0',
  '#97dfbc',
  '#a2ebc8',
  '#8ee7cb',
  '#79e2ce',
  '#61ded3',
  '#45d8d9',
  '#18d3df',
  '#00cde6',
  '#00c7ec',
  '#00c0f2',
  '#00b8f6',
  '#00b1fa',
  '#00a8fb',
  '#009ffa',
  '#3c95f7',
  '#5c8af2',
  '#6084ef',
  '#657eeb',
  '#6a77e7',
  '#6f71e3',
  '#746ade',
  '#7963d9',
  '#7e5cd3',
  '#8354cd',
  '#874cc7',
  '#8b43c0',
  '#8f39b9',
  '#932db2',
  '#961faa',
  '#9906a2',
  '#7730b2',
  '#4842bd',
  '#004ec2',
  '#0056c0',
  '#005bb9',
  '#005eae',
  '#005f9f',
  '#005f8d',
  '#005e7b',
  '#005c68',
  '#005a57',
  '#005847',
  '#00553a'
];

var theGameLoop;
var gameLoopOn = true;

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

showIntroduction();

function showIntroduction() {
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillRect(areaWidth / 2 - 200, areaHeight / 2 - 50, 400, 80);
  ctx.fillStyle = "black";
  ctx.fillText("Press space to start", areaWidth / 2, areaHeight / 2);
  ctx.stroke();
}

document.addEventListener('keydown', function (event) {
  if (event.keyCode == 32) {
    event.preventDefault();

    runGame();
  }
}, { once: true });

function runGame() {
  initializeGame();
  gameLoop();
}

function initializeGame() {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == 32 && spaceReleased) {
      event.preventDefault();

      spacePressed = true;
      spaceReleased = false;
    }
  });

  document.addEventListener('keyup', function (event) {
    if (event.keyCode == 32) {
      event.preventDefault();

      spaceReleased = true;
    }
  });
}

function gameLoop() {
  if (spacePressed) {
    var posDiff = barPos - bars[bars.length - 1].pos

    if (Math.abs(posDiff) >= barSizeX / 2 + bars[bars.length - 1].size / 2) {
      callGameOver();
    } else {
      score++;
    }

    barSizeX = barSizeX - (Math.abs(posDiff));
    barPos -= posDiff / 2;
    bars.push(new Bar(barPos, barHeight, barSizeX));
    barHeight -= barSizeY;
    spacePressed = false;

    if (bars.length % stepsBeforeSpeedIncrease == 0) {
      barSpeed += speedIncreaseIncrement;
    }
  } else if (barPos < (areaWidth / 2 - barWidth / 2) || barPos > (areaWidth / 2 + barWidth / 2)) {
    barDir = -barDir;
  }

  if (barHeight < areaHeight / 4 - targetHeightOffset) {
    targetHeightOffset += areaHeight / 2;
  }

  barPos += barDir * barSpeed;

  render();

  clearTimeout(theGameLoop);
  if (gameLoopOn)
    theGameLoop = setTimeout(gameLoop, 50);
}

function render() {
  ctx.clearRect(0, 0, areaWidth, areaHeight);

  var offset = 0;

  if (currentHeightOffset < targetHeightOffset) {
    offset = easeHeightTransition(currentHeightOffset - previousHeightOffset, previousHeightOffset, targetHeightOffset - previousHeightOffset, targetHeightOffset - previousHeightOffset);
    currentHeightOffset += heightChangeSpeed;
  } else {
    currentHeightOffset = targetHeightOffset;
    previousHeightOffset = currentHeightOffset;
    offset = targetHeightOffset;
  }

  offset = Math.floor(offset);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, areaWidth, areaHeight);

  for (let i = 0; i < bars.length; i++) {
    const elem = bars[i];

    if (elem.height > areaHeight + barSizeY)
      continue;

    ctx.fillStyle = colors[getLoopingIndex(i, colors.length)];

    ctx.fillRect(elem.pos - (elem.size / 2), elem.height + offset, elem.size, barSizeY)
  }

  ctx.fillStyle = colors[getLoopingIndex(bars.length, colors.length)];
  ctx.fillRect(barPos - (barSizeX / 2), barHeight + offset, barSizeX, barSizeY);

  ctx.stroke();

  displayScore();
}

// Quadratic easing in and out (https://spicyyoghurt.com/tools/easing-functions)
function easeHeightTransition(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
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
  ctx.fillRect(areaWidth / 2 - 100, areaHeight / 2 - 50, 200, 80);
  ctx.fillStyle = "black";
  ctx.fillText("Game Over", areaWidth / 2, areaHeight / 2);
  ctx.stroke();
}

function Bar(pos, height, size) {
  this.pos = pos;
  this.height = height;
  this.size = size;
}