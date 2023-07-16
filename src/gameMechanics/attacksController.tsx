import Phaser from 'phaser';

export class DaggerController {
  private dagger?: Phaser.GameObjects.Sprite;
  private daggerThrown: boolean = false;
  private isMousePressed: boolean = false;
  private isReturning: boolean = false;
  private initialPlayerX: number = 0;
  private initialPlayerY: number = 0;
  private hitCounts: Map<Phaser.Physics.Arcade.Sprite, number> = new Map();

  constructor(
    private player: Phaser.Physics.Arcade.Sprite,
    private scene: Phaser.Scene,
    private ghostGroup: Phaser.Physics.Arcade.Group,
    private harpyGroup: Phaser.Physics.Arcade.Group,
    private vikingGroup: Phaser.Physics.Arcade.Group
  ) {}

  create() {
    this.dagger = this.scene.add.sprite(0, 0, 'dagger');
    this.dagger.setOrigin(0.5, 0.5);
    this.dagger.setScale(0.5);
    this.dagger.setVisible(false);

    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
  }

  handlePointerDown() {
    this.isMousePressed = true;
    this.isReturning = false;
  }

  handlePointerUp() {
    this.isMousePressed = false;
    this.isReturning = true;
  }

  throwDagger(pointer: Phaser.Input.Pointer) {
    if (!this.daggerThrown && this.isMousePressed) {
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      const angle = Phaser.Math.Angle.Between(
        playerBody.center.x,
        playerBody.center.y,
        pointer.worldX,
        pointer.worldY
      );

      const offsetX = Math.cos(angle) * 50;
      const offsetY = Math.sin(angle) * 50;

      const daggerX = playerBody.center.x + offsetX;
      const daggerY = playerBody.center.y + offsetY;

      this.dagger?.setRotation(angle);
      this.dagger?.setPosition(daggerX, daggerY);
      this.dagger?.setVisible(true);

      this.initialPlayerX = playerBody.center.x;
      this.initialPlayerY = playerBody.center.y;

      this.daggerThrown = true;
      this.isReturning = false;
    }
  }

  returnDagger() {
    this.dagger?.setVisible(false);
    this.daggerThrown = false;
    this.isReturning = false;
  }

  update() {
    if (this.daggerThrown) {
      const pointer = this.scene.input.activePointer;
      const angle = Phaser.Math.Angle.Between(
        this.dagger!.x,
        this.dagger!.y,
        pointer.worldX,
        pointer.worldY
      );
      const distance = Phaser.Math.Distance.Between(
        this.dagger!.x,
        this.dagger!.y,
        pointer.worldX,
        pointer.worldY
      );
      const speed = 0.18;

      if (!this.isReturning) {
        const offsetX = Math.cos(angle) * distance * speed;
        const offsetY = Math.sin(angle) * distance * speed;

        this.dagger?.setPosition(this.dagger!.x + offsetX, this.dagger!.y + offsetY);
      } else {
        const returnSpeed = 14;
        const deltaX = this.player.x - this.dagger!.x;
        const deltaY = this.player.y - this.dagger!.y;
        const deltaDistance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.dagger!.x,
          this.dagger!.y
        );

        if (deltaDistance > returnSpeed) {
          const offsetX = (deltaX / deltaDistance) * returnSpeed;
          const offsetY = (deltaY / deltaDistance) * returnSpeed;

          this.dagger?.setPosition(this.dagger!.x + offsetX, this.dagger!.y + offsetY);
        } else {
          this.returnDagger();
        }
      }
      this.checkMonsterCollisions(this.ghostGroup);
      this.checkMonsterCollisions(this.harpyGroup);
      this.checkMonsterCollisions(this.vikingGroup);
    }
  }

  checkMonsterCollisions(group: Phaser.Physics.Arcade.Group) {
    group.getChildren().forEach((monster) => {
      const monsterSprite = monster as Phaser.Physics.Arcade.Sprite;
      if (!this.dagger || !monsterSprite) {
        return;
      }

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          monsterSprite.getBounds(),
          this.dagger!.getBounds()
        )
      ) {
        this.handleMonsterHit(monsterSprite);
      }
    });
  }

  handleMonsterHit(monster: Phaser.Physics.Arcade.Sprite) {
    const hitCount = (this.hitCounts.get(monster) || 0) + 1;
    this.hitCounts.set(monster, hitCount);

    // console.log(`Количество попаданий: ${hitCount}`);

    if (hitCount >= 100) {
      monster.destroy();
    }
  }
}
