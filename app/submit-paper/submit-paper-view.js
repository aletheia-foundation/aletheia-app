const $ = require('jQuery')
const EventEmitter = require('events').EventEmitter

class SubmitPaperView extends EventEmitter {

  constructor () {
    super()
    $('#the-file-to-upload').on('click', () => {
      this.emit('clickSelectFile')
    })
  }

  showError (msg) {
    $('#status-bar').text(msg)
  }

  showEthereumError (msg) {
    $('#status-bar-ethereum').text(msg)
  }

  showEthereumAccount ({accountHash}) {
    $('#account-div').text(`${accountHash}`)
  }

  showUploadInProgress ({transactionHash}) {
    $('#error-div').hide()
    $('#upload-success-div').show()
    $('#upload-success-div').text(`upload in progress, transactionId "${transactionHash}"`)
  }

  showUploadSuccess ({path, hash}) {
    $('#error-div').hide()
    $('#upload-success-div').show()
    $('#upload-success-div').text(`success! file: ${path} uploaded successfully, identifier: ${hash}`)
  }

  showUploadError ({path}) {
    $('#upload-success-div').hide()
    $('#error-div').show()
    $('#error-div').text(`Unable to share file ${path}`)
  }

  setPeers (numPeers) {
    $('#status-bar').text(`${numPeers}`)
  }

  setEthereumPeers (numPeers) {
    $('#status-bar-ethereum').text(`${numPeers}`)
  }
}
module.exports = new SubmitPaperView()
