import * as Phaser from 'phaser';
import { UpperWorld } from './UpperWorld';

export class PreloadScene extends Phaser.Scene {
  load: any;
  cameras: any;
  add: any;
  time: any;
  scene: any;
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Загрузка ресурсов, таких как изображения, звуки и т.д.
    // Например:
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('music', 'assets/music.mp3');
    // Добавьте свои собственные ресурсы для загрузки

    // Создание текста загрузки
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.add.text(width / 2, height / 2, 'Загрузка...', { font: '20px Arial', fill: '#ffffff' });
    loadingText.setOrigin(0.5, 0.5);

    // Создание прогресс-бара
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    // Таймер для загрузочного экрана длительностью 5 секунд
    this.time.delayedCall(5000, () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();

      // Переход к следующей сцене
      this.scene.start('UpperWorld');
    }, [], this);
  }
}

// Инициализация Phaser и создание игры
const config: Phaser.Types.Core.GameConfig = {
  // Укажите нужные параметры конфигурации игры
};

const game = new Phaser.Game(config);

// Добавьте вашу основную сцену (MainScene) и сцену загрузки (PreloadScene)
game.scene.add('UpperWorld', UpperWorld);
game.scene.add('PreloadScene', PreloadScene);

// Запуск сцены загрузки
game.scene.start('PreloadScene');
