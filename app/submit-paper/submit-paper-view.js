const $ = require('jQuery')
const EventEmitter = require('events').EventEmitter
// util.inherits(Master, EventEmitter);
class SubmitPaperView extends EventEmitter {

  constructor () {
    super()
    $('#the-file-to-upload').on('click', () => {
      this.emit('clickSelectFile')
    })
  }

  showError(msg) {
    $('#status-bar').text(msg)
  }

  showUploadSuccess(args) {
    $('#error-div').hide()
    $('#upload-success-div').show()
    $('#upload-success-file-name').text(args.path)
    $('#upload-success-file-id').text(args.hash)
  }

  showUploadError(args) {
    $('#upload-success-div').hide()
    $('#error-div').show()
    $('#error-div').text(`Unable to share file ${args.path}`)
  }

  setPeers(numPeers) {
    $('#status-bar').text(`${numPeers} peers connected`)
  }
}
module.exports = new SubmitPaperView()
