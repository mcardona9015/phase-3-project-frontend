const map = document.querySelector(".map")
const container = document.querySelector(".grid");
const gridNodes = document.querySelectorAll(".grid-item");
const gridArray = Array.from(gridNodes);
const mazeImage = document.querySelector('.maze-image')
const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};
let position, grid, startingGridItem, startingPosition, score


window.addEventListener("keydown", handleKey);
document.addEventListener('keydown', changeCharacterDirection)


fetchPlayer().then(getGrid).then(makeGrid)
fetchPlayer().then(createCharacter)


function fetchPlayer(){
  return fetch('http://localhost:3000/players/1')
  .then(response => response.json())
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
  let x = board.grid_size[0]
  let y = board.grid_size[1]
  const goalCoord = board.goal_coordinates

  mazeImage.src = board.background
  grid = {x, y, notAllowed, goalCoord}
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
    cell.innerText = `${x}-${y}`
    cell.id = `grid-item-${x}-${y}`

    
    container.appendChild(cell).className = "grid-item"
    
    if (grid.goalCoord[0] == x && grid.goalCoord[1] == y){
      cell.classList = "goal grid-item"

    }
    if (grid.notAllowed.includes(`${x}-${y}`)){
      cell.classList = "grid-item not-allowed"
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
    winGame(character)
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


  function winGame(character){
    startingGridItem.append(character)
    position = {x: startingPosition[0], y: startingPosition[1]}
    console.log("You win!")
    let finalScore = 100
    updateGame(finalScore)
  }

  function updateGame(score){
    fetch('http://localhost:3000/games/1', {
      method: "PATCH",
      headers: {
        "Content-Type" : 'application/json'
      },
      body: JSON.stringify({score})
    })
    // .then(response => response.json())
    // .then(console.log)
  }