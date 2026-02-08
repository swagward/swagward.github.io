import { CURRENT_ROUND, setGameActive } from '../game.js';

export class Beacon extends Phaser.Physics.Arcade.Sprite {
    constructor(world, posX, posY, texture, maxHealth = 100) {
        super(world.scene, posX, posY, texture);

        this.scene = world.scene;
        this.health = maxHealth;
        this.maxHealth = maxHealth;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setImmovable(true);
    }

    takeDamage(amount, world) {
        this.health -= amount;
        console.log(`${this.health} HP remaining!`);

        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
        }
    }

    destroy() {
        console.log("The beacon was destroyed!");
        setGameActive(false);
    }
    
    onRoundEnd() {
        //Regenerate partial health
        const regenAmount = Math.min(10, this.maxHealth - this.health);
        this.health += regenAmount;
        console.log(this.health);
    }
}