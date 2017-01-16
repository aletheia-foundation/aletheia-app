
describe('ipfs-client', () => {
  it('should add a file', (done) => {
    const client = require('./ipfs-client')({
      address: '/ip4/127.0.0.1/tcp/5001',
      statusPollIntervalMs: 1000
    })
    client.addFileFromPath({
      filePath: './test/data/spacer.gif'
    })
    .then((res) => {
      console.log('then', res)
      done()
    })
    .catch((err) => {
      done(err)
    })
  })
})
