const table = document.querySelector(".table");
const intervalRow = 15;
const tableSize = intervalRow * intervalRow;
const center = Math.floor(tableSize / 2);

const initialSnakePosition = center - 3;
const initialFoodPosition = center + 3;

let points = 0;
let snakePosition = [initialSnakePosition];
let foodPosition = initialFoodPosition;
let lastKeyDown = "downArrow";

const keyAction = {
  upArrow: -15,
  downArrow: +15,
  leftArrow: -1,
  rightArrow: +1,
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

function verifyLimit(value) {
  if (firstPositionSnake() + value < 0) return true;
  if (firstPositionSnake() + value > maxTableSize) return true;
  if (
    leftWall.includes(firstPositionSnake()) &&
    rightWall.includes(firstPositionSnake() + value)
  )
    return true;
  if (
    rightWall.includes(firstPositionSnake()) &&
    leftWall.includes(firstPositionSnake() + value)
  )
    return true;
  return false;
}

function randomPosition() {
  // vai quebrar quando o cara ganhar
  const selectPosition = Math.floor(Math.random() * tableSize);

  if (
    firstPositionSnake() === selectPosition ||
    selectPosition === foodPosition
  )
    return randomPosition();
  return selectPosition;
}

function createTable() {
  for (let i = 0; i <= maxTableSize; i++) {
    const div = document.createElement("div");

    div.textContent = i;
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

  points++;
}

function snakeWalk(direction) {
  lastKeyDown = direction;

  console.log("posição inicial:", snakePosition);

  if (verifyLimit(keyAction[direction])) {
    alert(`Parece que você bateu em uma parede! você fez: ${points} pontos!`);
    return restartGame();
  }

  if (snakePosition.length === 1) {
    snakePosition = [firstPositionSnake() + keyAction[direction]];
  } else {
    snakePosition.push(lastPositionSnake() + keyAction[direction]);
    snakePosition.shift();
  }

  const grids = document.querySelectorAll(".table > div");

  if (grids.length === 0) return;

  console.log("posição da cobra depois de andar:", snakePosition);

  grids.forEach((item, i) => {
    item.classList.remove("snake");

    if (snakePosition.includes(i)) {
      item.classList.add("snake");
    }
  });

  console.log("ultima posição da cobra:", lastPositionSnake());
  console.log("posição da comida atual:", foodPosition);

  if (lastPositionSnake() === foodPosition) {
    snakePosition.unshift(foodPosition);
    repositionFood();
  }
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

function restartGame() {
  table.innerHTML = "";
  stopReadKey();

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
