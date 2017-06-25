var fs = require('fs')

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

    const outputPath = `./build/contracts/${deployedContract.contract_name}.${networkName}.json`
    var config = {
      'address': deployedContract.address
    }
    writeFile(outputPath, config)
  }
}

module.exports = WriteAddressConfig
