export class Ammo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, posX, posY) {
        super(scene, posX, posY, 'ammo');

        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setCollideWorldBounds(true);
    }
}