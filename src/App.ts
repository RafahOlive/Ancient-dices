import Phaser from "phaser";
import { diceArrays, DiceArrayItem } from "./diceData";

export default class AncientDices extends Phaser.Scene {
  private menuGroup!: Phaser.GameObjects.Group;

  preload() {
    for (const diceName in diceArrays) {
      this.loadDiceImages(diceName, diceArrays[diceName]);
    }

    // RobotArm Interactives
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

    // Button onclick spawn a SideDice on Robotic arm
    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    rollButton.on("pointerdown", () => {
      let slotIndex = 0;
      for (const diceName in diceArrays) {
        const diceArray = diceArrays[diceName];
        const randomDiceSide = Phaser.Math.RND.pick(diceArray);
        const slot = firstSlots[slotIndex];

        if (slot) {
          this.spawnDiceOnSlot(slot.x, slot.y, randomDiceSide, diceName);
        }
        slotIndex++;
      }
    });

    // Inicialize o grupo de menu
    this.menuGroup = this.add.group().setVisible(false);
  }

  private loadDiceImages(diceName: string, diceArray: DiceArrayItem[]) {
    diceArray.forEach((item) => {
      this.load.image(
        `${diceName}_${item.name}`,
        `src/assets/SideDices/${item.imagePath}`
      );
    });
  }

  private spawnDiceOnSlot(
    x: number,
    y: number,
    diceSide: DiceArrayItem,
    diceName: string
  ) {
    const diceKey = `${diceName}_${diceSide.name}`;

    if (!this.textures.exists(diceKey)) {
      this.load.image(diceKey, `src/assets/SideDices/${diceSide.imagePath}`);
      this.load.start();
      this.load.once("complete", () => {
        this.createDiceSprite(x, y, diceKey);
      });
    } else {
      this.createDiceSprite(x, y, diceKey);
    }
  }

  private createDiceSprite(x: number, y: number, diceKey: string) {
    const diceSprite = this.add.sprite(x, y, diceKey).setInteractive();
    diceSprite.on("pointerdown", () => {
      this.menuGroup.setVisible(true);
      this.createText("Selecionar", 400, 300);
      this.createText("Detalhes", 400, 350);
      this.createText("Cancelar", 400, 400);
      // Lógica adicional para interação com o menu, se necessário
    });
  }

  private createText(text: string, x: number, y: number) {
    const menuText = this.add
      .text(x, y, text, {
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5,
        },
      })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log(`${text} clicado!`);

        // Acesse a propriedade menuGroup usando uma referência local
        const localMenuGroup = this.menuGroup;

        // Adicione aqui a lógica para o que acontece quando o texto é clicado
        if (text === "Cancelar" && localMenuGroup) {
          localMenuGroup.setVisible(false);
        }
      });

    this.menuGroup.add(menuText);
  }
}
