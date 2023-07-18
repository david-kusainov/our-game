import * as Phaser from 'phaser';
import { PreloadScene } from './PreloadScene';

class IntermediateScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntermediateScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Установка изображения в качестве заднего фона
    const backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0);
    backgroundImage.setScale(width / backgroundImage.width, height / backgroundImage.height);

    // Создание кнопки "играть"
    const playButton = this.add.text(width / 2, height / 2, 'Играть', {
      font: '32px Arial',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // Добавление интерактивности к кнопке
    playButton.setInteractive({ useHandCursor: true });
    playButton.on('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }
}

// Инициализация Phaser и создание игры
const config: Phaser.Types.Core.GameConfig = {
  // Укажите нужные параметры конфигурации игры
};

const game = new Phaser.Game(config);

// Добавьте промежуточную сцену (IntermediateScene) и основную сцену (MainScene)
game.scene.add('IntermediateScene', IntermediateScene);
game.scene.add('PreloadScene', PreloadScene, true); // Добавлен параметр 'true' для автоматического запуска сцены

// Загрузка изображения заднего фона
game.scene.start('IntermediateScene', { background: 'assets/background.png' });
