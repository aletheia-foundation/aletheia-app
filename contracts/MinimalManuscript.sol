pragma solidity ^0.4.15;

import './Ownable.sol';
import './Manuscript.sol';

/** @title Minimal manuscript. */
contract MinimalManuscript is Manuscript, Ownable {
    string _dataAddress;
    address[] public authors;
    address[] public citations;

    function MinimalManuscript(string _da) public {
        owner = msg.sender;
        _dataAddress = _da;
    }

    function dataAddress() public returns(string) {
        return _dataAddress;
    }

    function addAuthor(address newAuthor) public {
        for (uint i = 0; i<authors.length; i++) {
            if (authors[i] == newAuthor) { return; }
        }

        authors.push(newAuthor);
    }

    function citePaper(address citee) public {
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

    function findCitation(address citee) internal returns(uint) {
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

    function citationCount() public returns (uint) { return citations.length; }

    function authorCount() public returns (uint) { return authors.length; }
}
