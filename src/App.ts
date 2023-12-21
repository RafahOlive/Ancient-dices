import Phaser from "phaser";

export default class AncientDices extends Phaser.Scene {
  preload() {
    this.load.image("melee", "src/assets/SideDices/Melee.png");
    this.load.image("Defmelee", "src/assets/SideDices/DefMelee.png");
    this.load.image("ranged", "src/assets/SideDices/ranged.png");
    this.load.image("Defranged", "src/assets/SideDices/DefMelee.png");
    this.load.image("thief", "src/assets/SideDices/Thief.png");
    this.load.image("roll", "src/assets/RoboticArm/Roll.png");
    this.load.image("roboticArm", "src/assets/RoboticArm/RoboticArm.png");
    this.load.image("slot", "src/assets/RoboticArm/Slot.png");
  }

  create() {
    this.add.image(230, 500, "roboticArm");
    this.add.image(100, 500, "slot");
    // this.add.image(100, 500, "melee");

    class FirstSlot extends Phaser.GameObjects.Image {
      constructor(scene) {
        super(scene, 0, 0, "melee");
      }

      Place() {
        this.setActive(true);
        this.setVisible(true);
      }
    }

    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    rollButton.on("pointerdown", () => {
      console.log("Sim");
      FirstSlot;
    });
  }

  update() {}
}
