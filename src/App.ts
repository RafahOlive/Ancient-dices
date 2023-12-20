import Phaser from "phaser";

export default class AncientDices extends Phaser.Scene {
  preload() {
    this.load.image("melee", "src/assets/Melee.png");
    this.load.image("Defmelee", "src/assets/DefMelee.png");
    this.load.image("ranged", "src/assets/Ranged.png");
    this.load.image("Defranged", "src/assets/DefMelee.png");
    this.load.image("thief", "src/assets/Thief.png");
  }

  create() {
    this.add.image(400, 500, "melee");
  }

  update() {}
}
