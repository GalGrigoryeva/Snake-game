var columnCount = 16;
var rowCount = 16;

var cellsArr = [];
var snake = [ {x:5, y:3}, {x:4, y:3}, {x:3, y:3} ];

var snakeDirection = "right";
var newSnakeDirection;

var apple = {x:1, y:1};

var gameState = "running";
var updateIntervalId;

const createTable = () => {
  var body = document.getElementsByTagName("body")[0];

  var tbl = document.createElement("table");
  var tblBody = document.createElement("tBody");

  for (var y = 0; y < rowCount; y++) {
    var row = document.createElement("tr");

    for (var x = 0; x < columnCount; x++) {
      var cell = document.createElement("td");
      cellsArr.push(cell);

      row.appendChild(cell);
    }

    tblBody.appendChild(row);
  }

  tbl.appendChild(tblBody);
  body.appendChild(tbl);
}

const render = () => {
  for (var i = 0; i < cellsArr.length; i++) {
    var cell = cellsArr[i];
    cell.style.background = "#cccccc";
  }

  for (var j = 0; j < snake.length; j++) {
    var snakeCellPosition = snake[j];
    var snakeCellId = positionToIndex(snakeCellPosition);
    var snakeCell = cellsArr[snakeCellId];
    snakeCell.style.background = "#777777";
  }

  if (apple) {
    var appleCellId = positionToIndex(apple);
    var appleCell = cellsArr[appleCellId];
    appleCell.style.background = "#770000";
  }
}

const positionToIndex = (position) => {
  var cellX = position.x;
  var cellY = position.y;

  cellX = cellX % columnCount;
  if (cellX < 0) {
    cellX = columnCount + cellX;
  }

  cellY = cellY % rowCount;
  if (cellY < 0) {
    cellY = rowCount + cellY;
  }

  var index = columnCount * cellY + cellX;
  return index;
}

const updateSnake = () => {
  if (newSnakeDirection) {
    snakeDirection = newSnakeDirection;
  }

  var oldSnakeHeadPosition = snake[0];
  var newSnakeHeadPosition = {
    x: oldSnakeHeadPosition.x,
    y: oldSnakeHeadPosition.y
  };

  switch (snakeDirection) {
    case "left":
      newSnakeHeadPosition.x -= 1;
      break;
    case "right":
      newSnakeHeadPosition.x += 1;
      break;
    case "up":
      newSnakeHeadPosition.y -= 1;
      break;
    case "down":
      newSnakeHeadPosition.y += 1;
      break;
  }

  if (newSnakeHeadPosition.x < 0 || newSnakeHeadPosition.x >= columnCount || newSnakeHeadPosition.y < 0 || newSnakeHeadPosition.y >= rowCount) {
    gameState = "game_over";
    return;
  } else {
    snake.unshift(newSnakeHeadPosition);

    if (apple && positionsIsEqual(newSnakeHeadPosition, apple)) {
      dropApple();
    } else {
      snake.pop();
    }
  }

  for (i = 1; i < snake.length; i++) {
    if (positionsIsEqual(snake[0], snake[i])) {
      gameState = "game_over";
      return;
    }
  }
}

const update = () => {
  updateSnake();
  render();

  if (gameState == "game_over") {
    clearInterval(updateIntervalId);
    alert("GAME OVER!");
  }
}

window.addEventListener("keydown", function(event) {
  if (event.keyCode == 37 && snakeDirection != "right" && snakeDirection != "left") {
    newSnakeDirection = "left";
  }
  if (event.keyCode == 39 && snakeDirection != "left" && snakeDirection != "right") {
    newSnakeDirection = "right";
  }
  if (event.keyCode == 40 && snakeDirection != "up" && snakeDirection != "down") {
    newSnakeDirection = "down";
  }
  if (event.keyCode == 38 && snakeDirection != "down" && snakeDirection != "up") {
    newSnakeDirection = "up";
  }
});

const positionsIsEqual = (posA, posB) => {
  return posA.x == posB.x && posA.y == posB.y;
}

const dropApple = () => {
  var emptyCells = [];

  for (var x = 0; x < columnCount; x++) {
    for (var y = 0; y < rowCount; y++) {
      var position = {x:x, y:y};

      var isCellEmpty = true;
      for (var i = 0; i < snake.length; i++) {
        if (positionsIsEqual(position, snake[i])) {
          isCellEmpty = false;
        }
      }
      if (positionsIsEqual(position, apple)) {
        isCellEmpty = false;
      }

      if (isCellEmpty) {
        emptyCells.push(position);
      }
    }
  }
  if (emptyCells.length == 0){
    gameState = "game_over";
  } else {
    apple = emptyCells[getRandomInt(0, emptyCells.length - 1)];
    console.log(apple);
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


createTable();
render();
updateIntervalId = setInterval(update, 250);
