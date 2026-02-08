import { PLAYER_STATE_EVENT, PLAYER_MOVE_EVENT, GAME_ACTIVE, setGameActive } from "../game.js";
import { Weapon } from './weapon.js';
import { Inventory } from './inventory.js';

export class PlayerController extends Phaser.Physics.Arcade.Sprite {
    constructor(world, posX, posY, texture) {
        super(world.scene, posX, posY, texture);

        this.scene = world.scene;
        this.playerSpeed = 0;
        this.walkSpeed = 30;
        this.sprintSpeed = 45;
        this.health = 100;
        this.maxStamina = 100;
        this.stamina = this.maxStamina;
        this.staminaUsed = 20;
        this.isSprinting = false;
        this.canSprint = true;

        this.inventory = new Inventory(3);
        this.starterGun = new Weapon(world, this, 'pistol', "Dads handgun", 20, 100, 500, 20);
        this.inventory.addItem(this.starterGun);

        this.currentWeapon = null;

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setCollideWorldBounds(true);

        this.loadAnims(texture);
    }

    attack(world) {
        if (this.currentWeapon) {
            this.currentWeapon.attack(world);
            //console.log("attacked");
        }
    }

    loadAnims(texture) {
        const createAnim = (key, start, end) => {
            this.scene.anims.create({
                key,
                frames: this.scene.anims.generateFrameNumbers(texture, { start, end }),
                frameRate: 5,
                repeat: -1
            });
            this.anims.load(key);
        };

        createAnim('walkDown', 8, 9);
        createAnim('walkUp', 16, 17);
        createAnim('walkRight', 24, 25);
        createAnim('walkLeft', 32, 33);
    }

    playAnims(animKey) {
        const animSpeed = this.isSprinting ? 10 : 5;
        this.anims.msPerFrame = 1000 / animSpeed;
        this.anims.play(animKey, true);
    }

    get playerHealth() {
        return this.health;
    }

    move(xDir, yDir) {
        if (xDir === 0 && yDir === 0) {
            this.setVelocity(0);
            this.setFrame(0);
        } else {
            this.setVelocityX(xDir * this.playerSpeed);
            this.setVelocityY(yDir * this.playerSpeed);

            if (xDir === -1) this.playAnims('walkLeft');
            else if (xDir === 1) this.playAnims('walkRight');

            if (yDir === -1) this.playAnims('walkUp');
            else if (yDir === 1) this.playAnims('walkDown');
        }
    }

    update(world) {
        let xDir = 0;
        let yDir = 0;

        if (world.inputs.left.isDown) xDir = -1;
        if (world.inputs.right.isDown) xDir = 1;
        if (world.inputs.up.isDown) yDir = -1;
        if (world.inputs.down.isDown) yDir = 1;

        const dTime = world.scene.game.loop.delta / 1000; //delta time in seconds
        if(world.inputs.shift.isDown && this.canSprint && this.stamina > 0) {
            this.isSprinting = true;
            this.playerSpeed = this.sprintSpeed;
            this.stamina -= this.staminaUsed * dTime;

            if(this.stamina <= 0) {
                this.stamina = 0;
                this.isSprinting = false;
                this.playerSpeed = this.walkSpeed;
            }
        } else { 
            this.isSprinting = false;
            this.playerSpeed = this.walkSpeed;

            if(this.stamina < this.maxStamina) {
                this.stamina += this.staminaUsed * dTime;

                if(this.stamina > this.maxStamina) {
                    this.stamina = this.maxStamina;
                }
            }
        }
        
        this.move(xDir, yDir);
        this.scene.physics.collide(this, world.wallLayer);

        if(this.currentWeapon) {
            const pointer = world.scene.input.activePointer;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
            const radius = 12;

            this.currentWeapon.setPosition(
                this.x + Math.cos(angle) * radius,
                this.y + Math.sin(angle) * radius
            );

            this.currentWeapon.setRotation(angle);

            if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
                this.currentWeapon.setFlipY(true);
            } else {
                this.currentWeapon.setFlipY(false);
            }
        }

        //Changing the players current item with Q and E keys
        if(Phaser.Input.Keyboard.JustDown(world.inputs.scrollLeft)) {
            this.inventory.switchItem(-1);
            this.currentWeapon = this.inventory.getHeldItem();
        }
        if(Phaser.Input.Keyboard.JustDown(world.inputs.scrollRight)) {
            this.inventory.switchItem(1);
            this.currentWeapon = this.inventory.getHeldItem();
        }

        if(world.inputs.attack.isDown) {
            this.attack(world);
        }

        this.scene.physics.add.overlap(this, world.ammoPickup, (player, ammo) => {
            player.currentWeapon.reload();
            ammo.destroy();
        });
    }

    takeDamage(amount, world) {
        this.health -= amount;
        console.log("Player health: " + this.health);
        world.SFX.playerHurt.play();

        if (this.health <= 0) {
            setGameActive(false);
        }
    }
}