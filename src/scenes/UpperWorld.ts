import Phaser from 'phaser';
import { PlayerController } from '../gameMechanics/movement';
import { DaggerController } from '../gameMechanics/attacksController';

export class UpperWorld extends Phaser.Scene {
  private playerController?: PlayerController;
  private daggerController?: DaggerController;
  private player!: Phaser.Physics.Arcade.Sprite;
  private groundGroup!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super('upperworld');
  }

  init() {}

  preload() {
    this.load.image('upperworld-sky', './assets/background.png');
    this.load.image('ground', './assets/ground.png');
    this.load.image('man', './assets/man.png');
    this.load.image('dagger', './assets/dagger.png');
  }

  create() {
    this.add.image(300, 400, 'upperworld-sky');

    this.groundGroup = this.physics.add.staticGroup();
    this.groundGroup.create(300, 900, 'ground');
    this.groundGroup.create(820, 900, 'ground');
    this.groundGroup.create(1340, 900, 'ground');

    this.player = this.physics.add.sprite(300, 300, 'man');
    this.player.setScale(0.4);
    this.physics.add.collider(this.player, this.groundGroup);

    const inputPlugin = this.input;
    if (inputPlugin && inputPlugin.keyboard) {
      this.playerController = new PlayerController(this, this.player, inputPlugin);
    }

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
  }
}
