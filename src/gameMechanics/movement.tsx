import Phaser from 'phaser'

export class PlayerController {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private isJumping: boolean = false

  constructor(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Sprite, input: any) {
    this.player = player
    this.cursors = input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.SPACE,
    })
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300)
    } else {
      this.player.setVelocityX(0)
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body
    if (this.cursors.up.isDown && playerBody.onFloor()) {
      if (!this.isJumping) {
        this.isJumping = true
        this.player.setVelocityY(-700)
      }
    } else if (!this.cursors.up.isDown && playerBody.onFloor()) {
      this.isJumping = false
    }
  }
}
