module.exports = { printOddsTable }

var AsciiTable = require('ascii-table')
function printOddsTable(dices){
    console.log("Probability of the win for the user:")
    const odds = []
    for(let i = 0; i < dices.length; i++){//user dice loop
        const oddRow = []
        for(let j = 0; j < dices.length; j++){//oponent dice
            oddRow.push(getDiceProbability(dices[i].split(","), dices[j].split(",")))
        }
        odds.push(oddRow)
    }

    let table = new AsciiTable('Winning Odds')
    table.setHeading("User dice", ...dices)
    for(let i = 0; i < dices.length; i++){
        table.addRow(dices[i], ...odds[i])
    }
    console.log(table.toString())
}

function getDiceProbability(dice1, dice2){
    let winningScenarios = 0
    for(let i = 0; i < dice1.length; i++){
        for(let j = 0; j < dice2.length; j++){
            if(parseInt(dice1[i]) > parseInt(dice2[j])){
                winningScenarios++
            }
        }
    }
    return (winningScenarios/(dice1.length*dice2.length)).toFixed(4)
}