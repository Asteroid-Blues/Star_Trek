let game;

let gameOptions = {
  gravity: 1,
  maxItemsPerLevel: 10,
  maxIterations: 10,
  minItemsDistance: 160
}
var music;
const HERO = 0;
const COIN = 1;
const SKULL = 2;

window.onload = function() {
  let gameConfig = {
    
    type: Phaser.AUTO,
    
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 1750,
      height: 3334
    },
    
    
    scene: playGame,
    
    physics: {
      default: "matter",
      matter: {
        gravity: {
          y: gameOptions.gravity
        }
      }
    }
  }
  
  game = new Phaser.Game(gameConfig);
  window.focus();
  
}

class playGame extends Phaser.Scene{

  constructor() {
    super("PlayGame");
  }
  
  preload() {
    
    this.load.image("background", "Art/Background.png",
    );
    this.load.spritesheet("enterprise", "Art/Enterprise.png", {
      frameWidth: 1750,
      frameHeight: 3334
    });
    this.load.spritesheet("voyager", "Art/Voyager.png", {
      frameWidth: 203,
      frameHeight: 466
    });
  }

  create() {
    
    this.add.image(833.5,1750,'background')
    this.canSummonHero = true;
    this.matter.world.update30Hz();
    this.matter.world.setBounds(0, -400, game.config.width, game.config.height + 800);
    this.createLevel();
    var score = 0;
    var scoreText;
    
    scoreText = this.add.text(650, 3000, 'WARP SPEED: 9.8!!!', { fontSize: '100px', fill: '#FFF555' });
    this.input.on("pointerdown", this.releaseHero, this);
    
    this.matter.world.on("collisionstart", function(e, b1, b2) {
      
      switch (b1.label) {
          
        case COIN:
          b1.gameObject.visible = false;
          this.matter.world.remove(b1);
          break;
          
        case SKULL:
          if (b1.gameObject.y > b2.gameObject.y) {
            b1.gameObject.visible = false;
            this.matter.world.remove(b1);
          } else {
            this.cameras.main.flash(50, 255, 0, 0);
          }
          break;
          
        default:
          if (b2.gameObject.y > game.config.height) {
            this.scene.start("PlayGame");
          } else {
            if (b2.gameObject.y > 0) {
              this.cameras.main.flash(50, 255, 0, 0);
            }
          }
          
      }
    }, this);
    

  }

  
  createLevel() {
    this.gameItems = this.add.group();
    let spawnRectangle = new Phaser.Geom.Rectangle(80, 250, game.config.width - 160, game.config.height - 350);
    
    for (let i = 0; i < gameOptions.maxItemsPerLevel; i++) {
      let iterations = 0;
      let point;
      do {
        point = Phaser.Geom.Rectangle.Random(spawnRectangle);
        iterations ++;
      } while (iterations < gameOptions.maxIterations && this.itemsOverlap(point));
      
      if (iterations == gameOptions.maxIterations) {
        break;
      } else {
        let item = this.matter.add.image(point.x, point.y, "voyager");
        item.setCircle();
        item.setStatic(true);
        this.gameItems.add(item);
        
        if (Phaser.Math.Between(0, 99) > 50) {
          item.setFrame(1);
          item.body.label = COIN;
        } else {
          item.setFrame(2);
          item.body.label = COIN;
        }
        
      }
    }
  }
  
  itemsOverlap(p) {
    let overlap = false;
    this.gameItems.getChildren().forEach(function(item) {
      if (item.getCenter().distance(p) < gameOptions.minItemsDistance) {
        overlap = true;
        

        
      }
    })
    return overlap;
  }

  releaseHero(e) {
    if (this.canSummonHero) {
      this.canSummonHero = false;
      let item = this.matter.add.image(e.x, -200, "enterprise");
      item.setCircle();
      item.setBounce(1);
      item.body.label = HERO;
      
    }
  
  }
  
};
