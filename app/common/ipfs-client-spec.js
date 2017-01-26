const expect = require('expect.js')

describe('ipfs-client', () => {
  describe('addFileFromPath', ()=>{
    it('should add a file and return the correct hash', (done) => {
      const client = require('./ipfs-client')({
        address: '/ip4/127.0.0.1/tcp/5001',
        statusPollIntervalMs: 1000
      })
      client.addFileFromPath({
        fileName:'spacer.gif',
        filePath: './test/data/spacer.gif'
      })
      .then((res) => {
        expect(res[0].hash).to.be('QmcjsPrt3VhTcBPg5F7eTSfxsnQTnKHtqEt7ZpAQBKumTV')
        expect(res[0].path).to.be('spacer.gif')
        done()
      })
      .catch((err) => {
        done(err)
      })
    });

  })
})
