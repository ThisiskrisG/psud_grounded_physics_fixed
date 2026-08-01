import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }) }

  preload() {
    this.load.image('car', 'assets/player-car.svg')
    this.load.image('robot', 'assets/robot.svg')
    this.load.image('dog', 'assets/dog.svg')
    this.load.image('cat', 'assets/cat.svg')
    this.load.image('flybot', 'assets/flying-robot.svg')
    this.load.image('heart', 'assets/heart.svg')
  }

  create() {
    this.scene.start('Stage1')
  }
}
