// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
const {dialog} = require('electron').remote
var fs = require('fs')
var ipfsWrapper = require('./lib/ipfs-wrapper.js')

ipfsWrapper.init().then(() => {
  console.log(ipfsWrapper.get)
})

$('#the-file-to-upload').on('click', () => {
  const filePath = dialog.showOpenDialog({properties: ['openFile']})
  console.log(filePath)
  if (typeof filePath !== 'object' || !filePath[0]) {
    console.log('Cannot read file: ', filePath)

    return
  }
  fs.readFile(filePath[0], function (err, data) {
    if (err) return console.log(err)
    console.log('file: ', data.length)
  })
})
