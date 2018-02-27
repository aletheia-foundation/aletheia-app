pragma solidity ^0.4.18;

import "./Accessible.sol";


contract ManuscriptIndex is Accessible {
    // storage is realized as double linked list indexes

    // PREV == false
    // NEXT == true
    mapping(bytes32 => mapping(bool => bytes32) ) public dllIndex;
    mapping(bytes32 => address) public manuscriptAddress;

    function add(bytes32 _hash, address _addr) public onlyAllowedAccount {
        // require input to be not empty
        require(_hash != 0x00 && _addr != 0x00);
        // require element to be addend to be newAuthor
        require(manuscriptAddress[_hash] == 0x00);
        // Link the new node
        dllIndex[_hash][false] = 0x0;
        dllIndex[_hash][true] = dllIndex[0x0][true];

        // Insert the new node
        dllIndex[dllIndex[0x0][true]][false] = _hash;
        dllIndex[0x0][true] = _hash;
        manuscriptAddress[_hash] = _addr;
    }

    function remove(bytes32 _hash) public onlyAllowedAccount {
        // require input to be not empty
        require(_hash != 0x00);
        // check existens of element to be removed
        require(manuscriptAddress[_hash] != 0x00);
        // Stitch the neighbours together
        dllIndex[dllIndex[_hash][false]][true] = dllIndex[_hash][true];
        dllIndex[dllIndex[_hash][true]][false] = dllIndex[_hash][false];

        // Delete state storage
        delete dllIndex[_hash][false];
        delete dllIndex[_hash][true];
        delete manuscriptAddress[_hash];
    }

}
