const submitPaperView = require('./submit-paper-view')
const ipfsClient = require('../common/ipfs-client')({
  address: '/ip4/127.0.0.1/tcp/5001',
  statusPollIntervalMs: 1000
})
const {dialog} = require('electron').remote;

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

submitPaperView.on('clickSelectFile', (a) => {
  const filePath = dialog.showOpenDialog({properties: ['openFile']})

  if (typeof filePath !== 'object' || !filePath[0]) {
    console.log('Cannot read file: ', filePath)
    submitPaperView.showError(`Cannot read file: ${filePath}`)
    return
  }
  const fileName = filePath[0].match(/[^/]+$/)

  ipfsClient.addFileFromPath({
    fileName,
    filePath: filePath[0]
  }).then((r)=>{
    console.log('r',r)
    if(typeof r === 'object' && r[0] && r[0].hash){
      submitPaperView.showUploadSuccess(r[0]);
    }

  }).catch((a,b)=>{
    console.log(a,b)
    submitPaperView.showUploadError({path: fileName})
  })

})
