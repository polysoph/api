
const low = require('lowdb')
const fs = require('lowdb/file-async')
const config = require('./config')

const store = {
  storage: { read: fs.read }
}

/**
 * Export `db`
 */
module.exports = low(config.paths.root + '/db.json', store)
