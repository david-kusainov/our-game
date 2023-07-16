import Phaser from 'phaser';
import { CharacterController } from './hitPoint';

export class EnemyLogic {
  private ghostGroup?: Phaser.Physics.Arcade.Group;
  private harpyGroup?: Phaser.Physics.Arcade.Group;
  private vikingGroup?: Phaser.Physics.Arcade.Group;
  private player: Phaser.Physics.Arcade.Sprite;
  private time: Phaser.Time.Clock;
  private physics: Phaser.Physics.Arcade.ArcadePhysics;
  private characterController: CharacterController;
  private visibilityRadius: number = 500;// Расстояние видимости
  private lastHitTime: number = 0;
  private hitCooldown: number = 300; //Задержка атак

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    groundGroup: Phaser.Physics.Arcade.StaticGroup,
    physics: Phaser.Physics.Arcade.ArcadePhysics
  ) {
    this.player = player;
    this.time = scene.time;
    this.physics = physics;
    this.characterController = new CharacterController(scene);
  }

  setGroups(
    ghostGroup: Phaser.Physics.Arcade.Group,
    harpyGroup: Phaser.Physics.Arcade.Group,
    vikingGroup: Phaser.Physics.Arcade.Group
  ) {
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

      // Проверяем расстояние до игрока
      const distance = Phaser.Math.Distance.Between(
        this.player!.x,
        this.player!.y,
        ghostSprite.x,
        ghostSprite.y
      );

      if (distance < this.visibilityRadius) {
        ghostSprite.setVelocityX(directionX * 200);
        ghostSprite.setVelocityY(directionY * 100);
      } else {
        ghostSprite.setVelocity(0);
      }
      // Логика прокосновений
      this.physics.add.collider(ghostSprite, this.player, () => {
        const currentTime = this.time.now;
        if (currentTime - this.lastHitTime >= this.hitCooldown) {
          this.characterController.takeDamage(10);  // Единиц урона за касание
          this.lastHitTime = currentTime;
        }
      });
    });

    // Логика гарпий
    this.harpyGroup?.getChildren().forEach((harpy: Phaser.GameObjects.GameObject) => {
      const harpySprite = harpy as Phaser.Physics.Arcade.Sprite;

      const speed = 100;
      const maxHeight = 10;
      const minHeight = 100;
      const targetY = Phaser.Math.Clamp((this.player?.y ?? 0) - 100, maxHeight, minHeight);
      const targetX = this.player?.x ?? 0;

      // Проверяем расстояние до игрока
      const distanceToPlayer = Phaser.Math.Distance.Between(
        this.player!.x,
        this.player!.y,
        harpySprite.x,
        harpySprite.y
      );

      if (distanceToPlayer < this.visibilityRadius) {
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

        // Стрельба
        const fireRate = 3000;
        let lastFireTime = harpySprite.getData('lastFireTime') || 0;
        const currentTime = this.time.now;
        const canFire = currentTime - lastFireTime >= fireRate;

        if (canFire) {
          const bullet = this.physics.add.sprite(harpySprite.x, harpySprite.y, 'bullet');
          bullet.setVelocityY(500);

          // Логика прокосновений
          this.physics.add.collider(bullet, this.player, () => {
            const currentTime = this.time.now;
            if (currentTime - this.lastHitTime >= this.hitCooldown) {
              this.characterController.takeDamage(20);  // Единиц урона за касание
              this.lastHitTime = currentTime;
            }
          });

          lastFireTime = currentTime;
          harpySprite.setData('lastFireTime', lastFireTime);
        }
      } else {
        harpySprite.setVelocity(0);
      }
    });

    // Логика викингов
    this.vikingGroup?.getChildren().forEach((viking: Phaser.GameObjects.GameObject) => {
      const vikingSprite = viking as Phaser.Physics.Arcade.Sprite;
      const directionX = Math.sign(this.player!.x - vikingSprite.x);
      const directionY = Math.sign(this.player!.y - vikingSprite.y);

      // Проверяем расстояние до игрока
      const distanceToPlayer = Phaser.Math.Distance.Between(
        this.player!.x,
        this.player!.y,
        vikingSprite.x,
        vikingSprite.y
      );

      if (distanceToPlayer < this.visibilityRadius) {
        const distanceToPlayer = Phaser.Math.Distance.Between(
          this.player!.x,
          this.player!.y,
          vikingSprite.x,
          vikingSprite.y
        );

        vikingSprite.setVelocityX(directionX * 200);
        if (distanceToPlayer < 100) {
          vikingSprite.setVelocityY(-300);
        }
      } else {
        vikingSprite.setVelocity(0);
      }

      // Логика прокосновений
      this.physics.add.collider(vikingSprite, this.player, () => {
        const currentTime = this.time.now;
        if (currentTime - this.lastHitTime >= this.hitCooldown) {
          this.characterController.takeDamage(10); // Единиц урона за касание
          this.lastHitTime = currentTime;
        }
      });
    });
  }
}
