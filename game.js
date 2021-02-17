// export const container = document.querySelector(".grid");
// let grid

// export function getGrid(playerData){
//     let grid
//     const board = playerData.games[0].board
//     const notAllowed = board.not_allowed
//     const trophies = board.trophies
//     let x = board.grid_size[0]
//     let y = board.grid_size[1]
//     const goalCoord = board.goal_coordinates
//     // mazeImage = document.createElement('img')
//     // mazeImage.classList = "maze-image"
//     // mazeImage.src = 'test-2.png'
//     // mazeImage.src = 'new.png'
//     // container.prepend(mazeImage)
//     grid = {x, y, notAllowed, goalCoord, trophies}
//     return grid
// }
    
// export function makeGrid(grid) {
//     // const container = document.createElement('div')
//     container.style.backgroundImage = 'url("test-2.png")'
//     container.style.setProperty("--grid-rows", grid.y);
//     container.style.setProperty("--grid-cols", grid.x);

//     let x = 0;
//     let y = 0;
//     for (let c = 0; c < grid.y * grid.x; c++) {
//     let cell = document.createElement("div");
    
//     y = c%grid.x + 1;
    
//     if (c%grid.x == 0) {
//         x++;
//     }    

//     cell.id = `grid-item-${x}-${y}`

//     container.appendChild(cell).className = "grid-item"
    
//     if (grid.goalCoord[0] == x && grid.goalCoord[1] == y){
//         cell.classList = "grid-item goal"
//     }
//     if (grid.notAllowed.includes(`${x}-${y}`)){
//         cell.classList = "grid-item not-allowed"
//     }
//     if (grid.trophies.includes(`${x}-${y}`)){
//         cell.classList = "grid-item trophy"
//         let trophyImage = document.createElement('img')
//         trophyImage.className = 'trophy-image'
//         trophyImage.src = 'coin.png'
//         cell.append(trophyImage)
//     }

//     }

// }