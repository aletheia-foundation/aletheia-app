import { Injectable } from '@angular/core';

import * as bs58 from 'bs58'
const ipfsSha256PrefixHex = '1220'


export class EncodingHelper {

  static bs58ToWeb3Bytes (bs58Str) {
    return bs58.decode(bs58Str).toString('hex');
  }

  static ipfsAddressToHexSha256(ipfsMultiHash) {
    if (ipfsMultiHash.length !== 46) {
      throw {msg: 'expected ipfs MultiHash address to be 46 characters long.', ipfsMultiHash}
    }
    const hexString = this.bs58ToWeb3Bytes(ipfsMultiHash)
    return '0x' + hexString.slice(4); // the first four bytes are the hash algorithm and length. Always the same
  }

  static hexSha256ToIpfsMultiHash(hash) {
    const rawHex = ipfsSha256PrefixHex + this.remove0x(hash);
    const rawHexBuffer = new Buffer(rawHex, 'hex');
    return bs58.encode(rawHexBuffer);
  }

  static remove0x(bytesStr) {
    if (typeof bytesStr === 'string' && bytesStr.startsWith('0x')) {
      return bytesStr.slice(2);
    } else {
      throw {msg: 'bytesStr is not a string starting with 0x', bytesStr}
    }
  }
}
