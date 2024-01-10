import Phaser from "phaser";
import { diceArrays, DiceArrayItem, loadDiceImages } from "./diceData";

export default class AncientDices extends Phaser.Scene {
  private menuGroup!: Phaser.GameObjects.Group;

  private finishTurnButton!: Phaser.GameObjects.Rectangle;

  private isPlayerTurn: boolean = true;
  private hasRolledDice: boolean = false;

  private turnCounter: number = 1;
  private turnText:  Phaser.GameObjects.Text

  private humanRobotArmSlots: Phaser.GameObjects.Image[] = [];
  private aiRobotArmSlots: Phaser.GameObjects.Image[] = [];

  private humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
 
  private humanBattlefieldSlots: Phaser.GameObjects.Image[] = [];
  private aiBattlefieldSlots: Phaser.GameObjects.Image[] = [];

  private allHumanDicesArray: Phaser.GameObjects.Sprite[] = [];
  private allAIDicesArray : Phaser.GameObjects.Sprite[] =[];

  preload() {
    for (const diceName in diceArrays) {
      loadDiceImages(this, diceName, diceArrays[diceName]);
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

    this.turnText = this.add.text(16, 16, `Turno: ${this.turnCounter}`, {
      fontSize: "20px",
      color: "#fff"
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

    for (let i = 0; i < 6; i++) {
      const slot = this.add.image(200 + i * 50, 240, "slot");
      this.aiBattlefieldSlots.push(slot);
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
            const diceSprite = this.spawnDiceOnSlot(slot.x, slot.y, randomDiceSide, diceName);
            this.allHumanDicesArray.push(diceSprite)
          }
          slotIndex++;
          this.hasRolledDice = true;
        }
      }
    });
    this.menuGroup = this.add.group().setVisible(false);

    this.finishTurnButton = this.add.rectangle(700, 300, 100, 50, 0x3498db).setInteractive();

    this.finishTurnButton.on("pointerdown", () => {
      this.disableFinishButton();
      this.clearRemainingDices();
      setTimeout(() => {
        this.aiRollDiceExample()
      }, 1000)

      setTimeout(() => {
        this.moveAiDicesToBattlefield();
      },2000)

      setTimeout(() => {
        this.enableFinishButton();
      },3000)
    });
  }

  clearRemainingDices() {
    this.allHumanDicesArray.forEach(sprite => sprite.destroy());
    this.allHumanDicesArray = [];
    console.log("todos os dados após finalizar o turno inimigo", this.allHumanDicesArray);
  }

  disableFinishButton(){
    this.finishTurnButton.setFillStyle(0xff3b3b);
    this.finishTurnButton.disableInteractive();
  }
  enableFinishButton(){
    this.finishTurnButton.setFillStyle(0x3498db);
    this.finishTurnButton.setInteractive();
  }

  

  private spawnDiceOnSlot(
    x: number,
    y: number,
    diceSide: DiceArrayItem,
    diceName: string
  ){
    const diceKey = `${diceName}_${diceSide.name}`;
    const diceSprite = this.add.sprite(x, y, diceKey).setInteractive();
    diceSprite.on("pointerdown", () => {
      this.menuGroup.setVisible(true);
      this.createText("Selecionar", 100, 420, diceSprite);
      this.createText("Detalhes", 100, 440, diceSprite);
      this.createText("Cancelar", 100, 460, diceSprite);

      console.log(`Lado do dado selecionado: ${diceSide.name}`);
      console.log("todos os dados", this.allHumanDicesArray);
    });
    return diceSprite;
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
        const meleeDice = diceArray.find((dice) => dice.name.includes("Melee"));
        const slot = this.aiRobotArmSlots[slotIndex];
        if (slot) {
          const resultDice = this.aiSpawnDiceOnSlot(slot.x, slot.y, meleeDice, diceName);
          this.allAIDicesArray.push(resultDice)
        }
        slotIndex++;
        console.log('dados do iniimgo:', this.allAIDicesArray)
    }
  }

  aiSpawnDiceOnSlot(x: number, y: number, diceSide: DiceArrayItem, diceName: string): Phaser.GameObjects.Sprite {
    const diceKey = `${diceName}_${diceSide.name}`;
    const diceSprite = this.add.sprite(x, y, diceKey);
    return diceSprite;
  }

  moveAiDicesToBattlefield(){
    for (let i = 0; i < this.aiRobotArmSlots.length; i++) {
      const slot = this.aiBattlefieldSlots[i];
      const diceSprite = this.allAIDicesArray[i];
  
      if (slot && diceSprite) {
        this.moveDiceToSlot(diceSprite, slot.x, slot.y);
  
        const indexToRemove = this.aiRobotArmSlots.indexOf(diceSprite);
        if (indexToRemove !== -1) {
          this.allAIDicesArray.splice(indexToRemove, 1);
        }
      }
    }
  }

  moveDiceToSlot(
    diceSprite: Phaser.GameObjects.Sprite,
    slotX: number,
    slotY: number
  ) {
    diceSprite.x = slotX;
    diceSprite.y = slotY;
  }

  private createText(text: string, x: number, y: number, diceSprite: Phaser.GameObjects.Sprite) {
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
          // Verifica se há slots disponíveis no campo de batalha
          if (
            this.humanBattlefieldDice.length < this.humanBattlefieldSlots.length
          ) {
            // Calcula a posição do próximo slot disponível
            const nextSlotIndex = this.humanBattlefieldDice.length;
            const nextSlot = this.humanBattlefieldSlots[nextSlotIndex];
  
            // Move o dado para o próximo slot disponível
            this.colocarNoCampo(diceSprite, nextSlot.x, nextSlot.y);
  
            // Remove o dado do array allHumanDicesArray
            const indexToRemove = this.allHumanDicesArray.indexOf(diceSprite);
            if (indexToRemove !== -1) {
              this.allHumanDicesArray.splice(indexToRemove, 1);
            }
  
            // Oculta o menuGroup
            localMenuGroup.setVisible(false);
            console.log("todos os dados apos selecionar um dado", this.allHumanDicesArray);
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
