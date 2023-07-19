import * as Phaser from 'phaser';
import { UpperWorld } from './UpperWorld';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  preload(){
    this.load.image('background-sea', './assets/sea1187.png');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const backgroundImage = this.add.image(0, 0, 'background-sea');
    backgroundImage.setOrigin(0);
    backgroundImage.setScale(width / backgroundImage.width, height / backgroundImage.height);

    // Создание текста победы
    const victoryText = this.add.text(width / 2, height / 2, 'Поздравляем, вы победили!', {
      font: '32px Arial',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // Создание кнопки "Начать заново"
    const restartButton = this.add.text(width / 2, height / 2 + 100, 'Начать заново', {
      font: '24px Arial',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    // Добавление интерактивности к кнопке
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerdown', () => {
      this.scene.start('UpperWorld');
    });
  }
}
