pragma solidity ^0.4.18;

import './Ownable.sol';
import './Manuscript.sol';

contract Aletheia is Ownable {

  mapping(address => uint256) public balanceOf;
  mapping(address => bool) public published;

  function remove() public payable {
	    selfdestruct(msg.sender);
  }


  function registerPaper(address addy) public {
      Manuscript paper = Manuscript(addy);

      // Check to see if that address has already been registered.
      if (published[addy] == true) {
          // Update the citation count

      } else {
          // Register the manuscript and update the citaitons
          published[addy] = true;
      }

      for (uint paperIdx = 0; paperIdx < paper.citationCount(); paperIdx++) {
          balanceOf[paper.citation(paperIdx)] += 10;
      }
  }
}
