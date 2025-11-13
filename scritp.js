const table = document.querySelector(".table");
const pointsPlacar = document.querySelector("#points");
const intervalRow = 15;
const tableSize = intervalRow * intervalRow;
const center = Math.floor(tableSize / 2);

const initialSnakePosition = center - 3;
const initialFoodPosition = center + 3;

let points = 0;
let snakePosition = [initialSnakePosition];
let foodPosition = initialFoodPosition;
let lastKeyDown = "downArrow";

let walkTimeOut;

const keyAction = {
  upArrow: -15,
  downArrow: +15,
  leftArrow: -1,
  rightArrow: +1,
};

const preventKey = {
  upArrow: "downArrow",
  downArrow: "upArrow",
  leftArrow: "rightArrow",
  rightArrow: "leftArrow",
};

const maxTableSize = tableSize - 1;
const rightWall = [];
const leftWall = [];

for (i = intervalRow - 1; i <= maxTableSize; i = i + intervalRow) {
  rightWall.push(i);
}
for (i = 0; i <= tableSize - intervalRow; i = i + intervalRow) {
  leftWall.push(i);
}

function firstPositionSnake() {
  return snakePosition[0];
}
function lastPositionSnake() {
  return snakePosition[snakePosition.length - 1];
}
function beforeLastPositionSnake() {
  return snakePosition[snakePosition.length - 2];
}

function verifyLimit(value) {
  if (lastPositionSnake() + value < 0) return true;
  if (lastPositionSnake() + value > maxTableSize) return true;
  if (
    leftWall.includes(lastPositionSnake()) &&
    rightWall.includes(lastPositionSnake() + value)
  )
    return true;
  if (
    rightWall.includes(lastPositionSnake()) &&
    leftWall.includes(lastPositionSnake() + value)
  )
    return true;
  return false;
}

function randomPosition() {
  const selectPosition = Math.floor(Math.random() * tableSize);

  if (snakePosition.length === tableSize) {
    alert(`Você venceu! pontuação maxima alcançada de: ${points}`);
    return restartGame();
  }

  if (snakePosition.includes(selectPosition) || selectPosition === foodPosition)
    return randomPosition();
  return selectPosition;
}

function createTable() {
  for (let i = 0; i <= maxTableSize; i++) {
    const div = document.createElement("div");

    // div.textContent = i;
    if (i % 2 === 0) div.classList.add("tapete");

    if (i === firstPositionSnake()) div.classList.add("snake");
    if (i === foodPosition) div.classList.add("food");

    table.appendChild(div);
  }
}

function repositionFood() {
  const grids = document.querySelectorAll(".table > div");

  if (grids.length === 0) return;
  const newFoodPosition = randomPosition();

  grids.forEach((item, i) => {
    item.classList.remove("food");
    if (i === newFoodPosition) {
      item.classList.add("food");
      foodPosition = i;
    }
  });

  pointsPlacar.textContent = "0";
  points++;
  pointsPlacar.textContent = points;
}

function verifyDeath(direction) {
  if (verifyLimit(keyAction[direction])) {
    alert(`Parece que você bateu em uma parede! você fez: ${points} pontos!`);
    restartGame();
    return true;
  }

  const snakeBody = [...snakePosition];
  if (snakePosition.length > 1) snakeBody.pop();

  if (
    snakeBody.includes(lastPositionSnake() + keyAction[direction]) &&
    snakePosition.length > 4
  ) {
    alert(`Parece que você bateu em si mesmo! você fez: ${points} pontos!`);
    restartGame();
    return true;
  }

  return false;
}

function notForBack(direction) {
  if (preventKey[direction] === lastKeyDown) return true;
  return false;
}

function snakeWalk(direction) {
  stopWalk();

  if (snakePosition.length !== 1) {
    if (notForBack(direction)) return;
  }
  if (verifyDeath(direction)) return;

  lastKeyDown = direction;

  snakePosition.push(lastPositionSnake() + keyAction[direction]);
  snakePosition.shift();

  const grids = document.querySelectorAll(".table > div");

  if (grids.length === 0) return;

  grids.forEach((item, i) => {
    item.classList.remove("snake");

    if (snakePosition.includes(i)) {
      item.classList.add("snake");
    }
  });

  if (lastPositionSnake() === foodPosition) {
    snakePosition.unshift(foodPosition);
    repositionFood();
  }

  walkTimeOut = setTimeout(() => {
    console.log(200 - points * 5);
    return snakeWalk(lastKeyDown);
  }, 200 - points * 0.5);
}

function handleKey(event) {
  switch (event.key) {
    case "ArrowUp":
      snakeWalk("upArrow");
      break;
    case "ArrowDown":
      snakeWalk("downArrow");
      break;
    case "ArrowLeft":
      snakeWalk("leftArrow");
      break;
    case "ArrowRight":
      snakeWalk("rightArrow");
      break;
  }
}

function readKey() {
  document.addEventListener("keydown", handleKey);
}

function stopReadKey() {
  document.removeEventListener("keydown", handleKey);
}

function stopWalk() {
  clearTimeout(walkTimeOut);
}

function restartGame() {
  table.innerHTML = "";
  pointsPlacar.textContent = "0";
  stopReadKey();

  stopWalk();

  points = 0;
  snakePosition = [initialSnakePosition];
  foodPosition = initialFoodPosition;

  startGame();
}

async function startGame() {
  createTable();
  readKey();
}

startGame();
