import Phaser from "phaser";
import { diceArrays } from "./diceData";
import { loadDiceImages, spawnDiceOnSlot } from "./diceFunctions";

const selectedSprite: Phaser.GameObjects.Sprite | null = null;

export default class AncientDices extends Phaser.Scene {
  preload() {
    for (const diceName in diceArrays) {
      loadDiceImages(this, diceName, diceArrays[diceName]);
    }

    //RobotArm Interactives
    this.load.image("roll", "src/assets/RoboticArm/Roll.png");
    this.load.image("roboticArm", "src/assets/RoboticArm/RoboticArm.png");
    this.load.image("slot", "src/assets/RoboticArm/Slot.png");
  }

  create() {
    this.add.image(230, 500, "roboticArm");
    this.add.image(570, 100, "roboticArm");

    const firstSlots: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(100 + i * 50, 500, "slot");
      firstSlots.push(slot);
    }

    const secondSlots: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(700 + i * -50, 100, "slot");
      secondSlots.push(slot);
    }

    //Button onclick spawn a SideDice on Robotic arm
    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    rollButton.on("pointerdown", () => {
      let slotIndex = 0;
      for (const diceName in diceArrays) {
        const diceArray = diceArrays[diceName];
        const randomDiceSide = Phaser.Math.RND.pick(diceArray);
        const slot = firstSlots[slotIndex];

        if (slot) {
          spawnDiceOnSlot(this, slot.x, slot.y, randomDiceSide, selectedSprite);
        }
        slotIndex++;
      }
    });
  }
}
