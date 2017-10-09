import { Injectable } from '@angular/core';
// thanks xavierlepretre https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

@Injectable()
export class Web3HelperService {

  constructor() { }

  getTransactionReceiptMined(web3, txnHash) {
    const interval = 500;
    const transactionReceiptAsync = function(txnHash, resolve, reject) {
      try {
        var receipt = web3.eth.getTransactionReceipt(txnHash);
        if (receipt == null) {
          setTimeout(function () {
            transactionReceiptAsync(txnHash, resolve, reject);
          }, interval);
        } else {
          resolve(receipt);
        }
      } catch(e) {
        reject(e);
      }
    };

    if (Array.isArray(txnHash)) {
      var promises = [];
      txnHash.forEach(function (oneTxHash) {
        promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
      });
      return Promise.all(promises);
    } else {
      return new Promise(function (resolve, reject) {
        transactionReceiptAsync(txnHash, resolve, reject);
      });
    }
  };
}
