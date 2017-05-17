pragma solidity ^0.4.7;

// forked from: http://ether.fund/contract/fdf6d/faucet
contract ReputationGranter {
  address owner;
  uint256 sendAmount;
  mapping (address => uint) lastSent;
  uint blockLimit;

  function ReputationGranter(){
      owner = msg.sender;
      sendAmount = 1000000000000000000;
      blockLimit = 5;
  }

  function getBalance() returns (uint){
	     return address(this).balance;
	}

	function getWei() returns (bool){
	    if(lastSent[msg.sender]<(block.number-blockLimit)&&address(this).balance>sendAmount){
	        if(msg.sender.send(sendAmount)){
            lastSent[msg.sender] = block.number;
            return true;
          }
          else {
            return false;
          }
	        return true;
	    } else {
	        return false;
	    }
	}
	function sendWei(address recp) returns (bool){
		  if(lastSent[msg.sender]<(block.number-blockLimit)&&address(this).balance>sendAmount){
          if(recp.send(sendAmount)){
            lastSent[msg.sender] = block.number;
            return true;
          }
          else {
            return false;
          }
	    } else {
	        return false;
	    }
	}
	function getRemainingBlocks() returns (uint){
	     if(blockLimit-(block.number-lastSent[msg.sender])>0)
          return blockLimit-(block.number-lastSent[msg.sender]);
       else
          return 0;
	}
	function getBlockLimit() returns (uint){
		  return blockLimit;
	}
	function setBlockLimit(uint limit) returns (bool){
		  if(msg.sender==owner) {
	        blockLimit = limit;
	        return true;
	    } else {
	        return false;
	    }
	}
	function setSendAmount(uint256 val) returns (bool){
	    if(msg.sender==owner)   {
	        sendAmount = val;
	        return true;
	    } else {
	        return false;
	    }
	}
	function getSendAmount() returns (uint256){
	    return sendAmount;
	}
	function killMe(){
	    if(msg.sender==owner) {
	        suicide(owner);
	    }
	}
}
