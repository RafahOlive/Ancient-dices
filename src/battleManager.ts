import Phaser, { Scene } from "phaser";

export default class BattleManager {
    private scene: Phaser.Scene
    public humanHealth: number = 20;
    public aiHealth: number = 20;

    public humanHealthText: Phaser.GameObjects.Text;
    public aiHealthText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public organizeBattlefieldDices(humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [], aiBattlefieldDice: Phaser.GameObjects.Sprite[] = []) {
        const order: string[] = ["Melee", "Ranged", "BlessedRanged", "DefMelee", "BlessedDefMelee", "DefRanged", "BlessedDefRanged", "Thief", "BlessedThief"];
        const orderedHumanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
        const orderedAIBattlefieldDice: Phaser.GameObjects.Sprite[] = [];

        const humanMeleeSidesBattlefield: Phaser.GameObjects.Sprite[] = [];
        const aiMeleeDefSidesBattlefield: Phaser.GameObjects.Sprite[] = [];

        for (const category of order) {
            const humanCategorySprites = humanBattlefieldDice.filter(dice => dice.name === category);
            orderedHumanBattlefieldDice.push(...humanCategorySprites);

            const aiCategorySprites = aiBattlefieldDice.filter(dice => dice.name === category);
            orderedAIBattlefieldDice.push(...aiCategorySprites)
        }

        const humanMeleeDamage = BattleManager.humanTotalDamage(humanBattlefieldDice, "Melee");
        const humanRangedDamage = BattleManager.humanTotalDamage(humanBattlefieldDice, "Ranged");
        const humanThief = BattleManager.humanTotalThief(humanBattlefieldDice, "Thief")

        const humanMeleeDef = BattleManager.humanTotalDefense(humanBattlefieldDice, "DefMelee");
        const humanRangedDef = BattleManager.humanTotalDefense(humanBattlefieldDice, "DefRanged");

        const aiMeleeDamage = BattleManager.aiTotalDamage(aiBattlefieldDice, "Melee");
        const aiRangedDamage = BattleManager.aiTotalDamage(aiBattlefieldDice, "Ranged");

        const aiMeleeDef = BattleManager.aiTotalDefense(aiBattlefieldDice, "DefMelee");
        const aiRangedDef = BattleManager.aiTotalDefense(aiBattlefieldDice, "DefRanged");
        const aiThief = BattleManager.aiTotalThief(aiBattlefieldDice, "Thief")

        //Organização dos lados melee
        setTimeout(() => {
            this.humanMeleeSideOrganization(humanMeleeDamage, aiMeleeDef, orderedHumanBattlefieldDice, orderedAIBattlefieldDice, humanMeleeSidesBattlefield, aiMeleeDefSidesBattlefield)
        }, 1000);
        setTimeout(() => {
            this.humanMeleeSideAnimation(humanMeleeSidesBattlefield, aiMeleeDefSidesBattlefield);
        }, 2000);
        setTimeout(() => {
            this.humanMeleeSideDamageCalc(humanMeleeDamage, humanMeleeSidesBattlefield, aiMeleeDefSidesBattlefield);
        }, 5000);
        setTimeout(() => {
            this.updateHealthText();
        }, 5500);
    }
    

    public humanMeleeSideOrganization(
        humanMeleeDamage: number,
        aiMeleeDef: number,
        orderedHumanBattlefieldDice: Phaser.GameObjects.Sprite[],
        orderedAIBattlefieldDice: Phaser.GameObjects.Sprite[],
        humanMeleeSidesBattlefield: Phaser.GameObjects.Sprite[],
        aiMeleeDefSidesBattlefield: Phaser.GameObjects.Sprite[],
        ) {
        if (humanMeleeDamage > 0) {
            const meleeSprite = orderedHumanBattlefieldDice.filter(dice => dice.name === "Melee")
            humanMeleeSidesBattlefield.push(...meleeSprite);
            if (aiMeleeDef > 0) {
                const defSprite = orderedAIBattlefieldDice.filter(dice => dice.name === "DefMelee" || "BlessedDefMelee")
                aiMeleeDefSidesBattlefield.push(...defSprite)
            }
        } else if (humanMeleeDamage === 0) {
            if (aiMeleeDef > 0) {
                const defSprite = orderedAIBattlefieldDice.filter(dice => dice.name === "DefMelee" || "BlessedDefMelee")
                aiMeleeDefSidesBattlefield.push(...defSprite)
            }
        }
    }
    

    public humanMeleeSideAnimation(humanMeleeSidesBattlefield: Phaser.GameObjects.Sprite[], aiMeleeDefSidesBattlefield: Phaser.GameObjects.Sprite[]){
        let humanStartX = 400;
        let aiStartX = 400;
        const espacoEntreDado = 50;
        //Animação organização dos dados
        humanMeleeSidesBattlefield.forEach((dices) => {
            this.scene.tweens.add({
                targets: dices.sprite,
                x: humanStartX,
                y: 400,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                    console.log('Animei')
                }
            })
            humanStartX += espacoEntreDado;
        })

        //ORGANIZAÇÃO DOS DADOS MELEE INIMIGA      
        aiMeleeDefSidesBattlefield.forEach((dices) => {
            this.scene.tweens.add({
                targets: dices.sprite,
                x: aiStartX,
                y: 300,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                    console.log('Animei')
                }
            })
            aiStartX += espacoEntreDado;
        })
    }

     public humanMeleeSideDamageCalc(humanMeleeDamage: number, humanMeleeSidesBattlefield: Phaser.GameObjects.Sprite[], aiMeleeDefSidesBattlefield: Phaser.GameObjects.Sprite[]) {
        console.log('dano:', humanMeleeDamage, 'vida:', this.aiHealth)
        this.aiHealth = this.aiHealth - humanMeleeDamage;
        humanMeleeSidesBattlefield.forEach(sprite => {
            sprite.sprite.destroy();
        })

        aiMeleeDefSidesBattlefield.forEach(sprite => {
            sprite.destroy();
        })
        humanMeleeSidesBattlefield = []
        aiMeleeDefSidesBattlefield = []
        
    }

    private static humanTotalDamage(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let totalDamage = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName === type) {
                totalDamage += 1;
            }
        }
        return totalDamage;
    }

    private static humanTotalDefense(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let totalDefense = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName === type) {
                totalDefense += 1;
            }
        }
        return totalDefense;
    }

    private static humanTotalThief(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let totalThief = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName === type) {
                totalThief += 1;
            }
        }
        return totalThief;
    }

    private static aiTotalDamage(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let totalDamage = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName === type) {
                totalDamage += 1;
            }
        }
        return totalDamage;
    }

    private static aiTotalDefense(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let aiTotalDefense = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName === type) {
                aiTotalDefense += 1;
            }
        }
        return aiTotalDefense;
    }

    private static aiTotalThief(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let totalThief = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName === type) {
                totalThief += 1;
            }
        }
        return totalThief;
    }

    private updateHealthText() {
        this.humanHealthText.setText(`Human Health: ${this.humanHealth}`);
        this.aiHealthText.setText(`AI Health: ${this.aiHealth}`);
        console.log('FUNCIONEI SOBRE A VIDA')
    }
}

