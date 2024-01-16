import Phaser from "phaser";
import { diceArrays, DiceArrayItem, loadDiceImages } from "./diceData";

export default class AncientDices extends Phaser.Scene {
  private menuGroup!: Phaser.GameObjects.Group;

  private finishTurnButton!: Phaser.GameObjects.Rectangle;
  private rollDicesButton!: Phaser.GameObjects.Image;

  private isPlayerTurn: boolean = true;
  private hasRolledDice: boolean = false;

  private turnCounter: number = 1;
  private turnText: Phaser.GameObjects.Text;

  private humanRobotArmSlots: Phaser.GameObjects.Image[] = [];
  private aiRobotArmSlots: Phaser.GameObjects.Image[] = [];

  private humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
  private aiBattlefieldDice: Phaser.GameObjects.Sprite[] = [];

  private humanBattlefieldSlots: Phaser.GameObjects.Image[] = [];
  private aiBattlefieldSlots: Phaser.GameObjects.Image[] = [];

  private allHumanDicesArray: Phaser.GameObjects.Sprite[] = [];
  private allAIDicesArray: Phaser.GameObjects.Sprite[] = [];

  private allHumanDicesArrayVerification: boolean[] = [];

  private humanHealth: number = 20;
  private aiHealth: number = 20;
  private humanHealthText: Phaser.GameObjects.Text;
  private aiHealthText: Phaser.GameObjects.Text;

  private humanBless: number = 0;
  private aiBless: number = 0;

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
    this.allHumanDicesArrayVerification = new Array(6).fill(false);

    this.add.image(230, 500, "roboticArm");
    this.add.image(570, 100, "roboticArm");
    this.add.rectangle(350, 300, 400, 200, 0x3498db);

    this.humanHealthText = this.add.text(30, 530, `Sua vida: ${this.humanHealth}`, {
      fontSize: '20px',
      color: '#fff'
    });
    
    this.aiHealthText = this.add.text(630, 50, `Inimigo: ${this.aiHealth}`, {
      fontSize: '20px',
      color: '#fff'
    });

