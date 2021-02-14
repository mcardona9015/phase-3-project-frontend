const container = document.querySelector(".grid");
const gridNodes = document.querySelectorAll(".grid-item");
const gridArray = Array.from(gridNodes);

let character = document.querySelector(".Character");
let position = {x: 1, y: 2};
let gridSize = {x: 32, y: 32}


function makeGrid(cols, rows) {
  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);
  
  let x = 0;
  let y = 0;
  for (let c = 0; c < rows * cols; c++) {
    let cell = document.createElement("div");
    
    y = c%cols + 1;
    
    if (c%cols == 0) {
    	x++;
    }    
        
    container.appendChild(cell).className = "grid-item grid-item-" + x + '-' + y;
  }
}
const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

makeGrid(gridSize.x, gridSize.y);
// character.style.width = "20px";
// character.style.height = "20px";
// character.style.backgroundColor = "#000";
let startingGridItem = document.querySelector(".grid-item-1-2");
startingGridItem.appendChild(character);

function handleKey(e) {
  switch (e.keyCode) {
    case keys.left:
      if (position.y > 2) {position.y--} ;
      break;
    case keys.up:
      if (position.x > 1) {position.x--};
      break;

    case keys.right:
      if (position.y < gridSize.y - 1) {position.y++};
      // console.log('gridSize.y: ', gridSize.y);
      console.log('position.y: ', position.y);
      console.log('position.x: ', position.x);
      break;

    case keys.down:
      if (position.x < gridSize.x) {position.x++};
      break;
  }
  
  let gridItem = document.querySelector(".grid-item-" + position.x + '-' + position.y);
  gridItem.appendChild(character);
}
window.addEventListener("keydown", handleKey);

const characterSprite = document.querySelector('.Character_spritesheet')
const characterDiv = document.querySelector('.Character')

document.addEventListener('keydown', (e) => {
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
    }
})