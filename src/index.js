require('dotenv').config()
const fs = require('fs')
const twit = require('./twit')
const PORT = process.env.PORT || 1

function getMentions(lastIdSeen) {
  return new Promise((resolve, reject) => {
    twit.get('statuses/mentions_timeline', { since_id: lastIdSeen }, (err, data, response) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

function postResponse(tweetId) {
  return new Promise((resolve, reject) => {
    twit.post('statuses/update', { status: 'isso é um teste', in_reply_to_status_id: tweetId, auto_populate_reply_metadata: 'true' }, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

async function getLastSeenId() {
  if (fs.existsSync('lastId.txt')) {
    return await parseInt(fs.readFileSync('lastId.txt'))
  }
  return 1
}

async function main() {
  var lastIdSeen = await getLastSeenId()
  var newlastIdSeen
  try {
    const data = await getMentions(lastIdSeen)
    for await (const [index, tweet] of data.entries()) {
      if (index == 0) {
        newlastIdSeen = tweet.id.toString()
      }
      if (tweet.id != lastIdSeen) {
        try {
          console.log(tweet.text)
          await postResponse(tweet.id_str)
        } catch (e) {
          console.log('não foi possivel responder ao tweet ' + tweet.id_str)
        }
      }
    }
    fs.writeFileSync('lastId.txt', newlastIdSeen)
  } catch (e) {
    console.error(e)
  }
}

console.log('Starting twitter bot ...')

setInterval(main, 10000)