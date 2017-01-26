const ipfsClient = require('../common/ipfs-client')({
  address: '/ip4/127.0.0.1/tcp/5001',
  statusPollIntervalMs: 1000
})
const submitPaperView = require('./submit-paper-view')

ipfsClient.onNumPeersChange((err, numPeers)=>{
  if(err) {
    submitPaperView.showError('Error conecting to Aletheia gateway server')
  }
  else if(0 === numPeers) {
    submitPaperView.showError('No Alethia peers found')
  }
  else if(numPeers > 0){
    submitPaperView.setPeers(numPeers)
  }
})
ipfsClient.addFileFromPath({filePath: './test/data/spacer.gif'
})
