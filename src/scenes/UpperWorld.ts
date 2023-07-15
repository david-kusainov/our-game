import Phaser from 'phaser';
import { PlayerController } from '../gameMechanics/movement';
import { DaggerController } from '../gameMechanics/attacksController';
import { EnemyLogic } from '../gameMechanics/enemyLogic';

export class UpperWorld extends Phaser.Scene {
  private playerController?: PlayerController;
  private daggerController?: DaggerController;
  private player!: Phaser.Physics.Arcade.Sprite;
  private groundGroup!: Phaser.Physics.Arcade.StaticGroup;
  private ghostGroup?: Phaser.Physics.Arcade.Group;
  private harpyGroup?: Phaser.Physics.Arcade.Group;
  private vikingGroup?: Phaser.Physics.Arcade.Group;
  private enemyLogic?: EnemyLogic;
  

  constructor() {
    super('upperworld');
  }

  init() {}

  async preload() {
    this.load.image('upperworld-sky', './assets/background.png');
    this.load.image('ground', './assets/ground.png');
    this.load.image('man', './assets/man.png');
    this.load.image('dagger', './assets/dagger.png');
    this.load.image('harpy', './assets/harpy.png');
    this.load.image('viking', './assets/viking.png');
    this.load.image('ghost', './assets/ghost.png');
  }

  create() {
    // Задний фон
    this.add.image(300, 400, 'upperworld-sky');

    // Земля
    this.groundGroup = this.physics.add.staticGroup();
    const ground1 = this.groundGroup.create(300, 900, 'ground');
    const ground2 = this.groundGroup.create(820, 900, 'ground');
    const ground3 = this.groundGroup.create(1340, 900, 'ground');

    // Персонаж
    this.player = this.physics.add.sprite(300, 300, 'man');
    this.player.setScale(0.4);
    this.physics.add.collider(this.player, this.groundGroup);

    // Призрак
    this.ghostGroup = this.physics.add.group();
    const ghost1 = this.ghostGroup.create(300, 300, 'ghost');

    this.ghostGroup.getChildren().forEach((ghost: Phaser.GameObjects.GameObject) => {
      const ghostSprite = ghost as Phaser.Physics.Arcade.Sprite;
      ghostSprite.setScale(0.5);
    });

    this.physics.add.collider(this.ghostGroup, this.groundGroup);

    // Гарпии
    this.harpyGroup = this.physics.add.group();
    const harpy1 = this.harpyGroup.create(400, 300, 'harpy');

    this.harpyGroup.getChildren().forEach((harpy: Phaser.GameObjects.GameObject) => {
      const harpySprite = harpy as Phaser.Physics.Arcade.Sprite;
      harpySprite.setScale(0.5);
    });

    this.physics.add.collider(this.harpyGroup, this.groundGroup);

    // Викинги
    this.vikingGroup = this.physics.add.group();
    const viking1 = this.vikingGroup.create(500, 300, 'viking');

    this.vikingGroup.getChildren().forEach((viking: Phaser.GameObjects.GameObject) => {
      const vikingSprite = viking as Phaser.Physics.Arcade.Sprite;
      vikingSprite.setScale(0.2);
    });
  
    this.physics.add.collider(this.vikingGroup, this.groundGroup);

    // Инициализация логики врагов
    this.enemyLogic = new EnemyLogic(this, this.player, this.groundGroup, this.physics);
    this.enemyLogic.setGroups(this.ghostGroup, this.harpyGroup, this.vikingGroup);

    // Контроллер персонажа
    const inputPlugin = this.input;
    if (inputPlugin && inputPlugin.keyboard) {
      this.playerController = new PlayerController(this, this.player, inputPlugin);
    }

    // Контроллер кинжала
    this.daggerController = new DaggerController(this.player, this);
    this.daggerController.create();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.daggerController) {
        this.daggerController.throwDagger(pointer);
      }
    });
  }

  update() {
    if (this.playerController) {
      this.playerController.update();
    }

    if (this.daggerController) {
      this.daggerController.update();
    }

    if (this.enemyLogic) {
      this.enemyLogic.update();
    }
  }
}
