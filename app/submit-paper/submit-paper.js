const submitPaperView = require('./submit-paper-view')
const IpfsClient = require('../common/ipfs-client')

const ipfsClient = new IpfsClient({
  address: '/ip4/127.0.0.1/tcp/5001',
  statusPollIntervalMs: 1000
})
const {dialog} = require('electron').remote;

ipfsClient.on('peer-update', (err, numPeers) => {
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

submitPaperView.on('clickSelectFile', () => {
  const filePath = dialog.showOpenDialog({properties: ['openFile']})

  if (typeof filePath !== 'object' || !filePath[0]) {
    submitPaperView.showError(`Cannot read file: ${filePath}`)
    return
  }
  const fileName = filePath[0].match(/[^/]+$/)

  ipfsClient.addFileFromPath({
    fileName,
    filePath: filePath[0]
  }).then((result)=>{
    if(typeof result === 'object' && result[0] && result[0].hash){
      submitPaperView.showUploadSuccess(result[0]);
    }
  }).catch( () => {
    submitPaperView.showUploadError({path: fileName})
  })
})
