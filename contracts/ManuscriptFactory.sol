pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MinimalManuscript2.sol";
import "./CloneFactory.sol";


contract ManuscriptFactory is CloneFactory, Ownable {

    address public libraryAddress;

    event ManuscriptCreated(address newManuscriptAddress, address libraryAddress);

    function ManuscriptFactory(address _libraryAddress) public {
        libraryAddress = _libraryAddress;
    }

    function onlyCreate() public onlyOwner {
        // simple cloning test
        createClone(libraryAddress);
    }

    function createManuscript(bytes32 _dataAddress) public {
        address clone = createClone(libraryAddress);
        MinimalManuscript2(clone).init(_dataAddress, msg.sender);
        emit ManuscriptCreated(clone, libraryAddress);
    }
}