    this.turnText = this.add.text(16, 16, `Turno: ${this.turnCounter}`, {
      fontSize: "20px",
      color: "#fff",
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

    this.rollDicesButton = this.add.image(500, 500, "roll").setInteractive();
    this.rollDicesButton.on("pointerdown", () => {
      if (!this.isPlayerTurn || (this.isPlayerTurn && this.hasRolledDice)) {
        return;
      }

      let slotIndex = 0;

      for (const diceName in diceArrays) {
        const diceArray = diceArrays[diceName];

        // Lógica para os turnos 2 e 3
        if (this.turnCounter === 2 || this.turnCounter === 3) {
          const isSelected = this.allHumanDicesArrayVerification[slotIndex];

          if (isSelected === false) {
            const randomDiceSide = Phaser.Math.RND.pick(diceArray);
            const slot = this.humanRobotArmSlots[slotIndex];

            if (slot) {
              const diceSprite = this.spawnDiceOnSlot(
                slot.x,
                slot.y,
                randomDiceSide,
                diceName
              );
              this.allHumanDicesArray.push(diceSprite);
            }
          }
        }

        // Lógica para o turno 1
        if (this.turnCounter === 1) {
          const randomDiceSide = Phaser.Math.RND.pick(diceArray);
          const slot = this.humanRobotArmSlots[slotIndex];

          if (slot) {
            const diceSprite = this.spawnDiceOnSlot(
              slot.x,
              slot.y,
              randomDiceSide,
              diceName
            );
            this.allHumanDicesArray.push(diceSprite);
            this.allHumanDicesArrayVerification.push(diceSprite);
          }
        }
        slotIndex++;
      }

      this.hasRolledDice = true;
      this.rollDicesButton.setAlpha(0.2);
    });

    this.menuGroup = this.add.group().setVisible(false);

    this.finishTurnButton = this.add
      .rectangle(700, 300, 100, 50, 0x3498db)
      .setInteractive();

    this.finishTurnButton.on("pointerdown", () => {
      this.disableFinishButton();
      this.clearRemainingDices();
      if(this.turnCounter === 3){
        this.resolveDuel();
      } 
      else
      if (this.aiBattlefieldDice.length >= this.aiBattlefieldSlots.length) {
        setTimeout(() => {
          this.enableFinishButton();
        }, 2000);
        console.log("FUNCIONEI! TODOS DADOS IA RODADOS")
        return;
      } else {
        setTimeout(() => {
          this.aiRollDiceExample();
        }, 1000);

        setTimeout(() => {
          this.moveAiDicesToBattlefield();
        }, 2000);

        setTimeout(() => {
          this.enableFinishButton();
        }, 3000);
      }
    });
  }

  private updateHealthText() {
    this.humanHealthText.setText(`Human Health: ${this.humanHealth}`);
    this.aiHealthText.setText(`AI Health: ${this.aiHealth}`);
  }

  clearRemainingDices() {
    this.allHumanDicesArray.forEach((sprite) => sprite.destroy());
    this.allHumanDicesArray = [];
    console.log("todos os dados após finalizar o turno inimigo",this.allHumanDicesArray);
  }

  disableFinishButton() {
    this.finishTurnButton.setFillStyle(0xff3b3b);
    this.finishTurnButton.disableInteractive();
  }
  enableFinishButton() {
    this.finishTurnButton.setFillStyle(0x3498db);
    this.finishTurnButton.setInteractive();
    this.hasRolledDice = false;
    this.rollDicesButton.setAlpha(1);
    this.turnCounter++;
    this.updateTurnText();
    const totaHumanlDamageBySide = this.generateHumanDamageValue();
    console.log("Dado com o valor do dano Humano:", totaHumanlDamageBySide);
    console.log("Bençãos Humanas:", this.humanBless);
    const totalAIDamageBySide = this.generateAIDamageValue();
    console.log("Dado com o valor do dano AI:", totalAIDamageBySide);
    console.log("Bençãos IA:", this.aiBless);
  }

  updateTurnText() {
    this.turnText.setText(`Turno: ${this.turnCounter}`);
  }

  private spawnDiceOnSlot(
    x: number,
    y: number,
    diceSide: DiceArrayItem,
    diceName: string
  ) {
    const diceKey = `${diceName}_${diceSide.name}`;
    const diceSprite = this.add.sprite(x, y, diceKey).setInteractive();
    const menuGroup = this.menuGroup;
    diceSprite.on("pointerdown", () => {
      menuGroup.setVisible(true);
      this.createText("Selecionar", 100, 420, diceSprite, diceName);
      this.createText("Detalhes", 100, 440, diceSprite, diceName);
      this.createText("Cancelar", 100, 460, diceSprite, diceName);

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
        const resultDice = this.aiSpawnDiceOnSlot(slot.x,slot.y,meleeDice,diceName);
        this.allAIDicesArray.push(resultDice);
      }
      slotIndex++;
      console.log("dados do iniimgo:", this.allAIDicesArray);
    }
  }

  aiSpawnDiceOnSlot(
    x: number,
    y: number,
    diceSide: DiceArrayItem,
    diceName: string
  ): Phaser.GameObjects.Sprite {
    const diceKey = `${diceName}_${diceSide.name}`;
    const diceSprite = this.add.sprite(x, y, diceKey);
    return diceSprite;
  }

  moveAiDicesToBattlefield() {
    for (let i = 0; i < this.aiRobotArmSlots.length; i++) {
      const slot = this.aiBattlefieldSlots[i];
      const diceSprite = this.allAIDicesArray[i];

      if (slot && diceSprite) {
        this.putAiDiceOnBattlefield(diceSprite, slot.x, slot.y);

        const indexToRemove = this.aiRobotArmSlots.indexOf(diceSprite);
        if (indexToRemove !== -1) {
          this.allAIDicesArray.splice(indexToRemove, 1);
        }
      }
    }
  }

  putAiDiceOnBattlefield(
    diceSprite: Phaser.GameObjects.Sprite,
    slotX: number,
    slotY: number
  ) {
    diceSprite.x = slotX;
    diceSprite.y = slotY;
    this.aiBattlefieldDice.push({ sprite: diceSprite });
  }

  private createText(
    text: string,
    x: number,
    y: number,
    diceSprite: Phaser.GameObjects.Sprite,
    diceName: string
  ) {
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
        const localMenuGroup = this.menuGroup;

        if (text === "Cancelar" && localMenuGroup) {
          localMenuGroup.setVisible(false);
        } else if (text === "Selecionar" && localMenuGroup) {
          if (
            this.humanBattlefieldDice.length < this.humanBattlefieldSlots.length
          ) {
            const nextSlotIndex = this.humanBattlefieldDice.length;
            const nextSlot = this.humanBattlefieldSlots[nextSlotIndex];

            this.putHumanDiceOnBattlefield(diceSprite, nextSlot.x, nextSlot.y);
            this.allHumanDicesArrayVerification[nextSlotIndex] = true;

            const indexToRemove = this.allHumanDicesArray.indexOf(diceSprite);
            if (indexToRemove !== -1) {
              this.allHumanDicesArray.splice(indexToRemove, 1);
            }
            localMenuGroup.setVisible(false);
            console.log(
              "todos os dados após selecionar um dado",
              this.allHumanDicesArrayVerification
            );
            console.log(
              "todos os dados após selecionar um dado (array de criação)",
              this.allHumanDicesArray
            );
          }
        }
      });

