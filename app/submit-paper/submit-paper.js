const dialog = require('electron').remote.dialog
const config = require('config')

const view = require('./submit-paper-view')
const IpfsClientFactory = require('../common/ipfs-client/ipfs-client-factory')
const Web3ClientFactory = require('../common/web3/web3-client-factory')

// todo: throw error if app is clearly misconfigured.
const web3ClientPromise = Web3ClientFactory.getDefaultInstance()
const ipfsClient = IpfsClientFactory.getDefaultInstance()

web3ClientPromise.then((web3Client) => {
  new SubmitPaperController({
    web3Client,
    ipfsClient,
    view
  })
}).catch((err) => {
  console.error(err, err.stack)
  view.showEthereumError('Error initialising blockchain')
})

class SubmitPaperController {
  constructor ({web3Client, ipfsClient, view}) {
    this._web3Client = web3Client
    this._ipfsClient = ipfsClient
    this._view = view
    this.balance = 0

    this._web3Client.on('peer-update', this.onWeb3PeerUpdate.bind(this))
    this._web3Client.on('balance-update', this.onBalanceUpdate.bind(this))
    this._ipfsClient.on('peer-update', this.onIpfsPeerUpdate.bind(this))

    this._view.on('clickSelectFile', this.onSelectFileClick.bind(this))

    this._web3Client.createAccountIfNotExist().then((accountHash) => {
      this._view.showEthereumAccount({accountHash})
    }).catch((e) => {
      console.error(e, e.stack)
      this._view.showEthereumAccount('')
    })
  }

  onWeb3PeerUpdate (err, numPeers) {
    if (err) {
      this._view.showEthereumError(`Error conecting to alethia blockchian node at: ${config.get('web3.url')}`)
    } else if (numPeers === 0) {
      this._view.showEthereumError('No alethia blockchain peers found')
    } else if (numPeers > 0) {
      this._view.setEthereumPeers(numPeers)
    }
  }

  onBalanceUpdate (err, balance) {
    if (err || !balance) {
      this._view.showEthereumBalance(`Error getting balance`)
    } else {
      this._view.showEthereumBalance({balance})
    }
  }

  onIpfsPeerUpdate (err, numPeers) {
    if (err) {
      view.showError(`Error conecting to Aletheia filesystem gateway at  ${config.get('ipfs.gatewayUrl')}`)
    } else if (numPeers === 0) {
      view.showError('No alethia filesystem peers found')
    } else if (numPeers > 0) {
      view.setPeers(numPeers)
    }
  }

  onSelectFileClick () {
    if (!this._hasEnoughBalance()) {
      return this._promptTopUpBalance()
    }

    const filePath = dialog.showOpenDialog({properties: ['openFile']})

    if (typeof filePath !== 'object' || !filePath[0]) {
      this._view.showError(`Cannot read file: ${filePath}`)
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

      return this._web3Client.indexNewFile(result[0].hash).then((transactionHash) => {
        this._view.showUploadInProgress({transactionHash})
        return this._web3Client.awaitTransaction(transactionHash)
      }).then((blockHash) => {
          // will probably have to poll for inclusion in the blockchain =(
        if (typeof blockHash !== 'string') {
          throw { err: 'hash of ethereum block was invalid', blockHash }
        }
        this._view.showUploadSucces({
          hash: result[0].hash,
          path: result[0].path
        })
      })
    }).catch((err) => {
      console.error(err, err.stack)
      this._view.showUploadError({path: fileName})
    })
  }

  _hasEnoughBalance () {
    // todo: realistic balance requirement
    // return this.balance <= 0
  }

  _promptTopUpBalance () {
    this._view.showTopUpMessage()
  }
}
