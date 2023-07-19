import * as Phaser from 'phaser';

export class HomeScreen extends Phaser.Scene {
  constructor() {
    super('HomeScreen');
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

    // Создание кнопки "играть"
    const playButton = this.add.text(width / 2, height / 2, 'Играть', {
      font: '32px Arial',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    playButton.setInteractive({ useHandCursor: true });
    playButton.on('pointerdown', () => {
      this.scene.start('DownloadProgress');
    });
  }
}