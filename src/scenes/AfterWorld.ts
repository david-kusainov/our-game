import Phaser from 'phaser'

export class AfterWorld extends Phaser.Scene {
	constructor() {
		super('afterworld')
	}

	init() {}

	preload() {
		this.load.image('afterworld-sky', './assets/background.png')
	}

	create() {
        this.add.image(300, 400, 'afterworld-sky')
		// this.createNewGame()
	}

	update() {}

	// private createNewGame() {
		
	// 	this.scene.launch('game')
	// }
}