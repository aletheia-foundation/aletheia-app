export function web3NetworkIdFactory(web3): Promise<string> {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((error, netowrkId) => {
      if(error) {
        return reject(error)
      }
      console.log('network id is:', netowrkId)
      return resolve(netowrkId)
    })
  })
}