pragma solidity ^0.4.18;

import './Ownable.sol';
import './Manuscript.sol';

/** @title Minimal manuscript. */
contract MinimalManuscript is Ownable, Manuscript {
    bytes32 _dataAddress;
    address[] public authors;
    address[] public citations;

    function MinimalManuscript(bytes32 _da) public {
        require(_da != 0x00);
        owner = msg.sender;
        _dataAddress = _da;
    }

    function dataAddress() public constant returns(bytes32 _da) {
        return _dataAddress;
    }

    function addAuthor(address newAuthor) onlyOwner public {
        for (uint i = 0; i<authors.length; i++) {
            if (authors[i] == newAuthor) { return; }
        }
        authors.push(newAuthor);
    }

    function citePaper(address citee) onlyOwner public {
        for (uint i = 0; i<citations.length; i++) {
            if(citations[i] == citee) { return; }
        }

        citations.push(citee);
        // If this manuscript is already registered with Aletheia, the new
        // citation hasn't changed the balanceOf the cited paper. We could
        // 'fix' this by calling back to Aletheia, but it might be preferable
        // to add new citations and then reregister the manuscript with Aletheia.
        // If we recalculate the balanceOf each paper with every citation,
        // we waste a bunch of gas. Fewer transactions = better.
    }

    function removeCitationByIndex(uint i) internal {
        while (i<citations.length-1) {
            citations[i] = citations[i+1];
            i++;
        }
        citations.length--;
    }

    function findCitation(address citee) internal returns(uint citatioIndex) {
        uint i = 0;
        while (citations[i] != citee) {
            i++;
        }
        return i;
    }

    function removeCitation(address citee) onlyOwner public {
        uint i = findCitation(citee);
        removeCitationByIndex(i);
    }

    function citationCount()  public constant returns (uint _citationCount) {
        return citations.length;
    }

    function authorCount() public constant returns (uint _authorCount) {
        return authors.length;
    }

    function author(uint authorIdx) public constant returns (address authorList) {
        return authors[authorIdx];
    }

    function citation(uint paperIdx) public constant returns (address citationList) {
        return citations[paperIdx];
    }



}
