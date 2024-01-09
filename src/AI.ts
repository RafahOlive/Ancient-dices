import Phaser from "phaser";
import { diceArrays, DiceArrayItem } from "./diceData";

export default class AiDiceManager {
  private scene: Phaser.Scene;
  private aiRobotArmSlots: Phaser.GameObjects.Image[];
  private allAIDicesArray: Phaser.GameObjects.Sprite[];

  constructor(scene: Phaser.Scene, aiRobotArmSlots: Phaser.GameObjects.Image[]) {
    this.scene = scene;
    this.aiRobotArmSlots = aiRobotArmSlots;
  }

  aiRollDiceExample() {
    let slotIndex = 0;
    for (const diceName in diceArrays) {
      const diceArray = diceArrays[diceName];
      const meleeDice = diceArray.find((dice) => dice.name.includes("Melee"));
      const slot = this.aiRobotArmSlots[slotIndex];
        if (slot) {
          const resultDice = this.spawnDiceOnSlot(slot.x, slot.y, meleeDice, diceName);
          this.allAIDicesArray.push(resultDice)
        }
        slotIndex++;
      }
    }

  private spawnDiceOnSlot(x: number, y: number, diceSide: DiceArrayItem, diceName: string) {
    const diceKey = `${diceName}_${diceSide.name}`;
    const diceSprite = this.scene.add.sprite(x, y, diceKey)
  }
}
