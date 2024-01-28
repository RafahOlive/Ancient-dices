import Phaser from "phaser";
import { diceArrays, DiceArrayItem } from "./diceData";

export class AIManager {
  private scene: Phaser.Scene;
  private aiRobotArmSlots: Phaser.GameObjects.Image[];
  private allAIDicesArray: Phaser.GameObjects.Sprite[];

  constructor(scene: Phaser.Scene, aiRobotArmSlots: Phaser.GameObjects.Image[], allAIDicesArray: Phaser.GameObjects.Sprite[]) {
    this.scene = scene;
    this.aiRobotArmSlots = aiRobotArmSlots;
    this.allAIDicesArray = allAIDicesArray;
  }

  aiRollDice() {
    let slotIndex = 0;
    for (const diceName in diceArrays) {
      const diceArray = diceArrays[diceName];
      const randomDiceSide = Phaser.Math.RND.pick(diceArray);
      const slot = this.aiRobotArmSlots[slotIndex];
      if (slot) {
        this.spawnDiceOnSlot(slot.x, slot.y, randomDiceSide, diceName);
      }
      slotIndex++;
    }
  }

  aiRollDiceExample() {
    let slotIndex = 0;
    for (const diceName in diceArrays) {
      const diceArray = diceArrays[diceName];
      const meleeDice = diceArray.find((dice) => dice.name.includes("DefRanged"));

      const spawnX = 520 + slotIndex * 72;
      const spawnY = 100;

      const resultDice = this.aiSpawnDiceOnSlot(spawnX, spawnY, meleeDice);
      resultDice.setScale(0.4)
      this.allAIDicesArray.push(resultDice);

      slotIndex++;
      console.log("dados do inimigo:", this.allAIDicesArray);
    }
  }

  aiSpawnDiceOnSlot(x: number, y: number, diceSide: DiceArrayItem): Phaser.GameObjects.Sprite {
    const diceKey = `${diceSide.name.replace(/\.png/g, '')}`;
    const diceSprite = this.scene.add.sprite(x, y, diceKey);
    return diceSprite;
  }

  moveAiDicesToBattlefield(aiBattlefieldSlots: Phaser.GameObjects.Rectangle[], aiBattlefieldDice: { sprite: Phaser.GameObjects.Sprite }[]) {
    for (let i = 0; i < aiBattlefieldSlots.length; i++) {
      const slot = aiBattlefieldSlots[i];
      const diceSprite = this.allAIDicesArray[i];

      if (slot && diceSprite) {
        this.putAiDiceOnBattlefield(diceSprite, slot.x, slot.y, aiBattlefieldDice);

        const indexToRemove = aiBattlefieldSlots.indexOf(diceSprite);
        if (indexToRemove !== -1) {
          this.allAIDicesArray.splice(indexToRemove, 1);
        }
      }
    }
  }

  putAiDiceOnBattlefield(diceSprite: Phaser.GameObjects.Sprite, slotX: number, slotY: number, aiBattlefieldDice: { sprite: Phaser.GameObjects.Sprite }[]) {
    diceSprite.x = slotX;
    diceSprite.y = slotY;

    const diceName = diceSprite.texture.key;
    aiBattlefieldDice.push({ sprite: diceSprite, name: diceName });
  }

  private spawnDiceOnSlot(x: number, y: number, diceSide: DiceArrayItem, diceName: string) {
    const diceKey = `${diceName}_${diceSide.name}`;
    const diceSprite = this.scene.add.sprite(x, y, diceKey);
    // Lógica para manipular os dados quando são lançados pela IA
  }
}
