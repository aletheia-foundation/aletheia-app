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

    function getOwner() public constant returns(address) {
        return owner;
    }

    function dataAddress() public constant returns(bytes32 _da) {
        return _dataAddress;
    }

    function addAuthor(address newAuthor) onlyOwner public {
        for (uint i = 0; i<authors.length; i++) {
            // ToDo: should function throw if author is already registered?
            if (authors[i] == newAuthor) { return; }
        }
        authors.push(newAuthor);
    }

    function citePaper(address citee) onlyOwner public {
        // ToDo: make self citation of this paper impossible.
        for (uint i = 0; i<citations.length; i++) {
            //ToDo: should function throw if paper is already registered?
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

    function removeItemByIndex(address[] storage someList, uint i) internal {
        while (i<someList.length-1) {
            someList[i] = someList[i+1];
            i++;
        }
        someList.length--;
    }

    function findItem(address[] someList, address citee) internal constant
        returns(uint itemIndex)
        {
        uint i = 0;
        while (someList[i] != citee) {
            i++;
        }
        return i;
    }

    function removeCitation(address citee) onlyOwner public {
        uint i = findItem(citations, citee);
        removeItemByIndex(citations, i);
    }

    function removeAuthor(address author) onlyOwner public {
        uint i = findItem(authors, author);
        removeItemByIndex(authors, i);
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
