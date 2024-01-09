import Phaser from "phaser";

export default function SelectDice(
  text: string,
  localMenuGroup: Phaser.GameObjects.Group,
  diceSprite: Phaser.GameObjects.Sprite,
  humanBattlefieldDice: Phaser.GameObjects.Sprite[],
  humanBattlefieldSlots: Phaser.GameObjects.Image[],
  allHumanDicesArray: Phaser.GameObjects.Sprite[]
) {
  if (text === "Selecionar" && localMenuGroup) {
    // Verifica se há slots disponíveis no campo de batalha
    if (humanBattlefieldDice.length < humanBattlefieldSlots.length) {
      // Calcula a posição do próximo slot disponível
      const nextSlotIndex = humanBattlefieldDice.length;
      const nextSlot = humanBattlefieldSlots[nextSlotIndex];

      // Move o dado para o próximo slot disponível
      putOnBattle(diceSprite, nextSlot.x, nextSlot.y, humanBattlefieldDice);


      // Remove o dado do array allHumanDicesArray
      const indexToRemove = allHumanDicesArray.indexOf(diceSprite);
      if (indexToRemove !== -1) {
        allHumanDicesArray.splice(indexToRemove, 1);
      }

      // Oculta o menuGroup
      localMenuGroup.setVisible(false);
      console.log("todos os dados apos selecionar um dado", allHumanDicesArray);
    }
  }
}

function putOnBattle(
  diceSprite: Phaser.GameObjects.Sprite,
  slotX: number,
  slotY: number,
  humanBattlefieldDice: Phaser.GameObjects.Sprite[]
) {
  diceSprite.disableInteractive();
  diceSprite.x = slotX;
  diceSprite.y = slotY;
  humanBattlefieldDice.push(diceSprite);
}
