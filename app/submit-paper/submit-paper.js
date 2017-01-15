// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
const {dialog} = require('electron').remote
const fs = require('fs')
const ipfsClient = require('../common/ipfs-client.js')
ipfsClient.init({
  address: '/ip4/127.0.0.1/tcp/5001',
  statusPollIntervalMs: 10000
})
const statusBar = require('../common/status-bar.js')
ipfsClient.onNumPeersChange((err, numPeers) => {
  console.log('onNumPeersChange')

  if (err) {
    statusBar.setNoConnectionError()
    return
  }
  statusBar.setPeers(numPeers)
})

$('#error-div').hide()
$('#upload-success-div').hide()

$('#the-file-to-upload').on('click', () => {
  const filePath = dialog.showOpenDialog({properties: ['openFile']})
  if (typeof filePath !== 'object' || !filePath[0]) {
    console.log('Cannot read file: ', filePath)
    return
  }
  uploadFileToIpfs(filePath[0])
    .then((result) => {
      $('#upload-success-div').show()
      console.log(result)
      $('#upload-success-file-name').text(result.path)
      $('#upload-success-file-id').text(result.hash)
    })
    .catch((err) => {
      console.error(err)
      $('#error-div').show()
      $('#error-div').text(`Unable to add file ${filePath}`)
    })
})

function uploadFileToIpfs (filePath) {
  return new Promise((res, rej) => {
    ipfsClient.checkConnection()
    .then(() => {
      return ipfsClient.addFileFromPath({filePath: filePath})
    }).then((result) => {
      res(result)
    }).catch((err) => {
      console.error(err.stack)
      rej({
        err: err
      })
    })
  })
}
