// import * as game from './game.js'

const body = document.querySelector('body')
const content = body.querySelector('.content')
const container = document.querySelector(".grid");
const gridNodes = document.querySelectorAll(".grid-item");
const gridArray = Array.from(gridNodes);
const gameInfo = document.querySelector('.game-info')
const startStopButton = document.querySelector('#start-stop')
const timerP = gameInfo.querySelector('.timer')
const scoreP = gameInfo.querySelector('.score')
const playerNameForm = document.querySelector('.name-form')
const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
}
let position, grid, startingGridItem, startingPosition, gameOver, timer, player
let time = 0.0, score = parseInt(scoreP.innerText)
// console.log('score: ', score);

function fetchAllPlayers() {
  return fetch('http://localhost:3000/players')
  .then(response => response.json())
}

function fetchPlayer(){
  return fetch('http://localhost:3000/players/2')
  .then(response => response.json())
}

function addPlayerToDatabase(username){
  fetch('http://localhost:3000/players', {
    method : "POST",
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({username})
  })
  .then(response => response.json())
  .then(data => player = data)
}

playerNameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let username = e.target.username.value.toLowerCase();
  fetchAllPlayers().then(data => findPlayer(data, username))
  playerNameForm.remove()
  renderStartMenu()
})

startStopButton.addEventListener('click',(e) => {
  if (e.target.className === "start-game") {
    e.target.innerText = "Stop Game"
    startGame()
  }
  if (e.target.className === "stop-game") {
    e.target.innerText = "Start Game"
    quitGame()
  }
  e.target.classList.toggle("stop-game")
  e.target.classList.toggle("start-game")
})

function findPlayer(playerArray, username) {
  player = playerArray.find(player => player.username === username)
  if (player == undefined) {
    addPlayerToDatabase(username)
  }
}

////////////////////

function renderStartMenu() {
  renderBoardSelections()
  const gameBoardsContainer = document.querySelector('.game-boards-container')
  gameBoardsContainer.addEventListener('click', () => {
    createNewGame()
    renderGameBoard()
    startGame()
  }) 

}

function renderBoardSelections() {
  const gameBoards = document.createElement("div")
  gameBoards.className = 'game-boards-container'
  const boardOneImage = document.createElement("img")
  boardOneImage.src = 'background.png'
  boardOneImage.alt = 'board one'
  boardOneImage.classList = 'board-image board-one'
  const boardTwoImage = document.createElement("img")
  boardTwoImage.src = 'test-2.png'
  boardTwoImage.alt = 'board two'
  boardTwoImage.classList = 'board-image board-two'

  gameBoards.append(boardOneImage, boardTwoImage)
  content.append(gameBoards)
}

function startGame(){
  startTimer()
  renderGameBoard()
  document.addEventListener("keydown", handleKey);
  document.addEventListener('keydown', changeCharacterDirection)
}

function renderGameBoard(){
  fetchPlayer().then(getGrid).then(makeGrid)
  fetchPlayer().then(createCharacter)
  fetchPlayer().then(createObstacle)
}

function createObstacle(playerData){
  let boardObstacleObj = playerData.games[0].board.board_obstacles[0]
  let obstacleObj = playerData.games[0].board.obstacles.find(obstacle => obstacle.id === boardObstacleObj.obstacle_id)
  let obstacleCoordinates = boardObstacleObj.coordinates
  obstacleCoordinates.forEach(coordinate => {
    let cell = document.querySelector(`#grid-item-${coordinate}`)
    let image = document.createElement('img')
    image.src = obstacleObj.pixel_art
    cell.append(image)
    // cell.style.backgroundImage = `url(${obstacleObj.pixel_art})`
    cell.classList = 'grid-item obstacle'
  })
}

function createCharacter(playerData){
  let characterObj = playerData.games[0].characters[0]
  startingPosition = playerData.games[0].board.start_coordinates
  position = {x: startingPosition[0], y: startingPosition[1]}
  
  let characterDiv = document.createElement('div')
  characterDiv.classList = "Character"
  
  let characterImg = document.createElement('img')
  characterImg.classList = "Character_spritesheet pixelart face-down"
  characterImg.src = characterObj.pixel_art
  
  startingGridItem = document.querySelector(`#grid-item-${startingPosition[0]}-${startingPosition[1]}`);
  characterDiv.append(characterImg)
  startingGridItem.append(characterDiv);
}

function getGrid(playerData){

  const board = playerData.games[0].board
  const notAllowed = board.not_allowed
  const trophies = board.trophies
  let x = board.grid_size[0]
  let y = board.grid_size[1]
  const goalCoord = board.goal_coordinates
  // mazeImage = document.createElement('img')
  // mazeImage.classList = "maze-image"
  // mazeImage.src = 'test-2.png'
  // mazeImage.src = 'new.png'
  // container.prepend(mazeImage)
  grid = {x, y, notAllowed, goalCoord, trophies}
  return grid
}

