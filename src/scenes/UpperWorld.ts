import Phaser from 'phaser'

export class UpperWorld extends Phaser.Scene {
	constructor() {
		super('upperworld')
	}

	init() {}

	preload() {
		this.load.image('upperworld-sky', './assets/background.png')
	}

	create() {
        this.add.image(300, 400, 'upperworld-sky')
		// this.createNewGame()
	}

	update() {}

	// private createNewGame() {
		
	// 	this.scene.launch('game')
	// }
}