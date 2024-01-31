import Phaser from "phaser";
import { diceArrays, DiceArrayItem } from "./diceData";

export class AIManager {
  private scene: Phaser.Scene;
  private aiRobotArmSlots: Phaser.GameObjects.Image[];
  private allAIDicesArray: Phaser.GameObjects.Sprite[];
  private allAIDicesArrayVerification: boolean[] = [];

  constructor(scene: Phaser.Scene, aiRobotArmSlots: Phaser.GameObjects.Image[], allAIDicesArray: Phaser.GameObjects.Sprite[]) {
    this.scene = scene;
    this.aiRobotArmSlots = aiRobotArmSlots;
    this.allAIDicesArray = allAIDicesArray;
    this.allAIDicesArrayVerification = new Array(6).fill(false)
  }

  aiRollDiceExample(turnCounter: number) {
    let slotIndex = 0;
    for (const diceName in diceArrays) {
      const diceArray = diceArrays[diceName];

      if (turnCounter === 2 || turnCounter === 3) {
        const isSelected = this.allAIDicesArrayVerification[slotIndex]
        if (isSelected === false) {
          const randomDiceSide = Phaser.Math.RND.pick(diceArray)

          const spawnX = 520 + slotIndex * 72;
          const spawnY = 100;

          const resultDice = this.aiSpawnDiceOnSlot(spawnX, spawnY, randomDiceSide);
          resultDice.setScale(0.4)
          this.allAIDicesArray.push(resultDice);
          console.log('allAIdices array turno 2:', this.allAIDicesArray)
        }
      }

      if (turnCounter === 1) {
        const meleeDice = diceArray.find((dice) => dice.name.includes("DefMelee"));

        const spawnX = 520 + slotIndex * 72;
        const spawnY = 100;

        const resultDice = this.aiSpawnDiceOnSlot(spawnX, spawnY, meleeDice);
        resultDice.setScale(0.4)
        this.allAIDicesArray.push(resultDice);
        this.allAIDicesArrayVerification.push(resultDice)
      }
      slotIndex++;
    }
  }

  aiSpawnDiceOnSlot(x: number, y: number, diceSide: DiceArrayItem): Phaser.GameObjects.Sprite {
    const diceKey = `${diceSide.name.replace(/\.png/g, '')}`;
    const diceSprite = this.scene.add.sprite(x, y, diceKey);
    return diceSprite;
  }

  moveAiDicesToBattlefield(aiBattlefieldSlots: Phaser.GameObjects.Rectangle[], aiBattlefieldDice: { sprite: Phaser.GameObjects.Sprite }[], turnCounter: number) {
    if (turnCounter === 1) {
      const selectedDices = this.allAIDicesArray.slice(0, 2);
      this.allAIDicesArray.splice(0, 2);

      selectedDices.forEach((dice, index) => {
        const slot = aiBattlefieldSlots[index];

        if (dice && slot) {
          this.putAiDiceOnBattlefield(dice, slot.x, slot.y, aiBattlefieldDice);
        }

        const nextSlotIndex = index;
        this.allAIDicesArrayVerification[nextSlotIndex] = true;
      });

    } else if (turnCounter === 2) {
      const selectedDices = this.allAIDicesArray.slice(2, 4);
      console.log("Antes de remover:", this.allAIDicesArray);
      this.allAIDicesArray.splice(2, 2);
      console.log("Depois de remover:", this.allAIDicesArray);
      selectedDices.forEach((dice, index) => {
        console.log("Colocando dado no campo:", dice);
        const slot = aiBattlefieldSlots[index];

        if (dice && slot) {
          this.putAiDiceOnBattlefield(dice, slot.x, slot.y, aiBattlefieldDice);
          this.allAIDicesArrayVerification[index + 2] = true;
        }
      });
    }
  }

  putAiDiceOnBattlefield(diceSprite: Phaser.GameObjects.Sprite, slotX: number, slotY: number, aiBattlefieldDice: { sprite: Phaser.GameObjects.Sprite }[]) {
    diceSprite.x = slotX;
    diceSprite.y = slotY;

    const diceName = diceSprite.key;
    aiBattlefieldDice.push({ sprite: diceSprite, name: diceName });
  }
}
