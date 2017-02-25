pragma solidity ^0.4.7;
contract SubmittedPapersIndex {
  IpfsAddress public store;
  
  struct IpfsAddress {
    bytes2 version;
    bytes32 hash;
  }

  function SubmittedPapersIndex(bytes2 _version, bytes32 _hash) {
    store = IpfsAddress({
      version: _version,
      hash: _hash
    });
  }

  function set(bytes2 _version, bytes32 _hash) {
    store = IpfsAddress({
      version: _version,
      hash: _hash
    });
  }

  function get() constant returns (bytes2 _version, bytes32 _hash) {
    return (store.version, store.hash);
  }
}
