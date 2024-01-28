import Phaser from "phaser";

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

        const finalOrderedHumanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
        const finalOrderedAIBattlefieldDice: Phaser.GameObjects.Sprite[] = [];

        let humanMeleeSidesBattlefield: Phaser.GameObjects.Sprite[] = [];
        let aiMeleeDefSidesBattlefield: Phaser.GameObjects.Sprite[] = [];

        console.log('AI como vc vem pra mim?', aiBattlefieldDice)
        console.log('HUMAN como vc vem pra mim?', humanBattlefieldDice)

        for (const category of order) {
            const humanCategorySprites = humanBattlefieldDice.filter(dice => dice.name === category);
            orderedHumanBattlefieldDice.push(...humanCategorySprites);

            const aiCategorySprites = aiBattlefieldDice.filter(dice => dice.name === category);
            orderedAIBattlefieldDice.push(...aiCategorySprites)
        }

        console.log('Dados humanos organizados:', orderedHumanBattlefieldDice)
        console.log('Dados AI organizados:', orderedAIBattlefieldDice)

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

        const humanMeleeDifference = humanMeleeDamage - aiMeleeDef;
        const humanRangedDifference = humanRangedDamage - aiRangedDef;
        const aiMeleeDifference = aiMeleeDamage - humanMeleeDef;
        const aiRangedDifference = aiRangedDamage - humanRangedDef;

        let blankSprite;

        //Organização dos lados melee
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

        console.log('dano:', humanMeleeDamage, 'vida:', this.aiHealth)
        this.aiHealth = this.aiHealth - humanMeleeDamage;
        this.updateHealthText();
        humanMeleeSidesBattlefield.forEach(sprite => {
            sprite.sprite.destroy();
        })

        aiMeleeDefSidesBattlefield.forEach(sprite => {
            sprite.destroy();
        })
        humanMeleeSidesBattlefield = []
        aiMeleeDefSidesBattlefield = []
    }

    // public resolveDuel(humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [], aiBattlefieldDice: Phaser.GameObjects.Sprite[] = []) {
    //     const humanMeleeDamage = BattleManager.humanTotalDamage(humanBattlefieldDice, "Melee");
    //     const humanRangedDamage = BattleManager.humanTotalDamage(humanBattlefieldDice, "Ranged");

    //     const humanMeleeDef = BattleManager.humanTotalDefense(humanBattlefieldDice, "DefMelee");
    //     const humanRangedDef = BattleManager.humanTotalDefense(humanBattlefieldDice, "DefRanged");

    //     const aiMeleeDamage = BattleManager.aiTotalDamage(aiBattlefieldDice, "Melee");
    //     const aiRangedDamage = BattleManager.aiTotalDamage(aiBattlefieldDice, "Ranged");

    //     const aiMeleeDef = BattleManager.aiTotalDefense(aiBattlefieldDice, "DefMelee");
    //     const aiRangedDef = BattleManager.aiTotalDefense(aiBattlefieldDice, "DefRanged");

    //     const humanMeleeDifference = humanMeleeDamage - aiMeleeDef;
    //     const humanRangedDifference = humanRangedDamage - aiRangedDef;
    //     const aiMeleeDifference = aiMeleeDamage - humanMeleeDef;
    //     const aiRangedDifference = aiRangedDamage - humanRangedDef;

    //     BattleManager.applyDamageToIA(this, humanMeleeDifference, humanRangedDifference);
    //     BattleManager.applyDamageToHuman(this, aiMeleeDifference, aiRangedDifference);

    //     console.log('Total de ataque humano melee:', humanMeleeDamage)
    //     console.log('totalde ataque ai melee:', aiMeleeDamage)

    //     console.log("Differences - Human Melee:", humanMeleeDifference, "Ranged:", humanRangedDifference);
    //     console.log("Differences - AI Melee:", aiMeleeDifference, "Ranged:", aiRangedDifference);

    //     console.log("EUREKAAAAAA");
    //     this.updateHealthText();
    // }

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

    private static applyDamageToIA(instance: BattleManager, meleeDamage: number, rangedDamage: number) {
        const meleeDamageToIA = Math.max(0, meleeDamage);
        const rangedDamageToIA = Math.max(0, rangedDamage);

        const totalDamageToIA = meleeDamageToIA + rangedDamageToIA;
        BattleManager.reduceIAHealth(instance, totalDamageToIA);
    }

    private static applyDamageToHuman(instance: BattleManager, meleeDamage: number, rangedDamage: number) {
        const meleeDamageToHuman = Math.max(0, meleeDamage);
        const rangedDamageToHuman = Math.max(0, rangedDamage);

        const totalDamageToHuman = meleeDamageToHuman + rangedDamageToHuman;
        BattleManager.reduceHumanHealth(instance, totalDamageToHuman);
    }

    private static reduceIAHealth(instance: BattleManager, damage: number) {
        instance.aiHealth -= damage;
        console.log(`IA perdeu ${damage} pontos de vida. Vida atual: ${instance.aiHealth}`);
        // Lógica adicional conforme necessário, como verificar se a IA foi derrotada
    }

    private static reduceHumanHealth(instance: BattleManager, damage: number) {
        instance.humanHealth -= damage;
        console.log(`Humano perdeu ${damage} pontos de vida. Vida atual: ${instance.humanHealth}`);
        // Lógica adicional conforme necessário, como verificar se o humano foi derrotado
    }

    public updateHealthText() {
        this.humanHealthText.setText(`Human Health: ${this.humanHealth}`);
        this.aiHealthText.setText(`AI Health: ${this.aiHealth}`);
        console.log('FUNCIONEI SOBRE A VIDA')
    }
}
