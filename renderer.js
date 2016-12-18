// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
const {dialog} = require('electron').remote
const fs = require('fs')
const ipfsWrapper = require('./lib/ipfs-wrapper.js')

$('#upload-success-div').hide()

ipfsWrapper.init().then(() => {
  // ipfsWrapper.get('')
}).catch((err) => {
  console.error('IPFS error:', err)
})

$('#the-file-to-upload').on('click', () => {
  const filePath = dialog.showOpenDialog({properties: ['openFile']})
  if (typeof filePath !== 'object' || !filePath[0]) {
    console.log('Cannot read file: ', filePath)
    return
  }
  uploadFileToIpfs(filePath[0])
  .then((result) => {
    console.log('result')
    $('#upload-success-div').show()
    $('#upload-success-file-name').text(result.path)
    $('#upload-success-file-id').text(result.hash)
  })
  .catch((err) => {
    console.error(err)
    $('#error-div').show()
    $('#error-div').text(`Unable to add file +${filePath}`)
  })
})

function uploadFileToIpfs (filePath) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        throw {
          err: err
        }
      }
      console.log('file: ', data.length)
      ipfsWrapper.addFile({
        name: 'blah.jpg',
        fileData: data
      }).then((result) => {
        res(result)
      }).catch((err) => {
        console.error(err.stack)
        throw {
          err: err
        }
      })
    })
  })
}
