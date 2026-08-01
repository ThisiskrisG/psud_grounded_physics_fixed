import Phaser from 'phaser'

export default class Stage1 extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private animals!: Phaser.Physics.Arcade.Group
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private isGameOver: boolean = false

  constructor() { super({ key: 'Stage1' }) }

  create() {
    this.isGameOver = false
    this.score = 0

    this.add.text(10, 10, 'Stage 1 - Street Chase', { font: '20px Arial', fill: '#000' })

    this.player = this.physics.add.sprite(400, 520, 'car')
    this.player.setCollideWorldBounds(true)
    this.player.setScale(0.6)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.animals = this.physics.add.group()

    this.scoreText = this.add.text(600, 10, `Score: ${this.score}`, { font: '20px Arial', fill: '#000' })

    this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => this.spawnAnimal()
    })

    this.physics.add.overlap(this.player, this.animals, (p, a) => this.handlePlayerHit(p as Phaser.GameObjects.GameObject, a as Phaser.GameObjects.GameObject))

    // for prototype convenience: restart to Stage2 after 30s if not game over
    this.time.delayedCall(30000, () => { if (!this.isGameOver) this.scene.start('Stage2') })
  }

  update() {
    if (this.isGameOver) return

    const speed = 300
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed)
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed)
    } else {
      this.player.setVelocityX(0)
    }

    // Check animals that passed the bottom (dodged)
    this.animals.getChildren().forEach((child) => {
      const a = child as Phaser.Physics.Arcade.Sprite
      if (!a.getData('counted') && a.y > this.scale.height + 20) {
        a.setData('counted', true)
        a.destroy()
        this.incrementScore(10)
      }
    })
  }

  private spawnAnimal() {
    const x = Phaser.Math.Between(50, 750)
    const type = Phaser.Math.Between(0, 1) === 0 ? 'dog' : 'cat'
    const y = -50
    const s = this.animals.create(x, y, type) as Phaser.Physics.Arcade.Sprite
    s.setVelocityY(Phaser.Math.Between(120, 220))
    s.setScale(0.4)
    s.setInteractive()
    s.setCollideWorldBounds(false)
    s.body.checkCollision.up = false
    s.setData('counted', false)
  }

  private handlePlayerHit(playerObj: Phaser.GameObjects.GameObject, animalObj: Phaser.GameObjects.GameObject) {
    if (this.isGameOver) return
    this.isGameOver = true

    const animal = animalObj as Phaser.Physics.Arcade.Sprite
    const player = playerObj as Phaser.Physics.Arcade.Sprite

    // simple feedback
    this.cameras.main.shake(300, 0.02)
    player.setTint(0xff0000)

    // disable physics interactions
    player.setVelocity(0)
    this.physics.world.disable(player)

    // destroy the animal that hit (optional)
    animal.destroy()

    // show game over and final score
    const goText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, 'GAME OVER', { font: '48px Arial', fill: '#ff0000' }).setOrigin(0.5)
    const finalText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 30, `Score: ${this.score}`, { font: '24px Arial', fill: '#000' }).setOrigin(0.5)

    // restart the scene after short delay
    this.time.delayedCall(2000, () => {
      goText.destroy()
      finalText.destroy()
      this.scene.restart()
    })
  }

  private incrementScore(amount: number) {
    this.score += amount
    if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`)
  }
}
