const container = document.getElementById('game-container');

import { PlayerController } from './modules/playerController.js'; //Quick side note: this had me stumped for a good hour, trying to figure out why it couldnt locate the directory. I checked it probably 9 or 10 times, only realising it needed the period at the start for whatever reason.
import { Enemy } from './modules/enemyController.js';
import { Beacon } from './modules/beacon.js';

const TILESIZE = 16;

//Exports
const PLAYER_STATE_EVENT = 'playerState';
const PLAYER_MOVE_EVENT = 'playerMove';
let CURRENT_ROUND = 0;
let GAME_ACTIVE = true;

let world = {
    scene: null,
    UI: {
        healthBar: null,
        staminaBar: null,
        scoreText: null,
        coinDisplay: null,
        ammoCount: null,
        deathOverlay: null,
        deathText: null,
        restartButton: null,
        deathRoundText: null,
        deathScoreText: null
    },
    SFX: {
        playerHurt: null,
        coinCollect: null,
        gunShoot: null
    },
    score: null,
    ammoPickup: [],
    inputs: null,
    map: null,
    tileset: null,
    groundLayer: null,
    wallLayer: null,
    collectableLayer: null,
    playerSpr: null,
    enemies: [],
    beaconSpr: null,
};

let config = {
    type: Phaser.AUTO,
    width: 1072,
    height: 720,
    parent: 'game-container',
    render: {
        pixelArt: true,
        antialias: false,
        antialiasGL: false
    },
    audio: {
        disableWebAudio: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let easyStarPF;

const ROUND_START_DELAY = 10 * 1000;
const ROUND_END_DELAY = 5 * 1000;
let ROUND_ACTIVE = false;
let ENEMIES_REMAINING = 0;

function preload() {
    this.load.setPath('./assets/');
    //Load the world tiles + game assets
    this.load.spritesheet('gameTiles', 'crystaldefenders/tileset.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.tilemapTiledJSON('tilemap', 'crystaldefenders/WorldMap.json');

    this.load.spritesheet('player', 'crystaldefenders/textures/player.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    this.load.spritesheet('enemy', 'crystaldefenders/textures/zombie.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    this.load.image('beacon', 'crystaldefenders/textures/beacon.png')

    this.load.image('pistol', 'crystaldefenders/textures/starterGun.png');
    this.load.image('bullet', 'crystaldefenders/textures/bullet.png');
    this.load.image('ammo', 'crystaldefenders/textures/ammo.png');

    this.load.audio('gunShoot', '/crystaldefenders/audio/gunShoot.mp3');
    this.load.audio('playerHurt', 'crystaldefenders/audio/playerHurt.mp3');
    this.load.audio('coinCollect', 'crystaldefenders/audio/coinCollect.mp3');
}

function create() {


    //#region INPUT SETUP
    world.scene = this;
    world.inputs = {
        //movement
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        shift: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        //mouse
        attack: this.input.activePointer,
        //inventory
        scrollLeft: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        scrollRight: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };
    //#endregion END OF INPUTS
    
    //#region WORLD SETUP
    world.map = this.make.tilemap({ key: 'tilemap' });
    world.tileset = world.map.addTilesetImage('tileset', 'gameTiles');

    world.groundLayer = world.map.createLayer("groundLayer", world.tileset);
    world.wallLayer = world.map.createLayer("wallLayer", world.tileset);
    world.collectableLayer = world.map.createLayer("collectableLayer", world.tileset);

    //Create coin animations from world tileset and replace default coins with animated coins.
    this.anims.create({
        key: 'coinSpin',
        frames: this.anims.generateFrameNumbers('gameTiles', { 
            start: 56,
            end: 61
        }),
        frameRate: 10,
        repeat: -1
    });
    const coins = this.physics.add.group();
    
    world.collectableLayer.forEachTile(tile => {
        if(tile.properties.type === 'coin') {
            const tileX = world.collectableLayer.tileToWorldX(tile.x);
            const tileY = world.collectableLayer.tileToWorldY(tile.y);
            
            //Replace coin with animated sprite
            const coinSprite = this.add.sprite(tileX + TILESIZE / 2, tileY + TILESIZE / 2, 'gameTiles');
            coinSprite.play('coinSpin');
            
            coins.add(coinSprite);
            
            world.map.removeTileAt(tile.x, tile.y, false, false, world.collectableLayer);
        }
    });
    
    //Set world boundaries
    this.physics.world.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    world.wallLayer.setCollisionBetween(1, 300);
    
    //Initialise the player & add collision for entities (Coins, Enemies, Etc)
    world.playerSpr = new PlayerController(world, 520, 400, 'player');
    
    this.physics.add.overlap(
        world.playerSpr,
        coins,
        (player, coinSprite) => { //player isnt used but for whatever reason it breaks the player movement if it isnt here.
            collectCoin(coinSprite);
        },
        null,
        this
    );

    easyStarPF = new EasyStar.js();
    const grid = [];
     for (let y = 0; y < world.map.height; y++) {
        grid[y] = [];
        for (let x = 0; x < world.map.width; x++) {
            const tile = world.wallLayer.getTileAt(x, y);
            if (tile && tile.index !== -1) {
                //Wall
                grid[y][x] = 0;
            } else {
                //Ground
                grid[y][x] = 1;
            }
        }
    }

    easyStarPF.setGrid(grid);
    easyStarPF.setAcceptableTiles([1]);

    world.SFX.coinCollect = this.sound.add('coinCollect');
    world.SFX.gunShoot = this.sound.add('gunShoot');
    world.SFX.playerHurt = this.sound.add('playerHurt');
    //#endregion END OF WORLD SETUP

    //Create a camera to follow the player
    this.cameras.main.startFollow(world.playerSpr, true);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    
    world.beaconSpr = new Beacon(world, config.width / 2, config.height / 2, 'beacon');

    createUI(this.cameras.main);
    updateUI();
    
    //Start the first round, but have a countdown so the player isnt immediately thrown into fights
    startPreRoundTimer();
}

function createUI(camera) {
    world.UI.healthBar = world.scene.add.graphics();
    world.UI.healthBar.setScrollFactor(0); //Make the ui scroll with the camera

    world.UI.staminaBar = world.scene.add.graphics();
    world.UI.staminaBar.setScrollFactor(0);

    world.UI.ammoCount = world.scene.add.text(278, 515, `Ammo: ${world.playerSpr.inventory.getHeldItem().ammo}`, {
        fontSize: '16px',
        resolution: 3
    }).setFontStyle('bold');
    world.UI.ammoCount.setScrollFactor(0);

    world.UI.coinDisplay = world.scene.add.sprite(750, 200, 'gameTiles').play('coinSpin');
    world.UI.coinDisplay.setScale(2);
    world.UI.coinDisplay.setScrollFactor(0);
    world.UI.scoreText = world.scene.add.text(775, 190, '0', {
        fontSize: '16px',
        resolution: 3
    }).setFontStyle('bold');
    world.UI.scoreText.setScale(1.5);
    world.UI.scoreText.setScrollFactor(0);

    world.UI.deathOverlay = world.scene.add.rectangle(
        camera.centreX,
        camera.centerY,
        camera.width * 2,
        camera.height,
        0x000000,
        0.7 //transparency
    ).setVisible(false);
    world.UI.deathText = world.scene.add.text(
        camera.centerX,
        camera.centerY - 50,
        'GAME OVER', {
            fontSize: '48px',
            color: '#ff0000',
            resolution: 3
        }
    ).setOrigin(0.5).setVisible(false);
    world.UI.restartButton = world.scene.add.text(
        camera.centerX,
        camera.centerY + 50,
        'RESTART', {
            fontSize: '32px',
            color: '#ffffff',
            resolution: 3,
            backgroundColor: '#ff0000',
            padding: { x: 10, y: 5 }
        }
    ).setOrigin(0.5).setInteractive().setVisible(false);
    /*world.UI.deathRoundText = world.scene.add.text(
        camera.centerX,
        camera.centerY,
        `You died on round ${CURRENT_ROUND + 1}`, {
            fontSize: '24px',
            color: '#ffffff',
            resolution: 3
        }
    ).setOrigin(0.5).setVisible(true);*/

    world.UI.restartButton.on('pointerdown', () => {
        window.location.reload();
    });

    world.UI.deathOverlay.setScrollFactor(0).setDepth(100);
    world.UI.deathText.setScrollFactor(0).setDepth(100);
    world.UI.restartButton.setScrollFactor(0).setDepth(100);

    updateUI();
}

function updateUI() {
    const healthPercentage = world.playerSpr.health / 100;
    const staminaPercentage = world.playerSpr.stamina / 100;

    const barWidth = 200 / 2;
    const barHeight = 10;

    //health
    world.UI.healthBar.clear();
    world.UI.healthBar.lineStyle(1, 0x000000, 1); //give the healthbar a black outline so it pops out a bit more
    world.UI.healthBar.strokeRect(277.5, 189.5, barWidth + 1, barHeight + 1);
    world.UI.healthBar.fillStyle(0xff0000, 1); //fill with red to show player health
    world.UI.healthBar.fillRect(278, 190, barWidth * healthPercentage, barHeight);

    //stamina (literally the exact same as the health bar, but for the player sprinting stuff)
    world.UI.staminaBar.clear();
    world.UI.staminaBar.lineStyle(1, 0x000000, 1);
    world.UI.staminaBar.strokeRect(277.5, 204.5, barWidth + 1, barHeight + 1);
    world.UI.staminaBar.fillStyle(0xffa500, 1);
    world.UI.staminaBar.fillRect(278, 205, barWidth * staminaPercentage, barHeight);

    //ammo
    world.UI.ammoCount.setText(`Ammo: ${world.playerSpr.inventory.getHeldItem().ammo}/${world.playerSpr.inventory.getHeldItem().maxAmmo}`);

}

//#region ROUND MECHANICS
function spawnEnemies(round) {
    const enemyCount = 5 + round * 2;
    const enemySpeed = Math.floor(round / 5) * 5;
    console.log("Count: ", enemyCount);
    console.log("Speed: ", enemySpeed + 20);


    ENEMIES_REMAINING = enemyCount;
    for(let i = 0; i < enemyCount; i++) {
        const spawnPoint = getRandomSpawnPoint();
        const enemy = new Enemy(world, spawnPoint.x, spawnPoint.y, 'enemy', world.beaconSpr, world.playerSpr, enemySpeed);

        enemy.on('destroy', () => {
            ENEMIES_REMAINING--;
            if(ENEMIES_REMAINING === 0 && ROUND_ACTIVE) {
                startPostRoundTimer();
            }
        });

        world.enemies.push(enemy);
    }
}

function startPreRoundTimer() {
    ROUND_ACTIVE = false;
    CURRENT_ROUND++;
    console.log("Round starts in", ROUND_START_DELAY / 1000, " seconds");

    setTimeout(() => {
        startRound();
    }, ROUND_START_DELAY);
}

function startRound() {
    ROUND_ACTIVE = true;
    spawnEnemies(CURRENT_ROUND);
}

function startPostRoundTimer() {
    world.beaconSpr.onRoundEnd(world);
    ROUND_ACTIVE = false;
    console.log("Next rounds starts in", ROUND_END_DELAY / 1000, " seconds");

    setTimeout(() => {
        startPreRoundTimer();
    }, ROUND_END_DELAY);
}

function getRandomSpawnPoint() {
    const mapWidth = world.map.widthInPixels;
    const mapHeight = world.map.heightInPixels;
    const randomSide = Phaser.Math.Between(0, 3);

    if (randomSide === 0) return { x: Phaser.Math.Between(1, mapWidth - 1), y: 1 }; // Top
    if (randomSide === 1) return { x: mapWidth - 1, y: Phaser.Math.Between(1, mapHeight - 1) }; // Right
    if (randomSide === 2) return { x: Phaser.Math.Between(1, mapWidth - 1), y: mapHeight - 1 }; // Bottom
    return { x: 1, y: Phaser.Math.Between(1, mapHeight - 1) }; // Left

} 

function collectCoin(coinSprite) {
    coinSprite.destroy();
    
    world.score = (world.score || 0) + 1;
    world.UI.scoreText.setText(world.score);

    world.SFX.coinCollect.play({
        volume: 0.5,
        rate: 1,
        loop: false
    });
}
//#endregion END OF ROUND MECHANICS

function update() {
    if(GAME_ACTIVE) {
        world.playerSpr.update(world);
        updateUI();

        console.log(CURRENT_ROUND);

        world.enemies.forEach(enemy => {
            enemy.update(world);
        });
    } else {
        world.UI.deathOverlay.setVisible(true);
        world.UI.deathText.setVisible(true);
        world.UI.restartButton.setVisible(true);
        //fix for the round count on death
        world.UI.deathRoundText = world.scene.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `You died on round ${CURRENT_ROUND}`, {
                fontSize: '24px',
                color: '#ffffff',
                resolution: 3
            }
        ).setOrigin(0.5).setVisible(true).setScrollFactor(0).setDepth(100);
    }
}

function setGameActive(value) {
    console.log("Game over");
    GAME_ACTIVE = value;
}

export { PLAYER_STATE_EVENT, PLAYER_MOVE_EVENT, CURRENT_ROUND, GAME_ACTIVE, TILESIZE, easyStarPF, setGameActive };