var SubmittedPapersIndex = artifacts.require('./SubmittedPapersIndex.sol')
var fs = require('fs')

function writeFile (outputPath, content) {
  fs.writeFile(outputPath, JSON.stringify(content), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('Contract addresses saved to ' + outputPath)
  })
}

module.exports = function (deployer) {
  deployer.deploy(SubmittedPapersIndex).then(() => {
    const outputPath = `./build/contracts/SubmittedPapersIndex.${deployer.network}.json`
    var config = {
      'address': SubmittedPapersIndex.address
    }
    writeFile(outputPath, config)
  })
}
