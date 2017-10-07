pragma solidity ^0.4.15;

import './Ownable.sol';

interface Manuscript {
    function dataAddress() public returns(string);
    function addAuthor(address newAuthor) public;
    function citePaper(address citee) public;
    function citationCount() public returns (uint);
    function authorCount() public returns (uint);
    function citations(uint) public returns (address);
    function authors(uint) public returns (address);
}
