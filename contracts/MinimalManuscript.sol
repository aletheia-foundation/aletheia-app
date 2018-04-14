pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Manuscript.sol";


/** @title Minimal manuscript. */
contract MinimalManuscript is Ownable, Manuscript {
    bytes32 public _dataAddress;
    address[] public authors;
    address[] public citations;
    string public title;

    mapping(address => bool) public signedByAuthor;

    function MinimalManuscript() public {
        // master contract and all directly created manuscripts have
        // _dataAddress = 0x1 -> no init possible
        _dataAddress = 0x1;
        title = "master";
    }

    function init(bytes32 _da, string _title) external {
        require(_dataAddress == 0x00); // ensure not init'd already.
        require(_da != 0x00);
        require(bytes(_title).length > 0);

        _dataAddress = _da;
        owner = msg.sender;
        title = _title;
    }

    function isOwner(address account) external constant returns(bool) {
        return owner == account;
    }

    function authorSigned(address _author) external constant returns(bool) {
        return signedByAuthor[_author];
    }

    function dataAddress() external constant returns(bytes32 _da) {
        return _dataAddress;
    }

    function title() external constant returns(string _t) {
        return title;
    }

    function addAuthor(address newAuthor) external onlyOwner {
        for (uint i = 0; i < authors.length; i++) {
            // ToDo: should function throw if author is already registered?
            if (authors[i] == newAuthor) { return; }
        }
        authors.push(newAuthor);
    }

    function citePaper(address citee) external onlyOwner {
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

    function removeCitation(address citee) external onlyOwner {
        uint i = findItem(citations, citee);
        removeItemByIndex(citations, i);
    }

    function removeAuthor(address author) external onlyOwner {
        uint i = findItem(authors, author);
        removeItemByIndex(authors, i);
    }

    function signAuthorship() external {
        findItem(authors, msg.sender);
        signedByAuthor[msg.sender] = true;
    }

    function citationCount()  external constant returns (uint _citationCount) {
        return citations.length;
    }

    function authorCount() external constant returns (uint _authorCount) {
        return authors.length;
    }

    function author(uint authorIdx) external constant returns (address authorList) {
        return authors[authorIdx];
    }

    function citation(uint paperIdx) external constant returns (address citationList) {
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
