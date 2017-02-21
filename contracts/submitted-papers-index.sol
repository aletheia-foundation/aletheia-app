pragma solidity ^0.4.7;
contract SubmittedPapersIndex {
  bytes public storedData;

  function SubmittedPapersIndex(bytes initialValue) {
    storedData = initialValue;
  }

  function set(bytes x) {
    storedData = x;
  }

  function get() constant returns (bytes retVal) {
    return storedData;
  }

}
