const $ = require('jquery')

function setError (message) {
  $('#status-bar').text(message)
  $('#status-bar').addClass('has-error')
  $('#status-bar').removeClass('has-success')
}

function setStatusOk (message) {
  $('#status-bar').text(message)
  $('#status-bar').addClass('has-success')
  $('#status-bar').removeClass('has-error')
}

module.exports = {
  setNoConnectionError: function () {
    setError('Unable to connect to IPFS. Start ipfs by running `ipfs daemon` in bash')
  },
  setPeers: function (numPeers) {
    if (numPeers > 0) {
      setStatusOk(`Conncected to the IPFS network with ${numPeers} peers`)
    } else {
      setError('Unable to connect to any IPFS peers')
    }
  }
}
