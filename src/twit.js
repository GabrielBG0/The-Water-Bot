const Twit = require('twit')

const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token: process.env.ATOKEN,
  access_token_secret: process.env.ATOKEN_SECRET

})

module.exports = T

