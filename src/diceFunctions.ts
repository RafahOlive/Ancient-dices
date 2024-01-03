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
  diceSide: DiceArrayItem
) {
  const diceKey = `dice1_${diceSide.name}`;

  if (!scene.textures.exists(diceKey)) {
    scene.load.image(diceKey, `src/assets/SideDices/${diceSide.imagePath}`);
    scene.load.start();
    scene.load.once("complete", () => {
      const diceSprite = scene.add.sprite(x, y, diceKey).setInteractive();

      diceSprite.on("pointerdown", () => {
        selectedSprite = diceSprite;
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
  }
}
