const $ = require('jQuery')

module.exports = {
  showError: function(msg) {
    $('#status-bar').text(msg)
  }
  setPeers: function(numPeers) {
    $('#status-bar').text(`Connected`)

  }
}
