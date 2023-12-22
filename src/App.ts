import Phaser from "phaser";

const dice1Array = ["Melee.png", "DefMelee.png", "Ranged.png"];

export default class AncientDices extends Phaser.Scene {
  preload() {
    //Dice 1
    dice1Array.forEach((dice1) => {
      this.load.image(dice1, `src/assets/SideDices/${dice1}`);
    });

    //RobotArm Interactives
    this.load.image("roll", "src/assets/RoboticArm/Roll.png");
    this.load.image("roboticArm", "src/assets/RoboticArm/RoboticArm.png");
    this.load.image("slot", "src/assets/RoboticArm/Slot.png");
  }

  create() {
    this.add.image(230, 500, "roboticArm");
    this.add.image(100, 500, "slot");

    //Button onclick spawn a SideDice on Robotic arm

    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    let diceSide1DragDrop;
    let selectedDice = null;

    rollButton.on("pointerdown", () => {
      const randomDiceSide1 = Phaser.Math.RND.pick(dice1Array);
      const diceSide1 = this.add.sprite(100, 500, randomDiceSide1);
      //Drag and Drop DiceSide
      diceSide1DragDrop = diceSide1.setInteractive({ draggable: true });

      diceSide1DragDrop.on("pointerdown", () => {
        selectedDice = diceSide1DragDrop;
      });

      diceSide1DragDrop.on("pointerup", () => {
        selectedDice = null;
      });

      diceSide1DragDrop.on("drag", (pointer) => {
        if (selectedDice) {
          selectedDice.x = pointer.x;
          selectedDice.y = pointer.y;
        }
      });
    });
  }

  update() {}
}
