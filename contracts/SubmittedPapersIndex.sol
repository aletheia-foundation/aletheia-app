pragma solidity ^0.4.7;


contract SubmittedPapersIndex {
    bytes32[] public store;

    function push(bytes32 _hash) public {
        require(_hash != 0x00);
        store.push(_hash);
    }

    function getAll() public constant returns (bytes32[] hashes) {
        return store;
    }
}
