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

        if (humanMeleeDamage > 0) {
            const meleeSprite = orderedHumanBattlefieldDice.filter(dice => dice.name === "Melee")
            finalOrderedHumanBattlefieldDice.push(...meleeSprite);
            if (aiMeleeDef > humanMeleeDamage) {
                const aiMeleeDefSubHumanMeleeDamage = aiMeleeDef - humanMeleeDamage
                console.log('Resultado dessa equação:', aiMeleeDefSubHumanMeleeDamage)
                blankSprite = this.createBlankSpritesArray(aiMeleeDefSubHumanMeleeDamage)
                console.log('Array com espaco em branco sendo criado', blankSprite)
            }
            finalOrderedHumanBattlefieldDice.push(...blankSprite); 
            blankSprite = [];
            console.log('Array final com espaco em branco sendo criado', finalOrderedHumanBattlefieldDice)
        }

        if (humanRangedDamage > 0) {
            const rangedSprite = orderedHumanBattlefieldDice.filter(dice => dice.name === "Ranged" || "BlessedRanged")
            finalOrderedHumanBattlefieldDice.push(...rangedSprite);
            // if (aiRangedDef > humanRangedDamage) {
            //     for (let i = 0; i < aiRangedDifference; i++) {
            //         finalOrderedHumanBattlefieldDice.push(...blankSprite);
            //     }
            // }
        }

        if (humanThief > 0) {
            const thiefSprite = orderedHumanBattlefieldDice.filter(dice => dice.name === "Thief" || "BlessedThief")
            for (let i = 0; i < humanThief; i++) {
                finalOrderedHumanBattlefieldDice.push(thiefSprite);
                // finalOrderedAIBattlefieldDice.push(blankSprite)
            }
        }

        if (aiThief > 0) {
            const thiefSprite = orderedAIBattlefieldDice.filter(dice => dice.name === "Thief" || "BlessedThief")
            for (let i = 0; i < humanThief; i++) {
                finalOrderedAIBattlefieldDice.push(thiefSprite);
                // finalOrderedHumanBattlefieldDice.push(blankSprite)
            }
        }

        if (aiMeleeDamage > 0) {
            const meleeSprite = orderedAIBattlefieldDice.filter(dice => dice.name === "Melee")
            for (let i = 0; i < aiMeleeDamage; i++) {
                finalOrderedAIBattlefieldDice.push(meleeSprite);
            }
            // if (humanMeleeDef > aiMeleeDamage) {
            //     for (let i = 0; i < humanMeleeDifference; i++) {
            //         finalOrderedAIBattlefieldDice.push(blankSprite);
            //     }
            // }
        }

        if (aiRangedDamage > 0) {
            const rangedSprite = orderedAIBattlefieldDice.filter(dice => dice.name === "Ranged" || "BlessedRanged")
            for (let i = 0; i < aiRangedDamage; i++) {
                finalOrderedAIBattlefieldDice.push(rangedSprite);
            }
            // if (humanRangedDef > aiRangedDamage) {
            //     for (let i = 0; i < humanRangedDifference; i++) {
            //         finalOrderedAIBattlefieldDice.push(blankSprite);
            //     }
            // }
        }

        console.log('array HumanfinalOrderBattlefieldDice:', finalOrderedHumanBattlefieldDice)
        console.log('array aifinalOrderBattlefieldDice:', finalOrderedAIBattlefieldDice)
        console.log('humanMeleeDiff:', humanMeleeDifference)


        let humanStartX = 400;
        let humanStartY = 400

        let aiStartX = 400;
        const aiStartY = 300;
        const espacoEntreDado = 50;
        //Animação organização dos dados
        orderedHumanBattlefieldDice.forEach((dices) => {
            const endX = humanStartX
            const endY = humanStartY
            this.scene.tweens.add({
                targets: dices.sprite,
                x: endX,
                y: endY,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                    console.log('Animei')
                }
            })
            humanStartX += espacoEntreDado;
        })

        //ORGANIZAÇÃO DOS DADOS MELEE INIMIGA      
        orderedAIBattlefieldDice.forEach((dices) => {
            const endX = humanStartY
            const endY = aiStartY
            this.scene.tweens.add({
                targets: dices.sprite,
                x: endX,
                y: endY,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                    console.log('Animei')
                }
            })
            humanStartY += espacoEntreDado;
        })
    }

    public resolveDuel(humanBattlefieldDice: Phaser.GameObjects.Sprite[] = [], aiBattlefieldDice: Phaser.GameObjects.Sprite[] = []) {
        const humanMeleeDamage = BattleManager.humanTotalDamage(humanBattlefieldDice, "Melee");
        const humanRangedDamage = BattleManager.humanTotalDamage(humanBattlefieldDice, "Ranged");

        const humanMeleeDef = BattleManager.humanTotalDefense(humanBattlefieldDice, "DefMelee");
        const humanRangedDef = BattleManager.humanTotalDefense(humanBattlefieldDice, "DefRanged");

        const aiMeleeDamage = BattleManager.aiTotalDamage(aiBattlefieldDice, "Melee");
        const aiRangedDamage = BattleManager.aiTotalDamage(aiBattlefieldDice, "Ranged");

        const aiMeleeDef = BattleManager.aiTotalDefense(aiBattlefieldDice, "DefMelee");
        const aiRangedDef = BattleManager.aiTotalDefense(aiBattlefieldDice, "DefRanged");

        const humanMeleeDifference = humanMeleeDamage - aiMeleeDef;
        const humanRangedDifference = humanRangedDamage - aiRangedDef;
        const aiMeleeDifference = aiMeleeDamage - humanMeleeDef;
        const aiRangedDifference = aiRangedDamage - humanRangedDef;

        BattleManager.applyDamageToIA(this, humanMeleeDifference, humanRangedDifference);
        BattleManager.applyDamageToHuman(this, aiMeleeDifference, aiRangedDifference);

        console.log('Total de ataque humano melee:', humanMeleeDamage)
        console.log('totalde ataque ai melee:', aiMeleeDamage)

        console.log("Differences - Human Melee:", humanMeleeDifference, "Ranged:", humanRangedDifference);
        console.log("Differences - AI Melee:", aiMeleeDifference, "Ranged:", aiRangedDifference);

        console.log("EUREKAAAAAA");
        this.updateHealthText();
    }

    createBlankSpritesArray(count: number): Phaser.GameObjects.Rectangle[] {
        const blankSprites: Phaser.GameObjects.Rectangle[] = [];

        for (let i = 0; i < count; i++) {
            const newBlankSprite = this.scene.add.rectangle(0, 0, 90, 90, 0xffffff, 0);
            blankSprites.push(newBlankSprite);
        }
        return blankSprites;
    }

    private static humanTotalDamage(battlefieldDice: Phaser.GameObjects.Sprite[], type: string): number {
        let totalDamage = 0;

        for (const diceInfo of battlefieldDice) {
            const diceSprite = diceInfo.sprite;
            const diceName = diceSprite.texture.key;

            if (diceName.includes(type) && !diceName.includes("Def")) {
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

            if (diceName.includes(type)) {
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

            if (diceName.includes(type)) {
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

            if (diceName.includes(type)) {
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

            if (diceName.includes(type)) {
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

            if (diceName.includes(type)) {
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
