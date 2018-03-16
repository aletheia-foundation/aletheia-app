pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Manuscript.sol";


/** @title Minimal manuscript. */
contract MinimalManuscript is Ownable, Manuscript {
    bytes32 public _dataAddress;
    address[] public authors;
    address[] public citations;
    string public _title;

    mapping(address => bool) public signedByAuthor;

    function MinimalManuscript(bytes32 _da, string title) public {
        require(_da != 0x00);
        require(bytes(title).length > 0);
        //owner = msg.sender;
        _dataAddress = _da;
        _title = title;
    }

    function isOwner(address account) public constant returns(bool) {
        return owner == account;
    }

    function authorSigned(address _author) public constant returns(bool) {
        return signedByAuthor[_author];
    }

    function dataAddress() public constant returns(bytes32 _da) {
        return _dataAddress;
    }

    function title() public constant returns(string _t) {
        return _title;
    }

    function addAuthor(address newAuthor) public onlyOwner {
        for (uint i = 0; i < authors.length; i++) {
            // ToDo: should function throw if author is already registered?
            if (authors[i] == newAuthor) { return; }
        }
        authors.push(newAuthor);
    }

    function citePaper(address citee) public onlyOwner {
        // ToDo: make self citation of this paper impossible.
        for (uint i = 0; i < citations.length; i++) {
            //ToDo: should function throw if paper is already registered?
            if (citations[i] == citee) { return; }
        }

        citations.push(citee);
        // If this manuscript is already registered with Aletheia, the new
        // citation hasn't changed the balanceOf the cited paper. We could
        // 'fix' this by calling back to Aletheia, but it might be preferable
        // to add new citations and then reregister the manuscript with Aletheia.
        // If we recalculate the balanceOf each paper with every citation,
        // we waste a bunch of gas. Fewer transactions = better.
    }

    function removeCitation(address citee) public onlyOwner {
        uint i = findItem(citations, citee);
        removeItemByIndex(citations, i);
    }

    function removeAuthor(address author) public onlyOwner {
        uint i = findItem(authors, author);
        removeItemByIndex(authors, i);
    }

    function signAuthorship() public {
        findItem(authors, msg.sender);
        signedByAuthor[msg.sender] = true;
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

    function removeItemByIndex(address[] storage someList, uint i) internal {
        require(i < someList.length);
        while (i < someList.length-1) {
            someList[i] = someList[i+1];
            i++;
        }
        someList.length--;
    }

    function findItem(address[] someList, address item) internal pure
        returns(uint itemIndex)
    {
    // returns index of item in someList, if item is not in someList the
    // transaction is reverted
        for (uint i = 0; i < someList.length; i++) {
            if (someList[i] == item) { return i;}
        }
        revert();
    }

}
