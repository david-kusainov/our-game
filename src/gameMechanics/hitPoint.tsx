export class CharacterController {
  private health: number = 1000; // Начальное значение здоровья
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  takeDamage(amount: number): void {
    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;  
      this.reloadLevel();
    }
  }

  getHealth(): number {
    console.log(this.health)
    return this.health;
  }

  reloadLevel(): void {
    this.scene.scene.restart();
  }
}
