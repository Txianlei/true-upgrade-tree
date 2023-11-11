addLayer("b", {
    name: "b", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#0000FF",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "basic", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        exp = new ExpantaNum(0.25)
        if (hasUpgrade("b",42)) exp = exp.add(0.05)
        if (hasUpgrade("p",12)) exp = exp.add(0.03)
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("b",12)) mult = mult.times(2)
        if (hasMilestone("p",0)) mult = mult.times(2)
        if (hasUpgrade("b",14)&&!(inChallenge("b",22)||inChallenge("b",31))) mult = mult.times(upgradeEffect("b",14))
        if (hasUpgrade("b",22)) mult = mult.times(upgradeEffect("b",22))
        if (hasUpgrade("b",41)) mult = mult.times(buyableEffect("b",11).pow(0.3))
        if (getBuyableAmount("b",12).gte(1)) mult = mult.times(buyableEffect("b",12))
        if (hasUpgrade("p",11)) mult = mult.times(2)
        if (hasUpgrade("p",14)) mult = mult.times(15)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        pow = new ExpantaNum(1)
        if (hasUpgrade("b",32)) pow = pow.times(1.5)
        return pow
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for basic", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() {
        rate = new ExpantaNum(0)
        if (hasMilestone("p",3)) rate = 1
        return rate
    },
    doReset(resettingLayer) {
        let keep = []
        if (resettingLayer == "p" && hasMilestone("p",0)) keep.push("upgrades")
        if (resettingLayer == "p" && hasMilestone("p",1)) keep.push("buyables")
        if (resettingLayer == "p" && hasMilestone("p",2)) keep.push("challenges")

        if (layers[resettingLayer].row > this.row) layerDataReset("b", keep)
    },
    upgrades:{
        row:10,
        column:5,
        11:{
            title:"#0",
            description:"Gain x2 points.",
            cost:()=>new ExpantaNum(1),
            unlocked() {
                return true
            }
        },
        12:{
            title:"#1",
            description:"Gain x2 basics.",
            cost:()=>new ExpantaNum(4),
            unlocked() {
                return hasUpgrade("b",11)
            }
        },
        13:{
            title:"#2",
            description:"Boost point gain based on basics.",
            effect:()=>player.b.points.add(1).pow(0.35).pow(hasUpgrade("b",23) ? 1.2 : 1).floor().min(new ExpantaNum("1e3000")),
            cost:()=>new ExpantaNum(6),
            effectDisplay:()=>{return `x${upgradeEffect("b",13)}`},
            unlocked() {
                return hasUpgrade("b",12)
            }
        },
        14:{
            title:"#3",
            description:"Boost basic gain based on points.",
            effect:()=>player.points.add(1).pow(0.4).pow(0.6).pow(hasUpgrade("b",24) ? 1.2 : 1).floor().min(new ExpantaNum("1e3000")),
            cost:()=>new ExpantaNum(25),
            effectDisplay:()=>{return `x${upgradeEffect("b",14)}`},
            unlocked() {
                return hasUpgrade("b",13)
            }
        },
        15:{
            title:"#4",
            description:"Unlock a basic challenge.",
            cost:()=>new ExpantaNum(50),
            unlocked() {
                return hasUpgrade("b",13)
            }
        },
        21:{
            title:"#5",
            description:"Point boosts itself.",
            cost:()=>new ExpantaNum(150),
            effect:()=>hasUpgrade("b",44) ? player.points.add(1).ln().pow(hasUpgrade("b",33) ? 1.2 : 1).floor().add(1).min(new ExpantaNum("1e3000")):player.points.add(1).log10().pow(hasUpgrade("b",33) ? 1.2 : 1).floor().add(1).min(new ExpantaNum("1e3000")),
            effectDisplay:()=>{return `x${upgradeEffect("b",21)}`},
            unlocked() {
                return hasChallenge("b",11)
            }
        },
        22:{
            title:"#6",
            description:"Basic boosts itself.",
            cost:()=>new ExpantaNum(500),
            effect:()=>hasUpgrade("b",45) ? player.points.add(1).ln().pow(hasUpgrade("b",33) ? 1.2 : 1).floor().add(1).min(new ExpantaNum("1e3000")):player.b.points.add(1).log10().add(1).pow(0.75).pow(hasUpgrade("b",34) ? 1.2 : 1).floor().min(new ExpantaNum("1e3000")),
            effectDisplay:()=>{return `x${upgradeEffect("b",22)}`},
            unlocked() {
                return hasUpgrade("b",21)
            }
        },
        23:{
            title:"#7",
            description:"Basic upgrade #2 is raised to ^1.2",
            cost:()=>new ExpantaNum(700),
            unlocked() {
                return hasUpgrade("b",22)
            }
        },
        24:{
            title:"#8",
            description:"Basic upgrade #3 is raised to ^1.2",
            cost:()=>new ExpantaNum(1000),
            unlocked() {
                return hasUpgrade("b",23)
            }
        },
        25:{
            title:"#9",
            description:"Unlock a basic challenge.",
            cost:()=>new ExpantaNum(2000),
            unlocked() {
                return hasUpgrade("b",24)
            }
        },
        31:{
            title:"#10",
            description:"Point gain is raised to ^1.5",
            cost:()=>new ExpantaNum(8000),
            unlocked() {
                return hasChallenge("b",12)
            }
        },
        32:{
            title:"#11",
            description:"Basic gain is raised to ^1.5",
            cost:()=>new ExpantaNum(20000),
            unlocked() {
                return hasUpgrade("b",31)
            }
        },
        33:{
            title:"#12",
            description:"Basic upgrade #5 is raised to ^1.2",
            cost:()=>new ExpantaNum(1e10),
            unlocked() {
                return hasUpgrade("b",32)
            }
        },
        34:{
            title:"#13",
            description:"Basic upgrade #6 is raised to ^1.2",
            cost:()=>new ExpantaNum(1e12),
            unlocked() {
                return hasUpgrade("b",33)
            }
        },
        35:{
            title:"#14",
            description:"Unlock a basic challenge.",
            cost:()=>new ExpantaNum("2e12"),
            unlocked() {
                return hasUpgrade("b",34)
            }
        },
        41:{
            title:"#15",
            description:"\"point boost I\" also affects basic gain with a reduced effect.",
            cost:()=>new ExpantaNum("1e16"),
            unlocked() {
                return hasChallenge("b",21)
            }
        },
        42:{
            title:"#16",
            description:"Add 0.05 to basic gain base.",
            cost:()=>new ExpantaNum("1e37"),
            unlocked() {
                return hasUpgrade("b",41)
            }
        },
        43:{
            title:"#17",
            description:"Unlock a basic challenge.",
            cost:()=>new ExpantaNum("1e140"),
            unlocked() {
                return hasUpgrade("b",42)
            }
        },
        43:{
            title:"#18",
            description:"Unlock a basic challenge.",
            cost:()=>new ExpantaNum("1e140"),
            unlocked() {
                return hasUpgrade("b",42)
            }
        },
        44:{
            title:"#19",
            description:"Point upgrade #5's formula is better.",
            cost:()=>new ExpantaNum("1e143"),
            unlocked() {
                return hasChallenge("b",31)
            }
        },
        45:{
            title:"#20",
            description:"Point upgrade #6's formula is better. Unlock prestige!",
            cost:()=>new ExpantaNum("1e144"),
            unlocked() {
                return hasUpgrade("b",44)
            }
        },
        51:{
            title:"#21",
            description:"Gain x4 points.",
            cost:()=>new ExpantaNum("1e150"),
            unlocked() {
                return hasMilestone("p",1)
            }
        },
        52:{
            title:"#22",
            description:"Gain x4 basics.",
            cost:()=>new ExpantaNum("1e155"),
            unlocked() {
                return hasUpgrade("b",51)
            }
        },
    },
    challenges:{
        row:10,
        column:2,
        11:{
            name:"Pointless I",
            challengeDescription:"Point gain is divided by 100",
            goalDescription:`${new ExpantaNum(20)} points.`,
            canComplete:()=>player.points.gte(20),
            rewardDescription:"Double point gain, unlock a basic upgrade.",
            unlocked() {
                return hasUpgrade("b",15)
            }
        },
        12:{
            name:"Pointless II",
            challengeDescription:"Point gain is divided by 666",
            goalDescription:`${new ExpantaNum(35)} points.`,
            canComplete:()=>player.points.gte(35),
            rewardDescription:"Triple point gain, unlock a basic upgrade.",
            unlocked() {
                return hasUpgrade("b",25)
            }
        },
        21:{
            name:"Pointless III",
            challengeDescription:"Point gain is raised to ^0.3",
            goalDescription:`${new ExpantaNum(30000)} points.`,
            canComplete:()=>player.points.gte(30000),
            rewardDescription:"Unlock a basic buyable and a basic upgrade.",
            unlocked() {
                return hasUpgrade("b",35)
            }
        },
        22:{
            name:"Upgradeless I",
            challengeDescription:"Point upgrade #2, #3 are useless.",
            goalDescription:`${new ExpantaNum(1e50)} points.`,
            canComplete:()=>player.points.gte(1e50),
            rewardDescription:"Unlock a basic buyable and a basic challenge.",
            unlocked() {
                return hasUpgrade("b",43)
            }
        },
        31:{
            name:"Basic challenge pack",
            challengeDescription:"Run \"Pointless I\",\"Pointless II\",\"Pointless III\" and \"Upgradeless I\".",
            goalDescription:`${new ExpantaNum(1e15)} points.`,
            canComplete:()=>player.points.gte(1e15),
            rewardDescription:"Unlock a basic upgrade.",
            unlocked() {
                return hasChallenge("b",22)
            }
        },
        32:{
            name:"Pointless IV",
            challengeDescription:"Point gain is raised to ^0.111",
            goalDescription:`${new ExpantaNum(1e32)} points.`,
            canComplete:()=>player.points.gte(1e32),
            rewardDescription:"Unlock a prestige upgrade.",
            unlocked() {
                return hasUpgrade("p",15)
            }
        },
    },
    buyables:{
        11:{
            title:"Point boost I",
            cost(x) { return new ExpantaNum(1e12).times(x.add(1).pow(2+x)) },
            display() { return `Multiply point gain by ${new ExpantaNum(this.effect()).floor()}<br>
            cost:${new ExpantaNum(this.cost()).floor()} basics` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasChallenge("b",21)
            },
            effect(x) { return new ExpantaNum(10).pow(x).pow(1+x/10).pow(1+x/20)},
            purchaseLimit:10
        },
        12:{
            title:"Basic boost I",
            cost(x) { return new ExpantaNum(1e130).pow(1+x/8) },
            display() { return `Multiply basic gain by ${new ExpantaNum(this.effect()).floor()}<br>
            cost:${new ExpantaNum(this.cost()).floor()} basics` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasChallenge("b",22)
            },
            effect(x) { return new ExpantaNum(3).pow(x).pow(1+x/50).pow(1+x/100)},
            purchaseLimit:10
        }
    }
}),
addLayer("p", {
    name: "p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    color: "#03FF03",
    branches:["b"],
    requires: new ExpantaNum("1e150"), // Can be a function that takes requirement increases into account
    resource: "prestige point", // Name of prestige currency
    baseResource: "basic", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        exp = new ExpantaNum(0.05)
        if (hasUpgrade("p",24)) exp = exp.add(0.01)
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p",21)) mult = mult.times(3)
        if (hasUpgrade("p",22)) mult = mult.times(upgradeEffect("p",22))
        if (hasUpgrade("p",23)) mult = mult.times(upgradeEffect("p",23))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        pow = new ExpantaNum(1)
        return pow
    },
    effectBase() {
        let base = new ExpantaNum(0.8);
        return base.pow(tmp.p.power);
    },
    power() {
        let power = new ExpantaNum(1);
        return power;
    },
    effect() {
        return ExpantaNum.pow(player.p.points,tmp.p.effectBase).add(1).max(0);
    },
    effectDescription() {
        return "which are boosting Point generation by "+tmp.p.effect.floor()+"x"
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("b",45) || player.p.unlocked},
    milestones:{
        0:{
            requirementDescription: "100 Prestige points",
            effectDescription: "Basic upgrades doesn't reset on prestige.",
            done() {return player.p.points.gte(100)}
        },
        1:{
            requirementDescription: "4000 Prestige points",
            effectDescription: "Basic buyables doesn't reset on prestige. Unlock a basic upgrade.",
            done() {return player.p.points.gte(4000)}
        },
        2:{
            requirementDescription: "90000 Prestige points",
            effectDescription: "Basic challenges doesn't reset on prestige.",
            done() {return player.p.points.gte(90000)}
        },
        3:{
            requirementDescription: "200000 Prestige points",
            effectDescription: "Auto generate basics.",
            done() {return player.p.points.gte(200000)}
        }
    },
    upgrades:{
        row:10,
        column:5,
        11:{
            title:"Prestige #0",
            description:"Double gain of all previous resources(points and basics).",
            cost:new ExpantaNum(1),
            unlocked() {
                return player.p.unlocked
            }
        },
        12:{
            title:"Prestige #1",
            description:" Add 0.03 to basic gain base.",
            cost:new ExpantaNum(100),
            unlocked() {
                return player.p.unlocked
            }
        },
        13:{
            title:"Prestige #2",
            description:"Gain x20 points.",
            cost:new ExpantaNum(1000),
            unlocked() {
                return player.p.unlocked
            }
        },
        14:{
            title:"Prestige #3",
            description:"Gain x15 basics.",
            cost:new ExpantaNum(10000),
            unlocked() {
                return player.p.unlocked
            }
        },
        15:{
            title:"Prestige #4",
            description:"Point gain is raised to ^1.1. Unlock a basic challenge.",
            cost:new ExpantaNum(1e6),
            unlocked() {
                return player.p.unlocked
            }
        },
        21:{
            title:"Prestige #5",
            description:"Gain x3 prestige points.",
            cost:new ExpantaNum(1e6),
            unlocked() {
                return hasChallenge("b",32)
            }
        },
        22:{
            title:"Prestige #6",
            description:"Gain more prestige points based on your points.",
            effect() {return player.points.add(1).log10().add(1).ln().add(1).min(new ExpantaNum("1e3000"))},
            cost:new ExpantaNum(5e6),
            effectDisplay:()=>{return `x${upgradeEffect("p",22)}`},
            unlocked() {
                return hasUpgrade("b",21)
            }
        },
        23:{
            title:"Prestige #7",
            description:"Gain more prestige points based on your basics.",
            effect() {return player.points.add(1).ln().add(1).ln().add(1).min(new ExpantaNum("1e3000"))},
            effectDisplay:()=>{return `x${upgradeEffect("p",23)}`},
            cost:new ExpantaNum(1e8),
            unlocked() {
                return hasUpgrade("b",21)
            }
        },
        24:{
            title:"Prestige #8",
            description:"Add 0.01 to prestige gain base.",
            cost:new ExpantaNum(1e9),
            unlocked() {
                return hasUpgrade("b",21)
            }
        },
        25:{
            title:"Prestige #9",
            description:"Unlock a prestige challenge.",
            cost:new ExpantaNum(1e11),
            unlocked() {
                return hasUpgrade("b",21)
            }
        },
    }
})
