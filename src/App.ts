import Phaser from "phaser";
import { diceArrays, DiceArrayItem, loadDiceImages } from "./diceData";
import { AIManager } from "./aiManager";
import BattleManager from "./battleManager";

export default class AncientDices extends Phaser.Scene {
  private battleManager: BattleManager;
  private aiManager: AIManager;

  private menuGroup!: Phaser.GameObjects.Group;

  private finishTurnButton!: Phaser.GameObjects.Rectangle;
  private rollDicesButton!: Phaser.GameObjects.Image;

  private isPlayerTurn: boolean = true;
  private hasRolledDice: boolean = false;

  private turnCounter: number = 1;
  private turnText: Phaser.GameObjects.Text;

  private aiRobotArmSlots: Phaser.GameObjects.Image[] = [];

  private humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
  private aiBattlefieldDice: Phaser.GameObjects.Sprite[] = [];

  private humanBattlefieldSlots: Phaser.GameObjects.Rectangle[] = [];
  private aiBattlefieldSlots: Phaser.GameObjects.Rectangle[] = [];

  private allHumanDicesArray: Phaser.GameObjects.Sprite[] = [];
  private allAIDicesArray: Phaser.GameObjects.Sprite[] = [];

  private allHumanDicesArrayVerification: boolean[] = [];

  private humanBless: number = 0;
  private aiBless: number = 0;

  constructor() {
    super({ key: 'AncientDices'});
    this.battleManager = new BattleManager(this);
    // this.aiManager = new AIManager(Phaser.Scene, this.aiRobotArmSlots, this.allAIDicesArray);
    // Outras inicializações, se necessário...
  }

  preload() {
    this.load.image("BGBase", "src/assets/Background/Base.png");
    this.load.image("BGCircuit", "src/assets/Background/Circuits.png");

    // for (const diceName in diceArrays) {
    //   loadDiceImages(this, diceName, diceArrays[diceName]);
    // }

    for (const diceName in diceArrays) {
      const diceArray = diceArrays[diceName];
      diceArray.forEach((item) => {
        loadDiceImages(this, item.name, item.imagePath);
      });
    }
    

    // RobotArm Interactives
    this.load.image("roll", "src/assets/RoboticArm/Roll.png");
    this.load.image("roboticArm", "src/assets/RoboticArm/RoboticArm.png");
    this.load.image("roboticArmCircuit", "src/assets/RoboticArm/RoboticArmCircuits.png");
  }

  create() {
    const textureManager = this.textures;

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    // Obter os nomes das texturas carregadas
    const textureNames: string[] = Object.keys(textureManager.list);

    console.log('Nomes de texturas carregadas:', textureNames);

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // this.scale.scaleMode = Phaser.Scale.ScaleModes.FIT;
    this.scale.setGameSize(1920, 1090);

    this.aiManager = new AIManager(this, this.aiRobotArmSlots, this.allAIDicesArray)

    this.add.image(0, 0, "BGBase").setOrigin(0, 0).setScale(0.7);
    this.add.image(0, 0, "BGCircuit").setOrigin(0, 0).setScale(0.7);

    //Braço do Humano
    const roboArm = this.add.image(650, 640, "roboticArm").setScale(0.8).setRotation(Phaser.Math.DegToRad(-4))
    const roboArmCirc = this.add.image(650, 640, "roboticArmCircuit").setScale(0.8).setRotation(Phaser.Math.DegToRad(-4))

    function playDamageAnimation() {
      // const damageTween = this.tweens.createTimeline();
      this.tweens.add({
        targets: [roboArmCirc, roboArm],
        duration: 50,
        ease: 'Power1',
        x: '+=5',
        y: '+=5', // Move 5 pixels para a direita
        yoyo: true,
        repeat: 5
      });

      this.tweens.add({
        targets: roboArmCirc,
        duration: 300, // duração em milissegundos
        ease: 'Power1', // função de interpolação para suavizar o movimento
        alpha: 0.5, // valor final de alfa (transparência)
        tint: 0xff0000, // cor final (vermelho no formato hexadecimal)
        yoyo: true, // faz a animação de ida e volta
        repeat: 1, // número de vezes para repetir a animação
        onComplete: () => {
          roboArmCirc.alpha = 1; // Restaura o alfa para 1 após a animação
          roboArmCirc.tint = 0xffffff; // Restaura a cor para branca após a animação
        }
      });

    }

    //Braço da IA
    this.add.image(650, 100, "roboticArm").setFlipX(true).setFlipY(true).setScale(0.8);
    this.add.image(650, 100, "roboticArmCircuit").setFlipX(true).setFlipY(true).setScale(0.8);

    this.battleManager.humanHealthText = this.add.text(30, 530, `Sua vida: ${this.battleManager.humanHealth}`,
      {
        fontSize: "20px",
        color: "#fff",
      }
    );

    this.battleManager.aiHealthText = this.add.text(630, 50, `Inimigo: ${this.battleManager.aiHealth}`, {
      fontSize: "20px",
      color: "#fff",
    });

    this.turnText = this.add.text(16, 16, `Turno: ${this.turnCounter}`, {
      fontSize: "20px",
      color: "#fff",
    });

    for (let i = 0; i < 6; i++) {
      const slot = this.add.rectangle(500 + i * 50, 490, 100, 50, 0x000000, 1);
      this.humanBattlefieldSlots.push(slot);
    }

    for (let i = 0; i < 6; i++) {
      const slot = this.add.rectangle(500 + i * 50, 240, 100, 50, 0x000000, 1);
      this.aiBattlefieldSlots.push(slot);
    }

    this.allHumanDicesArrayVerification = new Array(6).fill(false);

    this.rollDicesButton = this.add.image(1000, 500, "roll").setInteractive();
    this.rollDicesButton.on("pointerdown", () => {
      playDamageAnimation.call(this);
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

            const x = 420 + slotIndex * 72;
            const y = 630;

            const diceSprite = this.spawnDiceOnSlot(x, y, randomDiceSide);
            diceSprite.setScale(0.4)
            this.allHumanDicesArray.push(diceSprite);
          }
        }

        // Lógica para o turno 1
        if (this.turnCounter === 1) {
          const randomDiceSide = Phaser.Math.RND.pick(diceArray);

          const spawnX = 420 + slotIndex * 72;
          const spawnY = 630;

          const diceSprite = this.spawnDiceOnSlot(spawnX, spawnY, randomDiceSide);
          diceSprite.setScale(0.4)

          this.allHumanDicesArray.push(diceSprite);
          this.allHumanDicesArrayVerification.push(diceSprite);
        }
        slotIndex++;
      }