function makeGrid(grid) {
  // const container = document.createElement('div')
  container.style.backgroundImage = 'url("test-2.png")'
  container.style.setProperty("--grid-rows", grid.y);
  container.style.setProperty("--grid-cols", grid.x);

  let x = 0;
  let y = 0;
  for (let c = 0; c < grid.y * grid.x; c++) {
    let cell = document.createElement("div");
    
    y = c%grid.x + 1;
    
    if (c%grid.x == 0) {
      x++;
    }    

    cell.id = `grid-item-${x}-${y}`

    container.appendChild(cell).className = "grid-item"
    
    if (grid.goalCoord[0] == x && grid.goalCoord[1] == y){
      cell.classList = "grid-item goal"
    }
    if (grid.notAllowed.includes(`${x}-${y}`)){
      cell.classList = "grid-item not-allowed"
    }
    if (grid.trophies.includes(`${x}-${y}`)){
      cell.classList = "grid-item trophy"
      let trophyImage = document.createElement('img')
      trophyImage.className = 'trophy-image'
      trophyImage.src = 'coin.png'
      cell.append(trophyImage)
    }

  }

}

function handleKey(e) {

  switch (e.keyCode) {
    case keys.left:
      if (position.y > 1 && !document.querySelector(`#grid-item-${position.x}-${position.y -1}`).classList.contains("not-allowed")) 
      {position.y--} ;
      
      break;
    case keys.up:
      if (position.x > 1  && !document.querySelector(`#grid-item-${position.x-1}-${position.y}`).classList.contains("not-allowed")) 
      {position.x--};
      break;

    case keys.right:
      if (position.y < grid.y && !document.querySelector(`#grid-item-${position.x}-${position.y+1}`).classList.contains("not-allowed")) 
      {position.y++};
      break;

    case keys.down:
      if (position.x < grid.x && !document.querySelector(`#grid-item-${position.x+1}-${position.y}`).classList.contains("not-allowed")) 
      {position.x++};
      break;
  }
  const character = document.querySelector(".Character")
  let gridItem = document.querySelector("#grid-item-" + position.x + '-' + position.y);

  if (!gridItem.classList.contains('not-allowed'))
  {gridItem.appendChild(character)}

  if (gridItem.classList.contains('goal')){
    winGame()
  }
  if (gridItem.classList.contains('obstacle')){
    loseGame()
  }
  if (gridItem.classList.contains('trophy')){
    score += 100
    scoreP.innerText = score
    gridItem.classList = 'grid-item'
    gridItem.querySelector('.trophy-image').remove()

  }
}


function changeCharacterDirection(e){
  const characterSprite = document.querySelector('.Character_spritesheet')

  switch (e.keyCode) {
    case keys.up:
      characterSprite.classList = 'Character_spritesheet pixelart face-up'
      break
    case keys.down:
      characterSprite.classList = 'Character_spritesheet pixelart face-down'
      break
    case keys.left:
      characterSprite.classList = 'Character_spritesheet pixelart face-left'
      break
    case keys.right:
      characterSprite.classList = 'Character_spritesheet pixelart face-right'
  }
}

function startTimer(){
  timer = setInterval(incrementTimer, 100)
}

function incrementTimer(){
  time += 0.1
  timerP.innerText = time.toFixed(1)
}

function endTimer(){
  clearInterval(timer)
  time = 0.0
  timerP.innerText = time
}

function clearScore(){
  score = 0
  scoreP.innerText = score
}

function winGame(){
  time = time.toFixed(1)
  let results = {score, time}
  updateGame(results)
  resetBoard()
  resetButton()
  console.log("You win!")
}

function loseGame(){
  Array.from(container.children).forEach(child => child.remove())
  fetchPlayer().then(getGrid).then(makeGrid)
  fetchPlayer().then(createCharacter)
  fetchPlayer().then(createObstacle)
  clearScore()
  console.log("You Lose! Try again!")
}

function quitGame(){
  resetBoard()
}

function resetButton(){
  startStopButton.classList = "start-game"
  startStopButton.innerText = "Start Game"
}

function resetBoard(){
  Array.from(container.children).forEach(child => child.remove())
  endTimer()
  clearScore()
  container.style.setProperty("--grid-rows", 0);
  container.style.setProperty("--grid-cols", 0);
}

function updateGame(results){
  fetch('http://localhost:3000/games/2', {
    method: "PATCH",
    headers: {
      "Content-Type" : 'application/json'
    },
    body: JSON.stringify(results)
  })
}






// createWelcome()


// function createWelcome(){
//   const playerNameForm = document.createElement('form')
//   playerNameForm.classList = 'name-form'

//   

//   const username = document.createElement('input')
//   username.setAttribute('type', "text")
//   username.setAttribute('name', 'username')
//   username.setAttribute('placeholder', 'Username')

//   const submitBtn = document.createElement('input')
//   submitBtn.setAttribute('type', 'submit')
//   submitBtn.setAttribute('value', 'Go!')


//   playerNameForm.append(username, submitBtn)
//   body.append(playerNameForm)

// }

