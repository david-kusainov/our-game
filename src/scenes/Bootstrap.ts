
import Phaser from 'phaser'

export class Bootstrap extends Phaser.Scene {
	constructor() {
		super('bootstrap')
	}

	init() {}

	preload() {
		// This Loads my assets created with texture packer
		this.load.image('sky', './assets/sky.png')
	}

	create() {
        this.add.image(300, 400, 'sky')
		this.createNewGame()
	}

	update() {}

	private createNewGame() {
		
		this.scene.launch('game')
	}
}