      this.hasRolledDice = true;
      this.rollDicesButton.setAlpha(0.2);
    });

    this.menuGroup = this.add.group().setVisible(false);

    this.finishTurnButton = this.add.rectangle(1200, 350, 100, 50, 0x3498db).setInteractive();

    this.finishTurnButton.on("pointerdown", () => {
      this.disableFinishButton();
      this.clearRemainingDices();
      if (this.turnCounter === 3) {
        this.battleManager.organizeBattlefieldDices(this.humanBattlefieldDice, this.aiBattlefieldDice)
        this.battleManager
        // this.battleManager.resolveDuel(this.humanBattlefieldDice, this.aiBattlefieldDice);
        console.log("Antes de updateHealthText - Human Health:", this.battleManager.humanHealth, "AI Health:", this.battleManager.aiHealth);
        console.log("Depois de updateHealthText - Human Health:", this.battleManager.humanHealth, "AI Health:", this.battleManager.aiHealth);

      } else if (
        this.aiBattlefieldDice.length >= this.aiBattlefieldSlots.length
      ) {
        setTimeout(() => {
          this.enableFinishButton();
        }, 2000);
        console.log("FUNCIONEI! TODOS DADOS IA RODADOS");
        return;
      } else {
        setTimeout(() => {
          this.aiManager.aiRollDiceExample();
        }, 1000);

        setTimeout(() => {
          this.aiManager.moveAiDicesToBattlefield(this.aiBattlefieldSlots, this.aiBattlefieldDice);
        }, 2000);

        setTimeout(() => {
          this.enableFinishButton();
        }, 3000);
      }
    });
  }

  clearRemainingDices() {
    this.allHumanDicesArray.forEach((sprite) => sprite.destroy());
    this.allHumanDicesArray = [];
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

  private spawnDiceOnSlot(x: number,y: number,diceSide: DiceArrayItem) {
    const diceKey = `${diceSide.name.replace(/\.png/g, '')}`;
    const diceSprite = this.add.sprite(x, y, diceKey).setInteractive();
    const menuGroup = this.menuGroup;
    diceSprite.on("pointerdown", () => {
      menuGroup.setVisible(true);
      this.createText("Selecionar", 100, 420, diceSprite);
      this.createText("Detalhes", 100, 440, diceSprite);
      this.createText("Cancelar", 100, 460, diceSprite);

      console.log("todos os dados", this.allHumanDicesArray);
    });
    return diceSprite;
  }

  private createText(
    text: string,
    x: number,
    y: number,
    diceSprite: Phaser.GameObjects.Sprite,
  ) {
    const menuText = this.add.text(x, y, text, {
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
      }).setOrigin(0.5, 0.5).setInteractive().on("pointerdown", () => {
        const localMenuGroup = this.menuGroup;

        if (text === "Cancelar" && localMenuGroup) {
          localMenuGroup.setVisible(false);
        } else if (text === "Selecionar" && localMenuGroup) {
          if (this.humanBattlefieldDice.length < this.humanBattlefieldSlots.length) {
            const nextSlotIndex = this.humanBattlefieldDice.length;
            const nextSlot = this.humanBattlefieldSlots[nextSlotIndex];

            this.putHumanDiceOnBattlefield(diceSprite, nextSlot.x, nextSlot.y);
            this.allHumanDicesArrayVerification[nextSlotIndex] = true;

            const indexToRemove = this.allHumanDicesArray.indexOf(diceSprite);
            if (indexToRemove !== -1) {
              this.allHumanDicesArray.splice(indexToRemove, 1);
            }
            localMenuGroup.setVisible(false);
            console.log("todos os dados após selecionar um dado",this.allHumanDicesArrayVerification);
            console.log("todos os dados após selecionar um dado (array de criação)",this.allHumanDicesArray);
          }
        }
      });

    this.menuGroup.add(menuText);
  }

  putHumanDiceOnBattlefield(diceSprite: Phaser.GameObjects.Sprite,slotX: number,slotY: number) {
    diceSprite.disableInteractive();
    diceSprite.x = slotX;
    diceSprite.y = slotY;

    const diceName = diceSprite.texture.key;

    console.log("O Que temos aqui de name?:",diceName);

    this.humanBattlefieldDice.push({ sprite: diceSprite, name: diceName });

    console.log("info dos dados que eu preciso para o DUELO:",this.humanBattlefieldDice);
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
}
