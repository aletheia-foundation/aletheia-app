const ipfsAPI = require('ipfs-api')
window.ipfsClient = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

ipfsClient.swarm.peers().then((result) => {
  statusBar.setPeers(result.length)
}).catch((e) => {
  console.error(e, e.stack)
  // update view.
  statusBar.setNoConnectionError()
})
module.exports = {
  ipfsClient: ipfsClient
}
