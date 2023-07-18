import Phaser from 'phaser';
import { PlayerController } from '../gameMechanics/movement';
import { DaggerController } from '../gameMechanics/attacksController';
import { EnemyLogic } from '../gameMechanics/enemyLogic';
import { CharacterController } from '../gameMechanics/hitPoint';

export class UpperWorld extends Phaser.Scene {
  private playerController?: PlayerController;
  private daggerController?: DaggerController;
  private player!: Phaser.Physics.Arcade.Sprite;
  private groundGroup!: Phaser.Physics.Arcade.StaticGroup;
  private blockGroup!: Phaser.Physics.Arcade.StaticGroup;
  private ghostGroup?: Phaser.Physics.Arcade.Group;
  private harpyGroup?: Phaser.Physics.Arcade.Group;
  private vikingGroup?: Phaser.Physics.Arcade.Group;
  private bossGroup?: Phaser.Physics.Arcade.Group;
  private enemyLogic?: EnemyLogic;
  private characterController: CharacterController;
  private healthText?: Phaser.GameObjects.Text;
  private harpyBulletPath!: string;
  private bossBulletPath!: string;
  

  constructor() {
    super('upperworld');
    this.characterController = new CharacterController(this);
  }

  preload() {
    this.load.image('background-castle', './assets/castle2.png');
    this.load.image('background-forest', './assets/forest.png');
    this.load.image('background-podval', './assets/podval.png');
    this.load.image('background-kirpich', './assets/background-kirpich.png')

    this.load.image('block-blue', './assets/block-blue.png');
    this.load.image('block-kirpich', './assets/block-kirpich.png');

    this.load.image('ground', './assets/ground.png');
    this.load.image('ground-blue', './assets/ground-blue.png');
    
    this.load.spritesheet('man', 'assets/man-sheet.png', {
      frameWidth: 260,
      frameHeight: 320
      });

    this.load.spritesheet('harpy', 'assets/harpy-sheet.png', {
      frameWidth: 500,
      frameHeight: 310
      });

    this.load.image('dagger', './assets/dagger.png');

    // this.load.image('viking', './assets/viking.png');
    this.load.spritesheet('viking', 'assets/viking-sheet.png', {
      frameWidth: 400,
      frameHeight: 300
      });

    this.load.spritesheet('ghost', 'assets/ghost-sheet.png', {
      frameWidth: 350,
      frameHeight: 390
      });

    this.load.spritesheet('boss', 'assets/boss-sheet.png', {
      frameWidth: 1000,
      frameHeight: 770
      });

    this.harpyBulletPath = './assets/dagger-pero.png';
    this.load.image('harpyBullet', this.harpyBulletPath); // Снаряд для гарпии

    this.bossBulletPath = './assets/dagger-boss.png';
    this.load.image('bossBullet',  this.bossBulletPath); // Снаряд для босса
  }

