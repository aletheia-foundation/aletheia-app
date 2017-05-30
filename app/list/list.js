const listView = new (require('./list-view.js'))()
const web3ClientPromise = require(
  '../common/web3/web3-client-factory'
).getDefaultInstance()

const IpfsClient = require(
  '../common/ipfs-client/ipfs-client-factory'
).getDefaultInstance()

web3ClientPromise.then((web3Client) => {
  web3Client.getAllPapers().then((papers) => {
    listView.renderPapers(papers)
  })
  listView.on('clickDownloadPaper', (hash) => {
    IpfsClient.downloadFile(hash)
    // todo: open file in default filesystem viewer
  })
})
