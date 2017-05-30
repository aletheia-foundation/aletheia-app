const listView = new (require('./list-view.js'))()
const Web3ClientFactory = require('../common/web3/web3-client-factory')
const web3ClientPromise = Web3ClientFactory.getDefaultInstance()

web3ClientPromise.then((web3Client) => {
  web3Client.getAllPapers().then((papers) => {
    listView.renderPapers(papers)
  })
})
