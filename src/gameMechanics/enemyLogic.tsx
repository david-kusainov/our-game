import Phaser from 'phaser';
import { CharacterController } from './hitPoint';

export class EnemyLogic {
  private ghostGroup?: Phaser.Physics.Arcade.Group;
  private harpyGroup?: Phaser.Physics.Arcade.Group;
  private vikingGroup?: Phaser.Physics.Arcade.Group;
  private bossGroup?: Phaser.Physics.Arcade.Group;
  private player: Phaser.Physics.Arcade.Sprite;
  private time: Phaser.Time.Clock;
  private physics: Phaser.Physics.Arcade.ArcadePhysics;
  private characterController: CharacterController;
  private harpyBulletPath: string;
  private bossBulletPath: string;
  private visibilityRadius: number = 800;// Расстояние видимости
  private visibilityRadiusBoss: number = 1200;// Расстояние видимости для босса
  private lastHitTime: number = 0;
  private hitCooldown: number = 300; //Задержка атак

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    groundGroup: Phaser.Physics.Arcade.StaticGroup,
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    harpyBulletPath: string,
    bossBulletPath: string
  ) {
    this.player = player;
    this.time = scene.time;
    this.physics = physics;
    this.characterController = new CharacterController(scene);
    this.harpyBulletPath = harpyBulletPath;
    this.bossBulletPath = bossBulletPath;
  }



  setGroups(
    ghostGroup: Phaser.Physics.Arcade.Group,
    harpyGroup: Phaser.Physics.Arcade.Group,
    vikingGroup: Phaser.Physics.Arcade.Group,
    bossGroup: Phaser.Physics.Arcade.Group
  ) {
    this.ghostGroup = ghostGroup;
    this.harpyGroup = harpyGroup;
    this.vikingGroup = vikingGroup;
    this.bossGroup = bossGroup;
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
          const bullet = this.physics.add.sprite(harpySprite.x, harpySprite.y, 'harpyBullet');
          bullet.setScale(0.3); // Размер
          bullet.setVelocityY(500); // Скорость

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
          vikingSprite.setVelocityY(-400);
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

    // Логика босса
    this.bossGroup?.getChildren().forEach((boss: Phaser.GameObjects.GameObject) => {
      const bossSprite = boss as Phaser.Physics.Arcade.Sprite;
      const directionX = Math.sign(this.player!.x - bossSprite.x);

      // Проверяем расстояние до игрока
      const distanceToPlayer = Phaser.Math.Distance.Between(
        this.player!.x,
        this.player!.y,
        bossSprite.x,
        bossSprite.y
      );

      if (distanceToPlayer < this.visibilityRadiusBoss) {
        bossSprite.setVelocityX(directionX * 200); // Скорость движения по оси X

        const jumpRate = 5000; // Прыжок каждые 5 секунд
        let lastJumpTime = bossSprite.getData('lastJumpTime') || 0;
        const currentTime = this.time.now;
        const canJump = currentTime - lastJumpTime >= jumpRate;

        if (canJump) {
          bossSprite.setVelocityY(-600); // Прыжок вверх
          lastJumpTime = currentTime;
          bossSprite.setData('lastJumpTime', lastJumpTime);
        }

        // Стрельба
        const fireRate = 3000;
        let lastFireTime = bossSprite.getData('lastFireTime') || 0;
        const canFire = currentTime - lastFireTime >= fireRate;

        if (canFire) {
          const bullet = this.physics.add.sprite(bossSprite.x, bossSprite.y, 'bossBullet');
          bullet.setScale(0.3); // Размер
          bullet.setVelocityX(directionX * 1600); // Скорость по оси X
          bullet.setGravity(0);
          
          // Логика прокосновений
          this.physics.add.collider(bullet, this.player, () => {
            const currentTime = this.time.now;
            if (currentTime - this.lastHitTime >= this.hitCooldown) {
              this.characterController.takeDamage(20);  // Единиц урона за касание
              this.lastHitTime = currentTime;
            }
          });

          lastFireTime = currentTime;
          bossSprite.setData('lastFireTime', lastFireTime);
        }
      } else {
        bossSprite.setVelocity(0);
      }

      // Логика прокосновений
      this.physics.add.collider(bossSprite, this.player, () => {
        const currentTime = this.time.now;
        if (currentTime - this.lastHitTime >= this.hitCooldown) {
          this.characterController.takeDamage(1000); // Единиц урона за касание
          this.lastHitTime = currentTime;
        }
      });
    });


  }
}
