const map = document.querySelector(".map")
const container = document.querySelector(".grid");
const gridNodes = document.querySelectorAll(".grid-item");
const gridArray = Array.from(gridNodes);
// const mazeImage = document.querySelector('.maze-image')
const gameInfo = document.querySelector('.game-info')
const startStopButton = document.querySelector('#start-stop')

const timerP = gameInfo.querySelector('.timer')
const scoreP = gameInfo.querySelector('.score')

const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};
let position, grid, startingGridItem, startingPosition, gameOver, timer
let time = 0.0, score = parseInt(scoreP.innerText)
console.log('score: ', score);


window.addEventListener("keydown", handleKey);
document.addEventListener('keydown', changeCharacterDirection)
startStopButton.addEventListener('click',(e) => {
  if (e.target.className === "start-game") {
    e.target.innerText = 'Stop Game'
    timer = setInterval(startTimer, 100)
    fetchPlayer().then(getGrid).then(makeGrid)
    fetchPlayer().then(createCharacter)
    fetchPlayer().then(createObstacle)
    console.log(e.target)
  }
  if (e.target.className === "stop-game") {
    e.target.innerText = 'Start Game'
    quitGame()
  }
  e.target.classList.toggle("stop-game")
  e.target.classList.toggle("start-game")
})




function fetchPlayer(){
  return fetch('http://localhost:3000/players/1')
  .then(response => response.json())
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

  mazeImage = document.createElement('img')
  mazeImage.classList = "maze-image"
  mazeImage.src = 'new.png'
  container.prepend(mazeImage)
  grid = {x, y, notAllowed, goalCoord, trophies}
  return grid
}


function makeGrid(grid) {
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
    // cell.innerText = `${x}-${y}`
    cell.id = `grid-item-${x}-${y}`

    
    container.appendChild(cell).className = "grid-item"
    
    if (grid.goalCoord[0] == x && grid.goalCoord[1] == y){
      cell.classList = "goal grid-item"

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
      if (position.y > 2 && !document.querySelector(`#grid-item-${position.x}-${position.y -1}`).classList.contains("not-allowed")) 
      {position.y--} ;
      
      break;
    case keys.up:
      if (position.x > 1  && !document.querySelector(`#grid-item-${position.x-1}-${position.y}`).classList.contains("not-allowed")) 
      {position.x--};
      break;

    case keys.right:
      if (position.y < grid.y - 1 && !document.querySelector(`#grid-item-${position.x}-${position.y+1}`).classList.contains("not-allowed")) 
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
    scoreP.innerText = `Score: ${score}`
    gridItem.classList = 'grid-item'
    gridItem.querySelector('.trophy-image').remove()

  }
}


function changeCharacterDirection(e){
const characterSprite = document.querySelector('.Character_spritesheet')
const characterDiv = document.querySelector('.Character')

  if (e.key === 'ArrowUp') {
      characterSprite.classList = 'Character_spritesheet pixelart face-up'
  }
  if (e.key === 'ArrowDown') {
      characterSprite.classList = 'Character_spritesheet pixelart face-down'
  }
  if (e.key === 'ArrowLeft') {
      characterSprite.classList = 'Character_spritesheet pixelart face-left'
  }
  if (e.key === 'ArrowRight') {
      characterSprite.classList = 'Character_spritesheet pixelart face-right '
  }}

  function startTimer(){
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
    scoreP.innerText = `Score: ${score}`
  }


  function winGame(){
    // startingGridItem.append(character)
    // position = {x: startingPosition[0], y: startingPosition[1]}
    resetBoard()
    // fetchPlayer().then(getGrid).then(makeGrid)
    // fetchPlayer().then(createCharacter)
    // fetchPlayer().then(createObstacle)
    console.log("You win!")
    results = {score, time}
    updateGame(results)
    resetButton()
   
    
  }
  function loseGame(){
    // startingGridItem.append(character)
    // position = {x: startingPosition[0], y: startingPosition[1]}
    Array.from(container.children).forEach(child => child.remove())
    fetchPlayer().then(getGrid).then(makeGrid)
    fetchPlayer().then(createCharacter)
    fetchPlayer().then(createObstacle)
    console.log("You Lose! Try again!")
    // results = {score, time}
    // updateGame(results)
    // endTimer()
    clearScore()
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
    // debugger
    // startStopButton.classList = "start-game"
    // startStopButton.innerText = "Start Game"
  }

  function updateGame(results){
    fetch('http://localhost:3000/games/1', {
      method: "PATCH",
      headers: {
        "Content-Type" : 'application/json'
      },
      body: JSON.stringify(results)
    })
    // .then(response => response.json())
    // .then(console.log)
  }