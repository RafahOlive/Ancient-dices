import Phaser from "phaser";
import { diceArrays, DiceArrayItem } from "./diceData";

export default class AncientDices extends Phaser.Scene {
  private menuGroup!: Phaser.GameObjects.Group;
  private sideDicesSelectedOnBattlefieldArray: Phaser.GameObjects.Sprite[] = [];
  private isPlayerTurn: boolean = true;
  private hasRolledDice: boolean = false;
  private humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
  private humanBattlefieldSlots: Phaser.GameObjects.Image[] = [];
  private aiRobotArmSlots: Phaser.GameObjects.Image[] = [];
  private humanRobotArmSlots: Phaser.GameObjects.Image[] = [];
  private allHumanDicesArray: Phaser.GameObjects.Sprite[] = [];

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
    this.add.rectangle(350, 300, 400, 200, 0x3498db);

    const finishTurnButton = this.add.rectangle(700, 300, 100, 50, 0x3498db);
    finishTurnButton.setInteractive();

    //Quando apertamos o botão para passar o turno

    finishTurnButton.on("pointerdown", () => {
      finishTurnButton.setFillStyle(0xff3b3b);
      finishTurnButton.disableInteractive();
      this.removerDadosNaoSelecionados();
      this.aiRollDice(); // TODO
    });

    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(100 + i * 50, 500, "slot");
      this.humanRobotArmSlots.push(slot);
    }

    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(700 + i * -50, 100, "slot");
      this.aiRobotArmSlots.push(slot);
    }

    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(200 + i * 50, 370, "slot");
      this.humanBattlefieldSlots.push(slot);
    }

    const aiBattlefieldSlots: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(200 + i * 50, 240, "slot");
      aiBattlefieldSlots.push(slot);
    }

    // Button onclick spawn a SideDice on Robotic arm
    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    rollButton.on("pointerdown", () => {
      if (!this.isPlayerTurn) {
        return;
      } else if (this.isPlayerTurn && this.hasRolledDice) {
        return;
      } else if (this.isPlayerTurn && !this.hasRolledDice) {
        let slotIndex = 0;
        for (const diceName in diceArrays) {
          const diceArray = diceArrays[diceName];
          const randomDiceSide = Phaser.Math.RND.pick(diceArray);
          const slot = this.humanRobotArmSlots[slotIndex];
          if (slot) {
            this.spawnDiceOnSlot(slot.x, slot.y, randomDiceSide, diceName);
          }
          slotIndex++;
          this.hasRolledDice = true;
        }
      }
    });
    this.menuGroup = this.add.group().setVisible(false);
  }

  removerDadosNaoSelecionados() {}

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
    const diceSprite = this.add.sprite(x, y, diceKey).setInteractive();
    diceSprite.on("pointerdown", () => {
      this.menuGroup.setVisible(true);
      this.createText("Selecionar", 100, 420);
      this.createText("Detalhes", 100, 440);
      this.createText("Cancelar", 100, 460);

      console.log(`Lado do dado selecionado: ${diceSide.name}`);

      this.sideDicesSelectedOnBattlefieldArray.push(diceSprite); // Adiciona o dado ao array

      console.log("Array de dados selecionados:",this.sideDicesSelectedOnBattlefieldArray);
      console.log("e vc o que é:", diceSprite);
    });

    this.allHumanDicesArray.push(diceSprite);
    // console.log("todos os dados", this.allHumanDicesArray);
    return diceSprite;
  }

  private createText(text: string, x: number, y: number) {
    const menuText = this.add
      .text(x, y, text, {
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: {
          left: 10,
          right: 10,
          top: 1,
          bottom: 1,
        },
        fontSize: 12,
        lineSpacing: 10,
      })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log(`${text} clicado!`);
        const localMenuGroup = this.menuGroup;

        if (text === "Cancelar" && localMenuGroup) {
          localMenuGroup.setVisible(false);
        } else if (text === "Selecionar" && localMenuGroup) {
          console.log(this.allHumanDicesArray)
          // Pega o último dado criado (pode ser ajustado conforme necessário)
          const lastDice =
            this.sideDicesSelectedOnBattlefieldArray[
              this.sideDicesSelectedOnBattlefieldArray.length - 1
            ];

          // Verifica se há slots disponíveis no campo de batalha
          if (
            this.humanBattlefieldDice.length < this.humanBattlefieldSlots.length
          ) {
            // Calcula a posição do próximo slot disponível
            const nextSlotIndex = this.humanBattlefieldDice.length;
            const nextSlot = this.humanBattlefieldSlots[nextSlotIndex];

            // Move o dado para o próximo slot disponível
            this.colocarNoCampo(lastDice, nextSlot.x, nextSlot.y);

            // Oculta o menuGroup
            localMenuGroup.setVisible(false);
          }
        }
      });

    this.menuGroup.add(menuText);
  }

  colocarNoCampo(
    diceSprite: Phaser.GameObjects.Sprite,
    slotX: number,
    slotY: number
  ) {
    diceSprite.disableInteractive();
    diceSprite.x = slotX;
    diceSprite.y = slotY;
    this.humanBattlefieldDice.push(diceSprite);
  }
}
