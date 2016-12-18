const IPFS = require('ipfs')
const config = require('../config.json')
const node = new IPFS(config.ipfsRepoPath)
const fs = require('fs')
const path = require('path')
console.log('success')
console.log('node', node)
//
const ipfsExists = function () {
}

function initIpfsIfRequired () {
  return new Promise((res, rej) => {
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
    return initIpfsIfRequired()
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
              if (!node.isOnline()) { throw 'IPFS is not connected' }

              node.id((err, id) => {
                if (err) { throw err }
                if (typeof id !== 'object' || !id.id) { throw 'unable to get ipfs node id' }
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
  },
  addFile: function (args) {
    return new Promise((res, rej) => {
      if (!node.isOnline()) { throw 'IPFS is not connected' }
      node.files.add({
        path: path.join('./', args.name),
        content: args.fileData
      }, (err, result) => {
        if (err) { throw err }
        if (typeof result !== 'object' || !result[0] || !result[0].hash) { throw 'empty response after adding file to ipfs' }
        res(result[0])
      })
    })
  }
}
