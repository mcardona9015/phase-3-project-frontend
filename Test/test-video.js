const character = document.querySelector('.Character_spritesheet')
const characterDiv = document.querySelector('.Character')

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        character.classList = 'Character_spritesheet pixelart face-up'
    }
    if (e.key === 'ArrowDown') {
        character.classList = 'Character_spritesheet pixelart face-down'
    }
    if (e.key === 'ArrowLeft') {
        character.classList = 'Character_spritesheet pixelart face-left'
    }
    if (e.key === 'ArrowRight') {
        character.classList = 'Character_spritesheet pixelart face-right '
        characterDiv.classList = 'Character move-character'
    }
})