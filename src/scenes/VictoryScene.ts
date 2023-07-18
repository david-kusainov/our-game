import * as Phaser from 'phaser';
import { UpperWorld } from './UpperWorld';

class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Установка изображения в качестве заднего фона
    const backgroundImage = this.add.image(0, 0, 'background');
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
      this.scene.start('MainScene');
    });
  }
}

// Инициализация Phaser и создание игры
const config: Phaser.Types.Core.GameConfig = {
  // Укажите нужные параметры конфигурации игры
};

const game = new Phaser.Game(config);

// Добавьте сцену победы (VictoryScene) и основную сцену (MainScene)
game.scene.add('VictoryScene', VictoryScene);
game.scene.add('UpperWorld', UpperWorld);

// Загрузка изображения заднего фона
game.scene.start('VictoryScene', { background: 'assets/background.png' });
