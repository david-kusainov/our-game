import Phaser from 'phaser'
import { UpperWorld } from './scenes'

const upperWorldConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#282c34',
	scale: {
		mode: Phaser.Scale.ScaleModes.RESIZE,
		width: window.innerWidth,
		height: window.innerHeight ,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		},
	},
	scene: [UpperWorld],
	plugins: {
		scene: [
		  { key: 'InputPlugin', plugin: Phaser.Input.InputPlugin, mapping: 'input' }
		]
	  }
}
new Phaser.Game(upperWorldConfig)