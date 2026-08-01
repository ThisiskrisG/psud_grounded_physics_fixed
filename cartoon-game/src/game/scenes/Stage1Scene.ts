import Phaser from 'phaser'

export default class Stage1 extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private animals!: Phaser.Physics.Arcade.Group
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private lives: number = 3
  private hearts: Phaser.GameObjects.Image[] = []
  private isGameOver: boolean = false
  private isInvulnerable: boolean = false
  private maxLives: number = 3
  private HEART_SCALE: number = 0.7
  private HEART_SPACING: number = 44
  private HEART_Y: number = 40

  constructor() { super({ key: 'Stage1' }) }

  create() {
    this.isGameOver = false
    this.isInvulnerable = false
    this.score = 0
    this.lives = this.maxLives

    this.add.text(10, 10, 'Stage 1 - Street Chase', { font: '20px Arial', fill: '#000' })

    this.player = this.physics.add.sprite(400, 520, 'car')
    this.player.setCollideWorldBounds(true)
    this.player.setScale(0.6)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.animals = this.physics.add.group()

    this.scoreText = this.add.text(600, 10, `Score: ${this.score}`, { font: '20px Arial', fill: '#000' })

    // create heart icons for lives (top-right, below score)
    this.createHearts()

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

  private createHearts() {
    // remove existing hearts and stop any heartbeat tweens
    this.hearts.forEach(h => {
      const tw = h.getData('heartbeatTween') as Phaser.Tweens.Tween | undefined
      if (tw) tw.stop()
      h.destroy()
    })
    this.hearts = []

    const spacing = this.HEART_SPACING
    const totalWidth = this.maxLives * spacing
    const startX = this.scale.width - totalWidth - 10
    const y = this.HEART_Y

    for (let i = 0; i < this.maxLives; i++) {
      const x = startX + i * spacing
      const heart = this.add.image(x, y, 'heart').setOrigin(0, 0)
      heart.setScale(this.HEART_SCALE)

      // subtle heartbeat idle animation
      const beatTween = this.tweens.add({
        targets: heart,
        scale: { from: this.HEART_SCALE * 0.95, to: this.HEART_SCALE * 1.06 },
        duration: 900,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: i * 120
      })
      heart.setData('heartbeatTween', beatTween)

      this.hearts.push(heart)
    }
  }

  private updateHeartPositions() {
    const spacing = this.HEART_SPACING
    const totalWidth = this.hearts.length * spacing
    const startX = this.scale.width - totalWidth - 10
    const y = this.HEART_Y

    this.hearts.forEach((heart, i) => {
      const targetX = startX + i * spacing
      this.tweens.add({
        targets: heart,
        x: targetX,
        y: y,
        duration: 250,
        ease: 'Cubic.easeOut'
      })
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
    if (this.isGameOver || this.isInvulnerable) return

    const animal = animalObj as Phaser.Physics.Arcade.Sprite
    const player = playerObj as Phaser.Physics.Arcade.Sprite

    // decrement life
    this.lives -= 1

    // animate and remove the heart for the lost life
    const lostHeartIndex = this.lives // after decrement, this index corresponds to the lost heart
    const lostHeart = this.hearts[lostHeartIndex]
    if (lostHeart) {
      // stop idle tween first
      const hb = lostHeart.getData('heartbeatTween') as Phaser.Tweens.Tween | undefined
      if (hb) hb.stop()

      this.tweens.add({
        targets: lostHeart,
        scale: { from: lostHeart.scale, to: lostHeart.scale * 1.6 },
        alpha: { from: 1, to: 0 },
        duration: 350,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          if (lostHeart) {
            // destroy and remove
            lostHeart.destroy()
            this.hearts.splice(lostHeartIndex, 1)
            // reposition remaining hearts to stay right-aligned
            this.updateHeartPositions()
          }
        }
      })
    }

    // simple feedback
    this.cameras.main.shake(300, 0.02)
    player.setTint(0xff0000)

    // destroy the animal that hit
    animal.destroy()

    if (this.lives <= 0) {
      // game over
      this.isGameOver = true
      player.setVelocity(0)
      this.physics.world.disable(player)

      const goText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, 'GAME OVER', { font: '48px Arial', fill: '#ff0000' }).setOrigin(0.5)
      const finalText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 30, `Score: ${this.score}`, { font: '24px Arial', fill: '#000' }).setOrigin(0.5)

      // restart the scene after short delay
      this.time.delayedCall(2000, () => {
        goText.destroy()
        finalText.destroy()
        this.scene.restart()
      })

      return
    }

    // if still has lives, respawn player after a shorter delay with invulnerability
    this.isInvulnerable = true
    player.setVelocity(0)
    this.physics.world.disable(player)

    // Faster respawn: 300ms delay, 800ms invulnerability
    const RESPAWN_DELAY = 300
    const INVUL_DURATION = 800
    const FLASH_DURATION = 200
    const FLASH_REPEAT = Math.max(0, Math.floor(INVUL_DURATION / FLASH_DURATION) - 1)

    this.time.delayedCall(RESPAWN_DELAY, () => {
      // move player to center-bottom and re-enable physics
      player.enableBody(true, this.scale.width / 2, 520, true, true)
      player.clearTint()
      this.physics.world.enable(player)
      player.setCollideWorldBounds(true)
      player.setScale(0.6)

      // flash effect during invulnerability
      this.tweens.add({
        targets: player,
        alpha: { from: 0.3, to: 1 },
        ease: 'Linear',
        duration: FLASH_DURATION,
        repeat: FLASH_REPEAT
      })

      // end invulnerability after INVUL_DURATION
      this.time.delayedCall(INVUL_DURATION, () => {
        this.isInvulnerable = false
        player.setAlpha(1)
      })
    })
  }

  private incrementScore(amount: number) {
    this.score += amount
    if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`)
  }
}
