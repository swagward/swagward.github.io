export class Weapon extends Phaser.Physics.Arcade.Sprite {
    constructor(world, player, texture, name, damage, range, cooldown, maxAmmo) {
        super(world.scene, player.x, player.y, texture);

        this.scene = world.scene;
        this.player = player;
        this.name = name;
        this.damage = damage;
        this.range = range;
        this.bulletSpeed = 300;
        this.cooldown = cooldown;
        this.lastAttackTime = 0;
        this.maxAmmo = maxAmmo;
        this.ammo = maxAmmo;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.unequip();
    }

    equip() {
        this.setVisible(true);
        this.setActive(true);
    }

    unequip() {
        this.setVisible(false);
        this.setActive(false);
    }

    canAttack() {
        return Date.now() >= this.lastAttackTime + this.cooldown && this.ammo > 0;
    }

    attack(world) {
        if (this.canAttack()) {
            const pointer = this.scene.input.activePointer;
            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
    
            //Create a bullet and set its properties
            const spawnOffset = 10; //Spawn 10 pixels away from the player
            const spawnX = this.player.x + Math.cos(angle) * spawnOffset;
            const spawnY = this.player.y + Math.sin(angle) * spawnOffset;
            const bullet = this.scene.physics.add.sprite(spawnX, spawnY, 'bullet');
            bullet.setRotation(angle);
            bullet.setVelocity(
                Math.cos(angle) * this.bulletSpeed,
                Math.sin(angle) * this.bulletSpeed
            );

            world.SFX.gunShoot.play();

            //Add collision logic for enemies + obstacles
            this.scene.physics.add.collider(bullet, world.wallLayer, () => {
                bullet.destroy();
                console.log("hit wall");
            });
    
            this.scene.physics.add.overlap(bullet, world.enemies, (bullet, enemy) => {
                console.log(enemy);
                enemy.takeDamage(this.damage, world);
                bullet.destroy();
            });

            //Destroy the bullet if it hasnt made any collisions in 2 seconds (will be moving fast enough to be destroyed outside of player view)
            this.scene.time.delayedCall(2000, () => {
                if (bullet.active) {
                    bullet.destroy();
                }
            });
    
            this.ammo--;
            this.lastAttackTime = Date.now();

        } else if(this.ammo <= 0) {
            console.log("Out of ammo");
        }
    }

    reload() {
        this.ammo = Math.min(this.maxAmmo, this.ammo + this.maxAmmo);
    }
}