pragma solidity ^0.4.15;


interface Manuscript {
    function dataAddress() external constant returns(bytes32);
    function addAuthor(address newAuthor) external;
    function citePaper(address citee) external;
    function removeCitation(address citee) external;
    function removeAuthor(address author) external;
    function citationCount() external constant returns (uint);
    function authorCount() external constant returns (uint);
    function citation(uint authorIdx) external constant returns (address);
    function author(uint paperIdx) external constant returns (address);
    function isOwner(address account) external constant returns(bool);
    function authorSigned(address _author) external constant returns (bool);
    function signAuthorship() external;
}
