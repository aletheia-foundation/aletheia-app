pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MinimalManuscript.sol";
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

    function createManuscript(bytes32 _dataAddress, string title) public returns(address) {
        address clone = createClone(libraryAddress);
        MinimalManuscript(clone).init(_dataAddress, title);
        emit ManuscriptCreated(clone, libraryAddress);
        MinimalManuscript(clone).transferOwnership(msg.sender);
        return clone;
    }
}
