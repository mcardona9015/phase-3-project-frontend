function preload() {
    // Load in the sprite here!
    this.load.image('charmander', 'charmander.png')
    this.load.image('battle', 'pokemon-battle-background.png')
  
  }

  function create() {
    // Create a sprite game object here!
    let sprite = this.add.sprite(310, 180, 'charmander')
    sprite.displayWidth=game.config.width*.4; sprite.scaleY=sprite.scaleX
    sprite.setDepth(2)
    let battleBg = this.add.image(200, 200, 'battle')
    battleBg.setDepth(1)
  
  }
  
  const config = {
      type: Phaser.AUTO,
      width: 500,
      height: 1000,
      backgroundColor: "#5f2a55",
      scene: {
      create,
      preload
      }
  }
  
  const game = new Phaser.Game(config)

  console.log('game: ', game);
  