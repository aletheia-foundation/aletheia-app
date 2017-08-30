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
    $('#account-div').text(`your aletheia blockchain account is "${accountHash}"`)
  }

  showEthereumBalance ({balance}) {
    $('#balance-div').text(`your aletheia goodwill balance is "${balance}"`)
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

  showTopUpMessage () {
    $('#topup-message').show()
  }

  setPeers (numPeers) {
    $('#status-bar').text(`${numPeers} alethia filesystem peers connected`)
  }

  setEthereumPeers (numPeers) {
    $('#status-bar-ethereum').text(`${numPeers} aletheia blockchain peers connected`)
  }
}
module.exports = new SubmitPaperView()
