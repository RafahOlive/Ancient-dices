export interface DiceArrayItem {
    name: string;
    imagePath: string;
  }
  
  export interface DiceArrays {
    [key: string]: DiceArrayItem[];
  }
  
  export const diceArrays: DiceArrays = {
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

export function loadDiceImages(scene: Phaser.Scene, diceName: string, diceArray: DiceArrayItem[]) {
  diceArray.forEach((item) => {
    scene.load.image(
      `${diceName}_${item.name}`,
      `src/assets/SideDices/${item.imagePath}`
    );
  });
}