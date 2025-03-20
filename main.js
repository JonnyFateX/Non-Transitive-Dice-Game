const {
    printOddsTable
} = require('./functions/help.js')

const {
    generateNumber
} = require('./functions/secure.js')

const {
    randomInt,
} = require('node:crypto')

const readlineSync = require('readline-sync')

let dices = process.argv.slice(2)
if(dices.length < 3){
    throw new Error("Not enough dices, this game requires at least 3 dices.")
}
for(let i = 0; i < dices.length; i++){
    if(dices[i].split(",").length !== 6){
        throw new Error("Every dice should contain 6 sides")
    }
    if(!(dices[i].split(",")).every(item => !isNaN(item) && typeof item === 'string')){
        throw new Error("Every dice should contain only numbers as sides")
    }
}

const globalDices = [...dices]
//Start of game and move selection
const {key, hmac, selection} = generateNumber(2)
const userTurnSelection = getUserSelection([
    "Let's determine who makes the first move.",
    "I selected a random value in the range 0..1 ",
    `(HMAC = ${hmac.toString("hex").toUpperCase()})`,
    "Try to guess my selection.",
],[0, 1])
console.log(`My selection: ${selection} (KEY=${key})`)

let computerDice
let userDice
if(userTurnSelection !== selection){ //Computer makes first move
    const diceSelection = randomInt(0, dices.length)
    computerDice = dices[diceSelection].split(",")
    console.log(`I make the first move and choose the [${computerDice}] dice.`)
    dices.splice(diceSelection, 1)
    userDice = dices[getUserSelection(["Choose your dice:"], dices)].split(",")
}else{ //User makes first move
    console.log("You make the first move")
    const userDiceIndex = getUserSelection(["Choose your dice:"], dices)
    userDice = dices.splice(userDiceIndex, 1).join("").split(",")
    console.log(`You choose the [${userDice}] dice.`)
    computerDice = dices[randomInt(0,dices.length)].split(",")
    console.log(`I choose the [${computerDice}] dice.`)
}

//Dice rolling
if(userTurnSelection !== selection){
    console.log("It's time for my roll.")
}else{
    console.log("It's time for your roll.")
}

const computerNumber = generateNumber(6)
const userNumber = getUserSelection([
    "I selected a random value in the range 0..5",
    `(HMAC = ${computerNumber.hmac.toString("hex").toUpperCase()})`,
    "Add your number modulo 6."
], [0,1,2,3,4,5])

console.log(`My number is ${computerNumber.selection} (KEY=${computerNumber.key})`)
console.log(`The fair number generation result is ${computerNumber.selection} + ${userNumber} = ${(computerNumber.selection + userNumber)%6} (mod 6).`)

let computerRolledNumber
let userRolledNumber
if(userTurnSelection !== selection){
    computerRolledNumber = computerDice[(computerNumber.selection + userNumber)%6]
    console.log(`My roll result is ${computerRolledNumber}.`)
    console.log("It's time for your roll.")
}else{
    userRolledNumber = userDice[(computerNumber.selection + userNumber)%6]
    console.log(`Your roll result is ${userRolledNumber}.`)
    console.log("It's time for my roll.")
}

//Dice rolling 2
const computerNumber2 = generateNumber(6)
const userNumber2 = getUserSelection([
    "I selected a random value in the range 0..5",
    `(HMAC = ${computerNumber2.hmac.toString("hex").toUpperCase()})`,
    "Add your number modulo 6."
], [0,1,2,3,4,5])

console.log(`My number is ${computerNumber2.selection} (KEY=${computerNumber2.key})`)
console.log(`The fair number generation result is ${computerNumber2.selection} + ${userNumber2} = ${(computerNumber2.selection + userNumber2)%6} (mod 6).`)

if(userTurnSelection !== selection){
    userRolledNumber = userDice[(computerNumber2.selection + userNumber2)%6]
    console.log(`Your roll result is ${userRolledNumber}.`)
}else{
    computerRolledNumber = computerDice[(computerNumber2.selection + userNumber2)%6]
    console.log(`My roll result is ${computerRolledNumber}.`)
}

//Results
if(userRolledNumber > computerRolledNumber){
    console.log(`You win (${userRolledNumber} > ${computerRolledNumber})`)
}else if(userRolledNumber === computerRolledNumber){
    console.log(`It's a tie (${userRolledNumber} = ${computerRolledNumber})`)
}else{
    console.log(`You lose (${userRolledNumber} < ${computerRolledNumber})`)
}

function getUserSelection(text, options){
    for(let i = 0; i < text.length; i++){
        console.log(text[i])
    }
    for(let i = 0; i < options.length; i++){
        console.log(`${i} - ${options[i]}`)
    }
    console.log("x - exit")
    console.log("? - help")
    const response = readlineSync.question('Your selection: ')
    if(response === "x"){
        process.exit()
    }else if(response === "?"){
        printOddsTable(globalDices)
        process.exit()
    }else if(parseInt(response) < options.length){
        return parseInt(response)
    }else{
        console.log("Selection not found, please restart game.")
        process.exit()
    }
}