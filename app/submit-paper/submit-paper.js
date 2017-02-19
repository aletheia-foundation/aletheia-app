const dialog = require('electron').remote.dialog
const config = require('config')

const submitPaperView = require('./submit-paper-view')
const IpfsClient = require('../common/ipfs-client')
const Web3Client = require('../common/web3-client')

const web3Client = new Web3Client({
  web3Url: config.get('web3.url'),
  pollIntervalMs: config.get('web3.pollIntervalMs')
})
const ipfsClient = new IpfsClient({
  address: config.get('ipfs.gatewayUrl'),
  pollIntervalMs: config.get('ipfs.pollIntervalMs')
})

web3Client.on('peer-update', (err, numPeers) => {
  if (err) {
    submitPaperView.showEthereumError(`Error conecting to alethia blockchian node at: ${config.get('web3.url')}`)
  } else if (numPeers === 0) {
    submitPaperView.showEthereumError('No alethia blockchain peers found')
  } else if (numPeers > 0) {
    submitPaperView.setEthereumPeers(numPeers)
  }
})

ipfsClient.on('peer-update', (err, numPeers) => {
  if (err) {
    submitPaperView.showError(`Error conecting to Aletheia filesystem gateway at  ${config.get('ipfs.gatewayUrl')}`)
  } else if (numPeers === 0) {
    submitPaperView.showError('No alethia filesystem peers found')
  } else if (numPeers > 0) {
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
  }).then((result) => {
    if (typeof result === 'object' && result[0] && result[0].hash) {
      submitPaperView.showUploadSuccess(result[0])
    }
  }).catch(() => {
    submitPaperView.showUploadError({path: fileName})
  })
})
