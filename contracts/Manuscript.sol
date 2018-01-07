pragma solidity ^0.4.15;

import './Ownable.sol';

interface Manuscript {
    function dataAddress() public constant returns(bytes32);
    function addAuthor(address newAuthor) public;
    function citePaper(address citee) public;
    function removeCitation(address citee) public;
    function removeAuthor(address author) public;
    function citationCount() public constant returns (uint);
    function authorCount() public constant returns (uint);
    function citation(uint authorIdx) public constant returns (address);
    function author(uint paperIdx) public constant returns (address);
    function isOwner(address account) public constant returns(bool);
    function authorSigned(address _author) public constant returns (bool);
    function signAuthorship() public;
}
