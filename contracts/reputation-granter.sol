pragma solidity ^0.4.7;
contract ReputationGranter {
  function grantRep() {
    if(msg.sender.call.value(100000)()){}
  }
}
