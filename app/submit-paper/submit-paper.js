const dialog = require('electron').remote.dialog
const config = require('config')

const submitPaperView = require('./submit-paper-view')
const IpfsClientFactory = require('../common/ipfs-client/ipfs-client-factory')
const Web3ClientFactory = require('../common/web3/web3-client-factory')

//todo: throw error if app is clearly misconfigured.
const web3ClientPromise = Web3ClientFactory.getDefaultInstance();

const ipfsClient = IpfsClientFactory.getDefaultInstance();

web3ClientPromise.then((web3Client)=>{
    web3Client.on('peer-update', (err, numPeers) => {
      if (err) {
        submitPaperView.showEthereumError(`Error conecting to alethia blockchian node at: ${config.get('web3.url')}`)
      } else if (numPeers === 0) {
        submitPaperView.showEthereumError('No alethia blockchain peers found')
      } else if (numPeers > 0) {
        submitPaperView.setEthereumPeers(numPeers)
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

        return web3Client.indexNewFile(result[0].hash).then((transactionHash) => {
          submitPaperView.showUploadInProgress({transactionHash})
          return web3Client.awaitIndexNewFile(transactionHash)
        }).then((blockHash) => {
          // will probably have to poll for inclusion in the blockchain =(
          if (typeof blockHash !== 'string') {
            throw {err: 'hash of ethereum block was invalid', blockHash}
          }
          submitPaperView.showUploadSuccess({
            hash: result[0].hash,
            path: result[0].path
          })
        })
      }).catch((err) => {
        console.error(err, err.stack)
        submitPaperView.showUploadError({path: fileName})
      })
    })
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