    this.menuGroup.add(menuText);
  }

  putHumanDiceOnBattlefield(
    diceSprite: Phaser.GameObjects.Sprite,
    slotX: number,
    slotY: number
  ) {
    diceSprite.disableInteractive();
    diceSprite.x = slotX;
    diceSprite.y = slotY;

    const diceName = diceSprite.texture.key;

    this.humanBattlefieldDice.push({ sprite: diceSprite, name: diceName });

    console.log(
      "info dos dados que eu preciso para o DUELO:",
      this.humanBattlefieldDice
    );
  }

  private generateHumanDamageValue(): { [diceName: string]: number } {
    const totalDamageBySide: { [diceName: string]: number } = {};

    for (const diceInfo of this.humanBattlefieldDice) {
      const diceSprite = diceInfo.sprite;
      const diceName = diceSprite.texture.key; // Obtém o nome do lado do dado a partir do texture key

      // Verifica se o lado do dado já existe no objeto totalDamageBySide
      if (totalDamageBySide[diceName]) {
        totalDamageBySide[diceName] += 1; // Se existir, adiciona 1 ao valor existente
      } else {
        totalDamageBySide[diceName] = 1; // Se não existir, inicializa com 1
      }
    }
    return totalDamageBySide;
  }
  private generateAIDamageValue(): { [diceName: string]: number } {
    const totalDamageBySide: { [diceName: string]: number } = {};

    // Verifica se this.aiBattlefieldDice está definido e não é vazio
    if (this.aiBattlefieldDice && this.aiBattlefieldDice.length > 0) {
        for (const diceInfo of this.aiBattlefieldDice) {
            // Verifica se diceInfo.sprite está definido antes de acessar suas propriedades
            if (diceInfo.sprite) {
                const diceSprite = diceInfo.sprite;
                const diceName = diceSprite.texture.key; // Obtém o nome do lado do dado a partir do texture key

                // Verifica se o lado do dado já existe no objeto totalDamageBySide
                if (totalDamageBySide[diceName]) {
                    totalDamageBySide[diceName] += 1; // Se existir, adiciona 1 ao valor existente
                } else {
                    totalDamageBySide[diceName] = 1; // Se não existir, inicializa com 1
                }
            }
        }
    }

    return totalDamageBySide;
}


  private resolveDuel() {

    const humanMeleeDamage = this.humanTotalDamage("Melee");
    const humanRangedDamage = this.humanTotalDamage("Ranged");
    // const humanThiefDamage = this.calculateTotalDamage("Thief");

    const humanMeleeDef = this.humanTotalDefense("DefMelee");
    const humanRangedDef = this.humanTotalDefense("DefRanged");

    const aiMeleeDamage = this.aiTotalDamage("Melee");
    const aiRangedDamage = this.aiTotalDamage("Ranged");

    const aiMeleeDef = this.aiTotalDefense("DefMelee");
    const aiRangedDef = this.aiTotalDefense("DefRanged");

    const humanMeleeDifference = humanMeleeDamage - aiMeleeDef;
    const humanRangedDifference = humanRangedDamage - aiRangedDef;
    const aiMeleeDifference = aiMeleeDamage - humanMeleeDef;
    const aiRangedDifference = aiRangedDamage - humanRangedDef;

    this.applyDamageToIA(humanMeleeDifference, humanRangedDifference);
    this.applyDamageToHuman(aiMeleeDifference, aiRangedDifference);

    console.log("Differences - Human Melee:", humanMeleeDifference, "Ranged:", humanRangedDifference);
    console.log("Differences - AI Melee:", aiMeleeDifference, "Ranged:", aiRangedDifference);

    console.log("EUREKAAAAAA");
    this.updateHealthText();
  }

  private humanTotalDamage(type: string): number {
    let totalDamage = 0;

    for (const diceInfo of this.humanBattlefieldDice) {
      const diceSprite = diceInfo.sprite;
      const diceName = diceSprite.texture.key;

      if (diceName.includes(type)&& !diceName.includes("Def")) {
        totalDamage += 1; 
      }
    }
    return totalDamage;
  }

  private humanTotalDefense(type: string): number {
    let totalDefense = 0;

    for (const diceInfo of this.humanBattlefieldDice) {
      const diceSprite = diceInfo.sprite;
      const diceName = diceSprite.texture.key;

      if (diceName.includes(type)) {
        totalDefense += 1; 
      }
    }
    return totalDefense;
  }

  private aiTotalDamage(type: string): number {
    let totalDamage = 0;

    for (const diceInfo of this.aiBattlefieldDice) {
      const diceSprite = diceInfo.sprite;
      const diceName = diceSprite.texture.key;

      if (diceName.includes(type)) {
        totalDamage += 1;
      }
    }
    return totalDamage;
  }

  private aiTotalDefense(type: string): number {
    let aiTotalDefense = 0;

    for (const diceInfo of this.aiBattlefieldDice) {
      const diceSprite = diceInfo.sprite;
      const diceName = diceSprite.texture.key;

      if (diceName.includes(type)) {
        aiTotalDefense += 1;
      }
    }
    return aiTotalDefense;
  }

  private applyDamageToIA(meleeDamage: number, rangedDamage: number) {
    const meleeDamageToIA = Math.max(0, meleeDamage);
    const rangedDamageToIA = Math.max(0, rangedDamage);

    const totalDamageToIA = meleeDamageToIA + rangedDamageToIA;
    this.reduceIAHealth(totalDamageToIA);
}

private applyDamageToHuman(meleeDamage: number, rangedDamage: number) {
    const meleeDamageToHuman = Math.max(0, meleeDamage);
    const rangedDamageToHuman = Math.max(0, rangedDamage);

    const totalDamageToHuman = meleeDamageToHuman + rangedDamageToHuman;
    this.reduceHumanHealth(totalDamageToHuman);
}

  private reduceIAHealth(damage: number) {
    this.aiHealth -= damage;
    console.log(
      `IA perdeu ${damage} pontos de vida. Vida atual: ${this.aiHealth}`
    );

    // Lógica adicional conforme necessário, como verificar se a IA foi derrotada
  }

  private reduceHumanHealth(damage: number) {
    this.humanHealth -= damage;
    console.log(
      `Humano perdeu ${damage} pontos de vida. Vida atual: ${this.humanHealth}`
    );

    // Lógica adicional conforme necessário, como verificar se o humano foi derrotado
  }
}
