require('dotenv').config()

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const token = process.env.TOKEN

export { apiKey, apiSecret, token }