const IPFS = require('ipfs')
const config = require('../config.json')
const node = new IPFS(config.ipfsRepoPath)
const fs = require('fs')
console.log('success')
console.log('node', node)
//
const ipfsExists = function () {
}

function initRepo () {
  return new Promise((res, rej) => {
    // shouldn't have to do this

    fs.access(config.ipfsRepoPath, fs.F_OK, function (err) {
      if (err) {
        // err means that the directory doesn't exist
        // create a new ipfs repo
        node.init({ emptyRepo: true, bits: 2048 }, (err) => {
          if (err) { throw err }
          res(node)
        })
      } else {
        res(node)
      }
    })
  })
}

module.exports = {
  init: function () {
    return initRepo()
      .then(() => {
        return new Promise((res, rej) => {
          // Once the repo is initiated, we have to load it so that the IPFS
          // instance has its config values. This is useful when you have
          // previous created repos and you don't need to generate a new one
          node.load((err) => {
            if (err) { throw err }
              // Last but not the least, we want our IPFS node to use its peer
              // connections to fetch and serve blocks from.
            node.goOnline((err) => {
              if (err) { throw err }
                // Here you should be good to go and call any IPFS function
              node.id((err, id) => {
                if (err) { throw err }
                console.log('ipfs is online with id:', id)
                res(id)
              })
            })
          })
        })
      })
      .catch((err) => {
        console.error(err)
        throw err
      })
  }
}
