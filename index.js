// import * as game from './game.js'

const body = document.querySelector("body");
const content = body.querySelector(".content");
const gridNodes = document.querySelectorAll(".grid-item");
const gridArray = Array.from(gridNodes);
const gameInfo = document.querySelector(".game-info");
const playerNameForm = document.querySelector(".name-form");
const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};
let position,
  grid,
  startingGridItem,
  startingPosition,
  gameOver,
  timer,
  player,
  container,
  currentGame,
  character,
  boardId;
let time = 0.0,
  score = 0;

function fetchAllPlayers() {
  return fetch("https://maze-master.herokuapp.com/players").then((response) =>
    response.json()
  );
}

function fetchPlayer(id) {
  return fetch(
    `https://maze-master.herokuapp.com/players/${id}`
  ).then((response) => response.json());
}

function fetchBoard(id) {
  return fetch(
    `https://maze-master.herokuapp.com/boards/${id}`
  ).then((response) => response.json());
}

function fetchCharacter() {
  fetch("https://maze-master.herokuapp.com/characters/1")
    .then((response) => response.json())
    .then((data) => (character = data));
}

function addPlayerToDatabase(username) {
  fetch("https://maze-master.herokuapp.com/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((response) => response.json())
    .then((data) => (player = data));
}

function createNewGame(game) {
  fetch("https://maze-master.herokuapp.com/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  })
    .then((response) => response.json())
    .then((data) => (currentGame = data));
}

function deleteGame(e) {
  if (e.target.className === "delete-btn") {
    const id = e.target.dataset.id;
    e.target.previousElementSibling.remove();
    e.target.remove();
    fetch(`https://maze-master.herokuapp.com/games/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

playerNameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = e.target.username.value.toLowerCase();
  fetchAllPlayers().then((data) => findPlayer(data, username));
  renderStartMenu();
});

function findPlayer(playerArray, username) {
  player = playerArray.find((player) => player.username === username);
  if (player == undefined) {
    addPlayerToDatabase(username);
  }
}

////////////////////

function renderStartMenu() {
  clearContent();
  renderBoardSelections();
  const gameBoardsContainer = document.querySelector(".game-boards-container");
  gameBoardsContainer.addEventListener("click", createGameInstance);
  setTimeout(showPlayerStats, 100);
}

function showPlayerStats() {
  let gameScreen = document.querySelector(".game-selection");

  const playerStatsDiv = document.createElement("div");
  playerStatsDiv.className = "player-stats-container";

  const statsHeader = document.createElement("h3");
  statsHeader.className = "stats-header";
  statsHeader.textContent = "Your Recent Games!";

  const playerStatsList = document.createElement("ol");
  playerStatsList.className = "stats-list";

  let gamesArray = player.games.slice(Math.max(player.games.length - 5, 0));

  gamesArray.forEach((game) => {
    const statsLi = document.createElement("li");
    statsLi.className = "game-stats";
    statsLi.innerHTML = `Score: ${game.score} <br/>Time: ${game.time}`;

    const deleteStatBtn = document.createElement("button");
    deleteStatBtn.dataset.id = game.id;
    deleteStatBtn.className = "delete-btn";
    deleteStatBtn.textContent = "X";

    // statsLi.append(deleteStatBtn)
    playerStatsList.prepend(statsLi, deleteStatBtn);
  });

  playerStatsDiv.append(statsHeader, playerStatsList);
  gameScreen.append(playerStatsDiv);

  playerStatsDiv.addEventListener("click", deleteGame);
}

function createGameInstance(e) {
  if (e.target.classList.contains("board-image")) {
    boardId = e.target.dataset.id;
    clearContent();
    fetchCharacter();
    renderGameBoard(boardId);
    renderGameInfo();

    let startBtn = document.querySelector(".start-game");
    startBtn.addEventListener("click", (e) => {
      if (e.target.className === "start-game") {
        // e.target.innerText = "Quit Game"
        startGame();
      }
      if (e.target.className === "quit-game") {
        quitGame();
      }
      e.target.classList.toggle("start-game");
      e.target.classList.toggle("quit-game");
    });
    // startBtn.addEventListener('click', startGame)
  }
}

function renderBoardSelections() {
  const gameSelectionScreen = document.createElement("div");
  gameSelectionScreen.className = "game-selection";
  const header = document.createElement("h2");
  header.className = "board-selection-header";
  header.innerText = "SELECT A BOARD";
  const gameBoards = document.createElement("div");
  gameBoards.className = "game-boards-container";
  const boardOneImage = document.createElement("img");
  boardOneImage.dataset.id = 1;
  boardOneImage.src = "assets/images/board-1.png";
  boardOneImage.alt = "board one";
  boardOneImage.classList = "board-image board-one";
  const boardTwoImage = document.createElement("img");
  boardTwoImage.dataset.id = 2;
  boardTwoImage.src = "assets/images/board-2.png";
  boardTwoImage.alt = "board two";
  boardTwoImage.classList = "board-image board-two";

  gameBoards.append(boardOneImage, boardTwoImage);
  gameSelectionScreen.append(header, gameBoards);
  content.append(gameSelectionScreen);
}

function startGame() {
  startTimer();
  document.addEventListener("keydown", handleKey);
  document.addEventListener("keydown", changeCharacterDirection);
}

function renderGameBoard(id) {
  fetchBoard(id).then(getGrid).then(makeGrid);
  // fetchCharacter()
  fetchBoard(id).then(getStartingPosition).then(createCharacter);
  fetchBoard(id).then(createObstacle);
}

function renderGameInfo() {
  gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  container = document.createElement("div");
  container.classList = "container grid";

  startBtnDiv = document.createElement("div");
  startBtnDiv.className = "start-button-container";
  const startBtn = document.createElement("button");
  startBtn.classList = "start-game";
  // startBtn.innerText = 'Start Game'

  const timer = document.createElement("p");
  timer.className = "timer-container";
  timer.textContent = "Time: ";
  const timerSpan = document.createElement("span");
  timerSpan.className = "timer";
  timerSpan.textContent = "0";
  timer.append(timerSpan);

  const score = document.createElement("p");
  score.textContent = "Score: ";
  score.className = "score-container";
  const scoreSpan = document.createElement("span");
  scoreSpan.className = "score";
  scoreSpan.textContent = "0";
  score.append(scoreSpan);

  startBtnDiv.append(startBtn);
  gameScreen.append(timer, score, startBtnDiv, container);
  content.append(gameScreen);
}

function getStartingPosition(board) {
  return board.start_coordinates;
}

function createObstacle(board) {
  let boardObstacleObj = board.board_obstacles[0];
  let obstacleObj = board.obstacles.find(
    (obstacle) => obstacle.id === boardObstacleObj.obstacle_id
  );
  let obstacleCoordinates = boardObstacleObj.coordinates;
  obstacleCoordinates.forEach((coordinate) => {
    let cell = document.querySelector(`#grid-item-${coordinate}`);
    let image = document.createElement("img");
    // image.src = obstacleObj.pixel_art
    image.src = "assets/images/pixel-bomb.png";
    cell.append(image);
    cell.classList = "grid-item obstacle allowed";
  });
}

function createCharacter(startingPosition) {
  position = { x: startingPosition[0], y: startingPosition[1] };

  let characterDiv = document.createElement("div");
  characterDiv.classList = "Character";

  let characterImg = document.createElement("img");
  characterImg.classList = "Character_spritesheet pixelart face-down";
  characterImg.src = "assets/images/game-character.png";

  startingGridItem = document.querySelector(
    `#grid-item-${startingPosition[0]}-${startingPosition[1]}`
  );
  characterDiv.append(characterImg);
  startingGridItem.append(characterDiv);
}

function getGrid(board) {
  const notAllowed = board.not_allowed;
  const trophies = board.trophies;
  let x = board.grid_size[0];
  let y = board.grid_size[1];
  const goalCoord = board.goal_coordinates;
  if (board.id == 1) {
    container.style.backgroundImage = 'url("assets/images/board-1.png")';
  }
  if (board.id == 2) {
    container.style.backgroundImage = 'url("assets/images/board-2.png")';
  }
  grid = { x, y, notAllowed, goalCoord, trophies };
  return grid;
}

function makeGrid(grid) {
  container.style.setProperty("--grid-rows", grid.y);
  container.style.setProperty("--grid-cols", grid.x);

  let x = 0;
  let y = 0;
  for (let c = 0; c < grid.y * grid.x; c++) {
    let cell = document.createElement("div");

    y = (c % grid.x) + 1;

    if (c % grid.x == 0) {
      x++;
    }

    cell.id = `grid-item-${x}-${y}`;
    // cell.textContent = `${x}-${y}`

    container.appendChild(cell).className = "grid-item allowed";

    if (boardId == 1) {
      cell.style.backgroundImage = 'url("assets/images/grass-floor-tile.png")';
    }
    if (boardId == 2) {
      cell.style.backgroundImage =
        'url("assets/images/grey-brick-floor-tile.png")';
    }

    if (grid.goalCoord[0] == x && grid.goalCoord[1] == y) {
      cell.classList = "grid-item goal allowed";
      // if (boardId == 1){
      //   const flagImage = document.createElement('img')
      //   flagImage.className = 'flag-image'
      //   flagImage.src = "assets/images/MazeMaster_Flag.png"
      //   cell.append(flagImage)
      // }
      // if (boardId == 2){
      //   cell.style.backgroundImage = 'url("assets/images/door.png")'
      // }
    }
    if (grid.notAllowed.includes(`${x}-${y}`)) {
      cell.classList = "grid-item not-allowed";
      if (boardId == 1) {
        cell.style.backgroundImage = 'url("assets/images/blue-wall-tile.png")';
      }
      if (boardId == 2) {
        cell.style.backgroundImage = 'url("assets/images/red-wall-tile.png")';
      }
    }
    if (grid.trophies.includes(`${x}-${y}`)) {
      cell.classList = "grid-item trophy allowed";
      // let trophyContainer = document.createElement("div")
      // trophyContainer.className = "trophy-container"
      let trophyImage = document.createElement("img");
      trophyImage.className = "trophy-image";
      trophyImage.src = "assets/images/test-coin-gif.gif";
      // trophyContainer.append(trophyImage)
      // cell.append(trophyContainer)
      // trophyImage.src = 'MazeMaster_Coin.png'
      cell.append(trophyImage);
    }
  }
}

function handleKey(e) {
  switch (e.keyCode) {
    case keys.left:
      if (
        position.y > 1 &&
        !document
          .querySelector(`#grid-item-${position.x}-${position.y - 1}`)
          .classList.contains("not-allowed")
      ) {
        position.y--;
      }

      break;
    case keys.up:
      if (
        position.x > 1 &&
        !document
          .querySelector(`#grid-item-${position.x - 1}-${position.y}`)
          .classList.contains("not-allowed")
      ) {
        position.x--;
      }
      break;

    case keys.right:
      if (
        position.y < grid.y &&
        !document
          .querySelector(`#grid-item-${position.x}-${position.y + 1}`)
          .classList.contains("not-allowed")
      ) {
        position.y++;
      }
      break;

    case keys.down:
      if (
        position.x < grid.x &&
        !document
          .querySelector(`#grid-item-${position.x + 1}-${position.y}`)
          .classList.contains("not-allowed")
      ) {
        position.x++;
      }
      break;
  }
  const character = document.querySelector(".Character");
  let gridItem = document.querySelector(
    "#grid-item-" + position.x + "-" + position.y
  );
  let scoreSpan = document.querySelector(".score");

  if (!gridItem.classList.contains("not-allowed")) {
    gridItem.appendChild(character);
  }

  if (gridItem.classList.contains("goal")) {
    let winSound = new Audio("assets/sounds/SFX_-_positive_02.m4a");
    winSound.play();
    winGame();
  }
  if (gridItem.classList.contains("obstacle")) {
    let bombSound = new Audio("assets/sounds/SFX_-_explosion_03.m4a");
    bombSound.play();
    loseGame();
  }
  if (gridItem.classList.contains("trophy")) {
    score += 100;
    scoreSpan.innerText = score;
    gridItem.classList = "grid-item allowed";
    let coinSound = new Audio("assets/sounds/SFX_-_coin_02.m4a");
    coinSound.play();
    gridItem.querySelector(".trophy-image").remove();
  }
}

function changeCharacterDirection(e) {
  const characterSprite = document.querySelector(".Character_spritesheet");

  switch (e.keyCode) {
    case keys.up:
      characterSprite.classList = "Character_spritesheet pixelart face-up";
      break;
    case keys.down:
      characterSprite.classList = "Character_spritesheet pixelart face-down";
      break;
    case keys.left:
      characterSprite.classList = "Character_spritesheet pixelart face-left";
      break;
    case keys.right:
      characterSprite.classList = "Character_spritesheet pixelart face-right";
  }
}

function startTimer() {
  timer = setInterval(incrementTimer, 100);
}

function incrementTimer() {
  let timerSpan = document.querySelector(".timer");
  time += 0.1;
  timerSpan.innerText = time.toFixed(1);
}

function endTimer() {
  clearInterval(timer);
  // let timerSpan = document.querySelector('.timer')
  time = 0.0;
  // timerSpan.innerText = time
}

function clearScore() {
  let scoreSpan = document.querySelector(".score");
  score = 0;
  scoreSpan.innerText = score;
}

function winGame() {
  time = time.toFixed(1);
  let results = { player_id: player.id, board_id: boardId, score, time };
  let scoreContainer = document.querySelector(".score-container");
  let timerContainer = document.querySelector(".timer-container");
  scoreContainer.textContent = `Final Score: ${score}`;
  scoreContainer.style.fontSize = "xx-large";
  timerContainer.textContent = `Final Time: ${time}`;
  timerContainer.style.fontSize = "xx-large";

  resetCharacterEventListeners();
  clearInterval(timer);
  createNewGame(results);
  console.log("You win!");
}

function loseGame() {
  renderGameBoard(boardId);
  Array.from(container.children).forEach((child) => child.remove());
  clearScore();
  console.log("You Lose! Try again!");
}

function quitGame() {
  score = 0;
  endTimer();
  fetchPlayer(player.id).then((data) => (player = data));
  setTimeout(renderStartMenu, 100);
  // renderStartMenu()
  resetCharacterEventListeners();
}

function resetCharacterEventListeners() {
  document.removeEventListener("keydown", handleKey);
  document.removeEventListener("keydown", changeCharacterDirection);
}

function resetBoard() {
  Array.from(container.children).forEach((child) => child.remove());
  endTimer();
  clearScore();
  container.style.setProperty("--grid-rows", 0);
  container.style.setProperty("--grid-cols", 0);
}

function updateGame(results) {
  fetch(`https://maze-master.herokuapp.com/games/${currentGame.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(results),
  });
}

function clearContent() {
  Array.from(content.children).forEach((child) => child.remove());
}
