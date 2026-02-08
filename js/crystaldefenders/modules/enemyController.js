import { GAME_ACTIVE, TILESIZE, easyStarPF } from "../game.js";
import { Ammo } from "./ammo.js";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(world, posX, posY, texture, beacon, player, speed) {
        super(world.scene, posX, posY, texture);

        this.scene = world.scene;
        this.beacon = beacon;
        this.player = player;
        this.health = 50;
        this.speed = 20 + speed;
        this.damage = 10;
        this.attackCooldown = 1000;
        this.lastAttackTime = 0;
        this.isAttacking = false;

        this.currentTarget = beacon;
        this.path = null;
        this.nextPathIndex = 0;
        this.pathCooldown = 1;
        this.lastPathTime = 0;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.loadAnimations(texture);
        this.updatePath();
    }

    loadAnimations(texture) {
        const createAnim = (key, start, end) => {
            this.scene.anims.create({
                key,
                frames: this.scene.anims.generateFrameNumbers(texture, { start, end }),
                frameRate: 5,
                repeat: -1
            });
        };

        createAnim('enemyDown', 8, 9);
        createAnim('enemyUp', 16, 17);
        createAnim('enemyRight', 24, 25);
        createAnim('enemyLeft', 32, 33);
    }

    updatePath() {
        const currentTime = this.scene.time.now;

        //Wait before making new path
        if (currentTime - this.lastPathTime < this.pathCooldown || this.isAttacking) {
            return;
        }

        const startX = Math.floor(this.x / TILESIZE);
        const startY = Math.floor(this.y / TILESIZE);
        const endX = Math.floor(this.currentTarget.x / TILESIZE);
        const endY = Math.floor(this.currentTarget.y / TILESIZE);

        easyStarPF.findPath(startX, startY, endX, endY, (path) => {
            if (path && path.length > 0) {
                this.path = path;
                this.nextPathIndex = 1; //Start following the path from the second node (next node in the sequence)
            }
        });
        easyStarPF.calculate();

        this.lastPathTime = currentTime;
    }

    followPath() {
        if(this.isAttacking || !this.path || this.nextPathIndex >= this.path.length) {
            return;
        }

        const nextTile = this.path[this.nextPathIndex];
        const nextX = nextTile.x * TILESIZE + TILESIZE / 2;
        const nextY = nextTile.y * TILESIZE + TILESIZE / 2;

        this.scene.physics.moveTo(this, nextX, nextY, this.speed);

        //Check if the enemy reached the next tile
        if (Phaser.Math.Distance.Between(this.x, this.y, nextX, nextY) < 4) {
            this.nextPathIndex++;
        }

        //Play animation based on direction
        const dx = nextX - this.x;
        const dy = nextY - this.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.play(dx > 0 ? 'enemyRight' : 'enemyLeft', true);
        } else {
            this.play(dy > 0 ? 'enemyDown' : 'enemyUp', true);
        }
    }

    detect() {
        const dstToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        const dstToBeacon = Phaser.Math.Distance.Between(this.x, this.y, this.beacon.x, this.beacon.y);

        if (dstToPlayer <= dstToBeacon) {
            //Switch target to player if close enough
            this.currentTarget = this.player;
        } else {
            //Else default to the beacon if can
            this.currentTarget = this.beacon;
        }
    }

    attackTarget(target, world) {
        const currentTime = this.scene.time.now;

        if (currentTime - this.lastAttackTime > this.attackCooldown) {
            this.isAttacking = true; //Stop movement during attack
            this.body.setVelocity(0, 0);

            target.takeDamage(this.damage, world);
            this.lastAttackTime = currentTime;

            //Resume movement after the attack cooldown
            this.scene.time.delayedCall(this.attackCooldown, () => {
                this.isAttacking = false;
            });
        }
    }

    update(world) {
        //Enemy is dead
        if(!this.active) return;
        //The beacon has been destroyed so stop everything
        if (!GAME_ACTIVE) {
            this.body.setVelocity(0, 0);
            return;
        }

        this.detect();

        //Update path if necessary
        if (!this.path || this.nextPathIndex >= this.path.length) {
            this.updatePath();
        }

        if (!this.isAttacking) {
            this.followPath();
        }

        const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.currentTarget.x, this.currentTarget.y);
        if (distanceToTarget < TILESIZE) {
            this.attackTarget(this.currentTarget, world);
        }
    }

    takeDamage(damage, world) {
        this.health -= damage;
        if (this.health <= 0) {
            if(Phaser.Math.Between(0, 2) === 1) {
                //random 33% chance to drop ammo on death
                const ammo = new Ammo(this.scene, this.x, this.y);
                this.scene.physics.add.collider(ammo, this.scene.wallLayer);
                world.ammoPickup.push(ammo);
            }

            //finally kill enemy after creating ammo pickup (if its even created)
            world.score += 1;
            world.UI.scoreText.setText(world.score);
            this.destroy();
        }
    }
}