  create(input: any) {
  
    // Камера
    const worldWidth = 10400; // Ширина сцены
    const worldHeight = 600; // Высота сцены
    this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    
    // Задний фон
    this.add.image(594, 320, 'background-castle');
    this.add.image(1781, 320, 'background-forest');
    this.add.image(2968, 320, 'background-forest');
    this.add.image(4155, 320, 'background-forest');
    this.add.image(5342, 320, 'background-podval');
    this.add.image(6529, 320, 'background-podval');
    this.add.image(7716, 320, 'background-podval');
    this.add.image(8903, 320, 'background-podval');
    this.add.image(10090, 320, 'background-kirpich');



    // Отображение жизней
    this.healthText = this.add.text(10, 10, '', { font: '20px', color: 'red' });
    this.healthText.setScrollFactor(0);
    this.updateHealthText();


    // Земля
    this.groundGroup = this.physics.add.staticGroup();
    const ground1 = this.groundGroup.create(300, 700, 'ground-blue');
    const ground2 = this.groundGroup.create(2220, 700, 'ground-blue');
    const ground3 = this.groundGroup.create(4140, 700, 'ground-blue');
    const ground4 = this.groundGroup.create(5710, 700, 'ground');
    const ground5 = this.groundGroup.create(7600, 700, 'ground');
    const ground6 = this.groundGroup.create(9490, 700, 'ground');


    // Блоки
    this.blockGroup = this.physics.add.staticGroup();

    const block1 = this.groundGroup.create(900, 530, 'block-blue');
    const block2 = this.groundGroup.create(1100, 400, 'block-blue');
    const block3 = this.groundGroup.create(1300, 540, 'block-blue');

    const block4 = this.groundGroup.create(2100, 490, 'block-blue');
    const block5 = this.groundGroup.create(2400, 540, 'block-blue');

    const block6 = this.groundGroup.create(2800, 470, 'block-blue');

    const block7 = this.groundGroup.create(4220, 500, 'block-blue');
    const block8 = this.groundGroup.create(4370, 400, 'block-blue');
    const block9 = this.groundGroup.create(4520, 300, 'block-blue');
    const block10 = this.groundGroup.create(4670, 200, 'block-blue');

    const block11 = this.groundGroup.create(4820, 200, 'block-kirpich');
    const block12 = this.groundGroup.create(4970, 300, 'block-kirpich');
    const block13 = this.groundGroup.create(5120, 400, 'block-kirpich');
    const block14 = this.groundGroup.create(5270, 500, 'block-kirpich');

    const block15 = this.groundGroup.create(6750, 480, 'block-kirpich');

    const block16 = this.groundGroup.create(7000, 530, 'block-kirpich');
    const block17 = this.groundGroup.create(7200, 400, 'block-kirpich');
    const block18 = this.groundGroup.create(7400, 540, 'block-kirpich');


    // Персонаж
    this.player = this.physics.add.sprite(300, 300, 'man');
    this.player.setScale(0.4);
    this.physics.add.collider(this.player, this.groundGroup);
    this.cameras.main.startFollow(this.player);

    this.anims.create({
      key: 'movement',
      frameRate: 2,
      frames: this.anims.generateFrameNumbers('man', {start: 0, end:10}),
      repeat: -1
      });

    this.player.play('movement');


    // Босс
    this.bossGroup = this.physics.add.group();
    const boss1 = this.bossGroup.create(9000, 300, 'boss')
    this.bossGroup.getChildren().forEach((boss: Phaser.GameObjects.GameObject) => {
      const bossSprite = boss as Phaser.Physics.Arcade.Sprite;
      bossSprite.setScale(0.4); // Размеры
    });

    this.physics.add.collider(this.bossGroup, this.groundGroup);


    // Призрак
    this.ghostGroup = this.physics.add.group();
    const ghost1 = this.ghostGroup.create(6650, 300, 'ghost');

    this.ghostGroup.getChildren().forEach((ghost: Phaser.GameObjects.GameObject) => {
      const ghostSprite = ghost as Phaser.Physics.Arcade.Sprite;
      ghostSprite.setScale(0.5);  // Размеры
    });

    this.physics.add.collider(this.ghostGroup, this.groundGroup);


    // Гарпии
    this.harpyGroup = this.physics.add.group();
    const harpy1 = this.harpyGroup.create(2000, 500, 'harpy');

    this.harpyGroup.getChildren().forEach((harpy: Phaser.GameObjects.GameObject) => {
      const harpySprite = harpy as Phaser.Physics.Arcade.Sprite;
      harpySprite.setScale(0.5);  // Размеры
    });

    this.physics.add.collider(this.harpyGroup, this.groundGroup);

    // this.anims.create({
    //   key: 'harpyAnim',
    //   frameRate: 2,
    //   frames: this.anims.generateFrameNumbers('harpy', {start: 0, end:2}),
    //   repeat: -1
    //   });

      // this.harpyGroup.children.iterate((harpy: Phaser.GameObjects.GameObject) => {
      //   const harpySprite = harpy as Phaser.GameObjects.Sprite;
      //   harpySprite.play('harpyAnim');
      // }); 


    // Викинги
    this.vikingGroup = this.physics.add.group();
    const viking1 = this.vikingGroup.create(3650, 300, 'viking');

    this.vikingGroup.getChildren().forEach((viking: Phaser.GameObjects.GameObject) => {
      const vikingSprite = viking as Phaser.Physics.Arcade.Sprite;
      vikingSprite.setScale(0.6);  // Размеры
    });
  
    this.physics.add.collider(this.vikingGroup, this.groundGroup);

    // Инициализация логики врагов
    this.enemyLogic = new EnemyLogic(this, this.player, this.groundGroup, this.physics, this.harpyBulletPath, this.bossBulletPath);
    this.enemyLogic.setGroups(this.ghostGroup, this.harpyGroup, this.vikingGroup, this.bossGroup);

    // Контроллер персонажа
    const inputPlugin = this.input;
    if (inputPlugin && inputPlugin.keyboard) {
      this.playerController = new PlayerController(this, this.player, inputPlugin);
    }

    // Контроллер кинжала
    this.daggerController = new DaggerController(this.player, this, this.ghostGroup, this.harpyGroup, this.vikingGroup, this.bossGroup);
    this.daggerController.create();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.daggerController) {
        this.daggerController.throwDagger(pointer);
      }
    });
  }

  update() {
    this.updateHealthText();

    if (this.playerController) {
      this.playerController.update();
    }

    if (this.daggerController) {
      this.daggerController.update();

    }

    if (this.enemyLogic) {
      this.enemyLogic.update();
    }
  }

 updateHealthText(): void {
    if (this.healthText) {
      this.healthText.setText(`Здоровье: ${this.characterController.getHealth()}`);
    }
  }
}
