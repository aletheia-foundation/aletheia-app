const fs = require('fs')
const mkdirp = require('mkdirp')

function writeFile (outputPath, content) {

  fs.writeFile(outputPath, JSON.stringify(content), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('Contract addresses saved to ' + outputPath)
  })
}

class WriteAddressConfig {

  static writeConfigFile (networkName, deployedContract) {
    const confPath = './build/addresses'
    mkdirp.sync(confPath)
    const confFile = `${confPath}/${deployedContract.contract_name}.${networkName}.json`
    var config = {
      'address': deployedContract.address
    }
    writeFile(confFile, config)
  }
}

module.exports = WriteAddressConfig
