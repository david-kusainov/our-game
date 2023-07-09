// import Phaser from 'phaser'

// import { UpperWorld, AfterWorld } from './scenes'

// const config: Phaser.Types.Core.GameConfig = {
// 	type: Phaser.AUTO,
// 	parent: 'phaser-container',
// 	backgroundColor: '#282c34',
// 	scale: {
// 		mode: Phaser.Scale.ScaleModes.RESIZE,
// 		width: window.innerWidth/2,
// 		height: window.innerHeight,
// 	},
// 	physics: {
// 		default: 'arcade',
// 		arcade: {
// 			gravity: { y: 0 },
// 			debug: true,
// 		},
// 	},
// 	scene: [UpperWorld, AfterWorld],
// }
// // eslint-disable-next-line import/no-anonymous-default-export
// export default new Phaser.Game(config)

import Phaser from 'phaser'
import { UpperWorld } from './scenes'
import { AfterWorld } from './scenes'

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
			gravity: { y: 1000 },
			debug: true,
		},
	},
	scene: [UpperWorld],
	plugins: {
		scene: [
		  { key: 'InputPlugin', plugin: Phaser.Input.InputPlugin, mapping: 'input' }
		]
	  },
	callbacks: {
        postBoot: (game) => {
            game.canvas.style.width = '100%';
            game.canvas.style.height = `${window.innerHeight / 2}px`;
        },
    },
}

const afterWorldConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#282c34',
	scale: {
		mode: Phaser.Scale.ScaleModes.RESIZE,
		width: window.innerWidth,
		height: window.innerHeight / 2,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true,
		},
	},
	scene: [AfterWorld],
	callbacks: {
        postBoot: (game) => {
            game.canvas.style.width = '100%';
            game.canvas.style.height = `${window.innerHeight / 2}px`;
        },
    },
}

new Phaser.Game(upperWorldConfig)
new Phaser.Game(afterWorldConfig)