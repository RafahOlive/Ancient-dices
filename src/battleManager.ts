export class BattleManager {
    public humanHealth: number = 20;
    public aiHealth: number = 20;

    public humanHealthText: Phaser.GameObjects.Text;
    public aiHealthText: Phaser.GameObjects.Text;

    public organizeBattlefieldDices(humanBattlefieldDice: Phaser.GameObjects.Sprite[] = []): Phaser.GameObjects.Sprite[] {
        console.log('COMO ESSA MERDA TA VINDO PRA MIM?:', humanBattlefieldDice);
        const categories = ["Melee", "Ranged", "BlessedRanged", "DefMelee", "BlessedDefMelee", "DefRanged", "BlessedDefRanged", "Thief", "BlessedThief"];

        const tempHumanDiceArrays: Record<string, Phaser.GameObjects.Sprite[]> = {};
        categories.forEach(category => tempHumanDiceArrays[category] = []);
        console.log('Conteúdo original de tempHumanDiceArrays:', tempHumanDiceArrays);


        for (const diceInfo of humanBattlefieldDice) {
            const diceSprite = diceInfo;
            console.log('Valor de diceSprite:', diceSprite);
            console.log('Valor de diceSprite.texture:', diceSprite.texture);
            console.log('Valor de diceSprite.texture.key:', diceSprite.texture.key);

            if (diceSprite && diceSprite.texture && diceSprite.texture.key) {
                categories.forEach(category => {
                    if (diceSprite.texture.key === category) {
                        tempHumanDiceArrays[category].push(diceSprite);
                        console.log('Após o preenchimento de tempHumanDiceArrays:', tempHumanDiceArrays);
                    }
                });
            }
        }
        const newHumanBattlefieldDice: Phaser.GameObjects.Sprite[] = [];
        categories.forEach(category => {
            newHumanBattlefieldDice.push(...tempHumanDiceArrays[category].slice());
            console.log('Após criar newHumanBattlefieldDice:', newHumanBattlefieldDice);
        });

        console.log('Funcionei, dados organizados:', newHumanBattlefieldDice);

        return newHumanBattlefieldDice;
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

        console.log("Differences - Human Melee:", humanMeleeDifference, "Ranged:", humanRangedDifference);
        console.log("Differences - AI Melee:", aiMeleeDifference, "Ranged:", aiRangedDifference);

        console.log("EUREKAAAAAA");
        this.updateHealthText();
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
