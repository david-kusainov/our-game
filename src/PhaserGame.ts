import Phaser from 'phaser';
import { UpperWorld, DownloadProgress, VictoryScene, HomeScreen } from './scenes';

const upperWorldConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#10152e',
	scale: {
		mode: Phaser.Scale.ScaleModes.RESIZE,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true,
    },
  },
//   scene: [HomeScreen, DownloadProgress, UpperWorld, VictoryScene],
	scene: [UpperWorld],
	plugins: {
		scene: [{ key: 'InputPlugin', plugin: Phaser.Input.InputPlugin, mapping: 'input' }],
	},
};

const game = new Phaser.Game(upperWorldConfig);
