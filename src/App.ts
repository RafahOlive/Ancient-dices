import Phaser from "phaser";

interface DiceArrayItem {
  name: string;
  imagePath: string;
}

interface DiceArrays {
  [key: string]: DiceArrayItem[];
}

const diceArrays: DiceArrays = {
  dice1: [
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "BlessedRanged.png", imagePath: "BlessedRanged.png" },
    { name: "DefMelee.png", imagePath: "DefMelee.png" },
    { name: "DefRanged.png", imagePath: "DefRanged.png" },
    { name: "BlessedThief.png", imagePath: "BlessedThief.png" },
  ],
  dice2: [
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Ranged.png", imagePath: "Ranged.png" },
    { name: "DefMelee.png", imagePath: "DefMelee.png" },
    { name: "BlessedDefRanged.png", imagePath: "BlessedDefRanged.png" },
    { name: "BlessedThief.png", imagePath: "BlessedThief.png" },
  ],
  dice3: [
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "BlessedRanged.png", imagePath: "BlessedRanged.png" },
    { name: "BlessedDefMelee.png", imagePath: "BlessedDefMelee.png" },
    { name: "DefRanged.png", imagePath: "DefRanged.png" },
    { name: "Thief.png", imagePath: "Thief.png" },
  ],
  dice4: [
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Ranged.png", imagePath: "Ranged.png" },
    { name: "BlessedDefMelee.png", imagePath: "BlessedDefMelee.png" },
    { name: "DefRanged.png", imagePath: "DefRanged.png" },
    { name: "BlessedThief.png", imagePath: "BlessedThief.png" },
  ],
  dice5: [
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "BlessedRanged.png", imagePath: "BlessedRanged.png" },
    { name: "DefMelee.png", imagePath: "DefMelee.png" },
    { name: "BlessedDefRanged.png", imagePath: "BlessedDefRanged.png" },
    { name: "Thief.png", imagePath: "Thief.png" },
  ],
  dice6: [
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Melee.png", imagePath: "Melee.png" },
    { name: "Ranged.png", imagePath: "Ranged.png" },
    { name: "BlessedDefMelee.png", imagePath: "BlessedDefMelee.png" },
    { name: "BlessedDefRanged.png", imagePath: "BlessedDefRanged.png" },
    { name: "Thief.png", imagePath: "Thief.png" },
  ],
};

// dice 2 : 2 melee, ranged, defMelee, blessedDefRanged, blessedThief
// dice 3 : 2 melee, blessedRanged, blessedDefMelee, defRanged, thief
// dice 4 : 2 melee, ranged, blessedDefMelee, defRanged, blessedThief
// dice 5 : 2 melee, blessedRanged, defMelee, BlessedDefRanged, thief
// dice 6 : 2 melee, ranged, blessedDefMelee, blessedDefRanged, thief

let selectedSprite: Phaser.GameObjects.Sprite | null = null;

export default class AncientDices extends Phaser.Scene {
  preload() {
    for (const diceName in diceArrays) {
      this.loadDiceImages(diceName, diceArrays[diceName]);
    }

    //RobotArm Interactives
    this.load.image("roll", "src/assets/RoboticArm/Roll.png");
    this.load.image("roboticArm", "src/assets/RoboticArm/RoboticArm.png");
    this.load.image("slot", "src/assets/RoboticArm/Slot.png");
  }

  create() {
    this.add.image(230, 500, "roboticArm");

    const slots: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(100 + i * 50, 500, "slot");
      slots.push(slot);
    }

    //Button onclick spawn a SideDice on Robotic arm
    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    rollButton.on("pointerdown", () => {
      let slotIndex = 0;
      for (const diceName in diceArrays) {
        const diceArray = diceArrays[diceName];
        const randomDiceSide = Phaser.Math.RND.pick(diceArray);
        const slot = slots[slotIndex];

        if (slot) {
          this.spawnDiceOnSlot(slot.x, slot.y, randomDiceSide);
        }

        slotIndex++;
      }
    });
  }

  update() {}

  private loadDiceImages(diceName: string, diceArray: DiceArrayItem[]) {
    diceArray.forEach((item) => {
      this.load.image(
        `${diceName}_${item.name}`,
        `src/assets/SideDices/${item.imagePath}`
      );
    });
  }
  private spawnDiceOnSlot(x: number, y: number, diceSide: DiceArrayItem) {
    const diceKey = `dice1_${diceSide.name}`;

    if (!this.textures.exists(diceKey)) {
      this.load.image(diceKey, `src/assets/SideDices/${diceSide.imagePath}`);
      this.load.start();
      this.load.once("complete", () => {
        const diceSprite = this.add
          .sprite(x, y, diceKey)
          .setInteractive({ draggable: true });

        diceSprite.on("pointerdown", () => {
          selectedSprite = diceSprite;
        });

        diceSprite.on("pointerup", () => {
          selectedSprite = null;
        });

        diceSprite.on("drag", (pointer: Phaser.Input.Pointer) => {
          if (selectedSprite === diceSprite) {
            diceSprite.x = pointer.x;
            diceSprite.y = pointer.y;
          }
        });
      });
    } else {
      // Se a textura já existir, crie o sprite imediatamente
      const diceSprite = this.add
        .sprite(x, y, diceKey)
        .setInteractive({ draggable: true });

      diceSprite.on("pointerdown", () => {
        selectedSprite = diceSprite;
      });

      diceSprite.on("pointerup", function () {
        selectedSprite = null;
      });

      diceSprite.on(
        "drag",
        function (
          this: Phaser.GameObjects.Sprite,
          pointer: Phaser.Input.Pointer
        ) {
          if (selectedSprite === this) {
            this.x = pointer.x;
            this.y = pointer.y;
          }
        }
      );
    }
  }
}
