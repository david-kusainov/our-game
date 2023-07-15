  import Phaser from 'phaser';

  export class EnemyLogic {
    private ghostGroup?: Phaser.Physics.Arcade.Group;
    private harpyGroup?: Phaser.Physics.Arcade.Group;
    private vikingGroup?: Phaser.Physics.Arcade.Group;
    private player: Phaser.Physics.Arcade.Sprite;
    private time: Phaser.Time.Clock;
    private physics: Phaser.Physics.Arcade.ArcadePhysics;


    constructor(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Sprite, groundGroup: Phaser.Physics.Arcade.StaticGroup, physics: Phaser.Physics.Arcade.ArcadePhysics) {
      this.player = player;
      this.time = scene.time; 
      this.physics = physics;

      this.ghostGroup = scene.physics.add.group();
      this.harpyGroup = scene.physics.add.group();
      this.vikingGroup = scene.physics.add.group();
    }

    setGroups(ghostGroup: Phaser.Physics.Arcade.Group, harpyGroup: Phaser.Physics.Arcade.Group, vikingGroup: Phaser.Physics.Arcade.Group) {
      this.ghostGroup = ghostGroup;
      this.harpyGroup = harpyGroup;
      this.vikingGroup = vikingGroup;
    }
    
    update() {
      // Логика призраков
      this.ghostGroup?.getChildren().forEach((ghost: Phaser.GameObjects.GameObject) => {
        const ghostSprite = ghost as Phaser.Physics.Arcade.Sprite;
        const directionX = Math.sign(this.player!.x - ghostSprite.x);
        const directionY = Math.sign(this.player!.y - ghostSprite.y);
        ghostSprite.setVelocityX(directionX * 200);
        ghostSprite.setVelocityY(directionY * 100);
      });

      // Логика гарпий
      this.harpyGroup?.getChildren().forEach((harpy: Phaser.GameObjects.GameObject) => {
        const harpySprite = harpy as Phaser.Physics.Arcade.Sprite;
    
        const speed = 100;
        const maxHeight = 10;
        const minHeight = 100;
        const targetY = Phaser.Math.Clamp((this.player?.y ?? 0) - 100, maxHeight, minHeight);
        const targetX = this.player?.x ?? 0;
    
        if (harpySprite.y > targetY) {
          harpySprite.setVelocityY(-speed);
        } else {
          harpySprite.setVelocityY(speed);
        }
    
        if (harpySprite.x > targetX) {
          harpySprite.setVelocityX(-speed);
        } else {
          harpySprite.setVelocityX(speed);
        }
    
        // Стрельба снарядом
        const fireRate = 3000;
        let lastFireTime = harpySprite.getData('lastFireTime') || 0;
        const currentTime = this.time.now;
        const canFire = currentTime - lastFireTime >= fireRate;
    
        if (canFire) {
          const bullet = this.physics.add.sprite(harpySprite.x, harpySprite.y, 'bullet');
          bullet.setVelocityY(500);
          this.physics.add.collider(bullet, this.player, () => {
            // Логика при попадании снаряда в игрока
          });
    
          lastFireTime = currentTime;
          harpySprite.setData('lastFireTime', lastFireTime);
        }
      });
      
      // Логика викингов
      this.vikingGroup?.getChildren().forEach((viking: Phaser.GameObjects.GameObject) => {
        const vikingSprite = viking as Phaser.Physics.Arcade.Sprite;
        const directionX = Math.sign(this.player!.x - vikingSprite.x);
        const directionY = Math.sign(this.player!.y - vikingSprite.y);
        const distance = Phaser.Math.Distance.Between(
          this.player!.x,
          this.player!.y,
          vikingSprite.x,
          vikingSprite.y
        );
        vikingSprite.setVelocityX(directionX * 200);
        if (distance < 100) {
          vikingSprite.setVelocityY(-300);
        }
      });
    }
  }
