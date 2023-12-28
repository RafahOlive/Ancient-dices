import Phaser from "phaser";

// dice 1 : 2 melee, blessedRanged, defMelee, defRanged, blessedThief
const dice1Array = [
  "Melee.png",
  "Melee.png",
  "BlessedRanged.png",
  "DefMelee.png",
  "DefRanged.png",
  "BlessedThief.png",
];

// dice 2 : 2 melee, ranged, defMelee, blessedDefRanged, blessedThief
const dice2Array = [
  "Melee.png",
  "Melee.png",
  "Ranged.png",
  "DefMelee.png",
  "BlessedDefRanged.png",
  "BlessedThief.png",
];

// dice 3 : 2 melee, blessedRanged, blessedDefMelee, defRanged, thief
const dice3Array = [
  "Melee.png",
  "Melee.png",
  "BlessedRanged.png",
  "BlessedDefMelee.png",
  "DefRanged.png",
  "Thief.png",
];

// dice 4 : 2 melee, ranged, blessedDefMelee, defRanged, blessedThief
const dice4Array = [
  "Melee.png",
  "Melee.png",
  "Ranged.png",
  "BlessedDefMelee.png",
  "DefRanged.png",
  "BlessedThief.png",
];

// dice 5 : 2 melee, blessedRanged, defMelee, BlessedDefRanged, thief
const dice5Array = [
  "Melee.png",
  "Melee.png",
  "BlessedRanged.png",
  "DefMelee.png",
  "BlessedDefRanged.png",
  "Thief.png",
];

// dice 6 : 2 melee, ranged, blessedDefMelee, blessedDefRanged, thief
const dice6Array = [
  "Melee.png",
  "Melee.png",
  "Ranged.png",
  "BlessedDefMelee.png",
  "BlessedDefRanged.png",
  "Thief.png",
];

let selectedSprite: Phaser.GameObjects.Sprite | null = null;

export default class AncientDices extends Phaser.Scene {
  preload() {
    //Dice 1
    dice1Array.forEach((dice1) => {
      this.load.image(dice1, `src/assets/SideDices/${dice1}`);
    });
    //Dice 2
    dice2Array.forEach((dice2) => {
      this.load.image(dice2, `src/assets/SideDices/${dice2}`);
    });
    //Dice 3
    dice3Array.forEach((dice3) => {
      this.load.image(dice3, `src/assets/SideDices/${dice3}`);
    });
    //Dice 4
    dice4Array.forEach((dice4) => {
      this.load.image(dice4, `src/assets/SideDices/${dice4}`);
    });
    //Dice 5
    dice5Array.forEach((dice5) => {
      this.load.image(dice5, `src/assets/SideDices/${dice5}`);
    });
    //Dice 6
    dice6Array.forEach((dice6) => {
      this.load.image(dice6, `src/assets/SideDices/${dice6}`);
    });

    //RobotArm Interactives
    this.load.image("roll", "src/assets/RoboticArm/Roll.png");
    this.load.image("roboticArm", "src/assets/RoboticArm/RoboticArm.png");
    this.load.image("slot", "src/assets/RoboticArm/Slot.png");
  }

  create() {
    this.add.image(230, 500, "roboticArm");
    this.add.image(100, 500, "slot");
    this.add.image(150, 500, "slot");
    this.add.image(200, 500, "slot");
    this.add.image(250, 500, "slot");
    this.add.image(300, 500, "slot");
    this.add.image(350, 500, "slot");

    //Button onclick spawn a SideDice on Robotic arm
    const rollButton = this.add.image(500, 500, "roll").setInteractive();
    rollButton.on("pointerdown", () => {
      const randomDiceSide1 = Phaser.Math.RND.pick(dice1Array);
      const diceSide1 = this.add.sprite(100, 500, randomDiceSide1);

      const randomDiceSide2 = Phaser.Math.RND.pick(dice2Array);
      const diceSide2 = this.add.sprite(150, 500, randomDiceSide2);

      const randomDiceSide3 = Phaser.Math.RND.pick(dice3Array);
      const diceSide3 = this.add.sprite(200, 500, randomDiceSide3);

      const randomDiceSide4 = Phaser.Math.RND.pick(dice4Array);
      const diceSide4 = this.add.sprite(250, 500, randomDiceSide4);

      const randomDiceSide5 = Phaser.Math.RND.pick(dice5Array);
      const diceSide5 = this.add.sprite(300, 500, randomDiceSide5);

      const randomDiceSide6 = Phaser.Math.RND.pick(dice6Array);
      const diceSide6 = this.add.sprite(350, 500, randomDiceSide6);

      diceSide1.setInteractive({ draggable: true });
      diceSide2.setInteractive({ draggable: true });
      diceSide3.setInteractive({ draggable: true });
      diceSide4.setInteractive({ draggable: true });
      diceSide5.setInteractive({ draggable: true });
      diceSide6.setInteractive({ draggable: true });

      diceSide1.on("pointerdown", function (this: Phaser.GameObjects.Sprite) {
        selectedSprite = this;
      });

      diceSide1.on("pointerup", function () {
        selectedSprite = null;
      });

      diceSide1.on(
        "drag",
        function (
          this: Phaser.GameObjects.Sprite,
          pointer: Phaser.Input.Pointer
        ) {
          if (diceSide1 === this) {
            this.x = pointer.x;
            this.y = pointer.y;
          }
        }
      );
    });
  }

  update() {}
}
