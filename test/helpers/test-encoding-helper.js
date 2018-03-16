const bs58 = require('bs58')

module.exports = {
  ipfsAddressToHexSha256: function (ipfsMultiHash) {
    if (ipfsMultiHash.length !== 46) {
      throw {msg: 'expected ipfs MultiHash address to be 46 characters long.', ipfsMultiHash}
    }
    const hexString = this.bs58ToWeb3Bytes(ipfsMultiHash)
    return '0x' + hexString.slice(4); // the first four bytes are the hash algorithm and length. Always the same
  },

  bs58ToWeb3Bytes: function (bs58Str) {
    return bs58.decode(bs58Str).toString('hex');
  }
}