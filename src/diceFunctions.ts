import Phaser from "phaser";
import { DiceArrayItem } from "./diceData";

export function loadDiceImages(
  scene: Phaser.Scene,
  diceName: string,
  diceArray: DiceArrayItem[]
) {
  diceArray.forEach((item) => {
    scene.load.image(
      `${diceName}_${item.name}`,
      `src/assets/SideDices/${item.imagePath}`
    );
  });
}

export function spawnDiceOnSlot(
  scene: Phaser.Scene,
  x: number,
  y: number,
  diceSide: DiceArrayItem,
  selectedSprite: Phaser.GameObjects.Sprite | null
) {
  const diceKey = `dice1_${diceSide.name}`;

  if (!scene.textures.exists(diceKey)) {
    scene.load.image(diceKey, `src/assets/SideDices/${diceSide.imagePath}`);
    scene.load.start();
    scene.load.once("complete", () => {
      const diceSprite = scene.add
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
    const diceSprite = scene.add
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
