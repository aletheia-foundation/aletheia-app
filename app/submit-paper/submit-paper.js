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

web3Client.createAccountIfNotExist().then((accountHash) => {
  submitPaperView.showEthereumAccount({accountHash})
}).catch((e) => {
  console.error(e, e.stack)
  submitPaperView.showEthereumAccount('')
})

submitPaperView.on('clickSelectFile', () => {
  const filePath = dialog.showOpenDialog({properties: ['openFile']})

  if (typeof filePath !== 'object' || !filePath[0]) {
    submitPaperView.showError(`Cannot read file: ${filePath}`)
    return
  }
  const fileName = filePath[0].match(/[^/]+$/)

  // todo, prevent denial of service here: https://github.com/aletheia-foundation/aletheia-app/issues/43
  ipfsClient.addFileFromPath({
    fileName,
    filePath: filePath[0]
  }).then((result) => {

    if (typeof result !== 'object' || !result[0] || !result[0].hash) {
      throw {err: 'result[0].hash was null', result }
    }
    console.log('ipfs add file done')

    return web3Client.indexNewFile(result[0].hash)
  }).then((web3Result) => {
    console.log('indexNewFile done')
    // will probably have to poll for inclusion in the blockchain =(
    if (typeof web3Result !== 'object' || !web3Result.fileHash) {
      throw {err: 'web3Result.fileHash was null', web3Result}
    }
    submitPaperView.showUploadSuccess(web3Result.fileHash)
  }).catch((err) => {
    console.error(err, err.stack)
    submitPaperView.showUploadError({path: fileName})
  })
})
