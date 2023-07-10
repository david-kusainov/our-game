import Phaser from 'phaser'
import { PlayerController } from '../gameMechanics/movement'

export class UpperWorld extends Phaser.Scene {
  private playerController?: PlayerController
  private player!: Phaser.Physics.Arcade.Sprite

  constructor() {
    super('upperworld')
  }

  init() {}

  preload() {
    this.load.image('upperworld-sky', './assets/background.png')
    this.load.image('ground', './assets/ground.png')
    this.load.image('man', './assets/man.png')
  }

  create() {
    // Фон
    this.add.image(300, 400, 'upperworld-sky')

    // Земля
	const groundGroup = this.physics.add.staticGroup()
    groundGroup.create(300, 900, 'ground')
    groundGroup.create(820, 900, 'ground')
    groundGroup.create(1340, 900, 'ground')


    // Игрок
    this.player = this.physics.add.sprite(300, 300, 'man')
    this.player.setScale(0.4)

    this.physics.add.collider(this.player, groundGroup)

    // Контроллер игрока
    const inputPlugin = this.input
    if (inputPlugin && inputPlugin.keyboard) {
      this.playerController = new PlayerController(this, this.player, inputPlugin)
    }
  }

  update() {
    if (this.playerController) {
      this.playerController.update();
    }
  }
}
