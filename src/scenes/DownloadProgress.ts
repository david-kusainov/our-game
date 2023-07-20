import * as Phaser from 'phaser';

export class DownloadProgress extends Phaser.Scene {
  load: any;
  cameras: any;
  add: any;
  time: any;
  scene: any;
  constructor() {
    super('DownloadProgress');
  }

  preload() {
    this.load.image('logo', 'assets/logo.png');
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.add.text(width / 2, height / 2, 'Загрузка...', { font: '20px Arial', fill: '#ffffff' });
    loadingText.setOrigin(0.5, 0.5);
    
    // Создание прогресс-бара
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    this.time.delayedCall(1000, () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();

      this.scene.start('UpperWorld');
    }, [], this);
  }
}
