const dotenv = require('dotenv')
dotenv.config()

const { AKIO } = require('./src/Structures/Bot')

new AKIO().init()
