const {
    createHmac,
    generateKeySync,
    randomInt,
} = require('node:crypto')

function generateNumber(range){
    const key = generateKeySync('hmac', { length: 256 }).export().toString('hex').toUpperCase()
    const selection = randomInt(0, range)
    const hmac = createHmac('sha256', key).update(selection.toString()).digest("base16")
    return {
        key: key,
        hmac: hmac,
        selection: selection
    }
}

module.exports = { generateNumber }