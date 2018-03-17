pragma solidity 0.4.19;

import "./MinimalManuscript2.sol";
import "./CloneFactory.sol";


contract ManuscriptFactory is CloneFactory {

    address public libraryAddress;

    mapping (bytes32 => address) public manuscriptRegistry;

    event ManuscriptCreated(address newManuscriptAddress, address libraryAddress);

    function ManuscriptFactory(address _libraryAddress) public {
        libraryAddress = _libraryAddress;
    }

    function onlyCreate() public {
        createClone(libraryAddress);
    }

    function createManuscript(bytes32 _da) public {
        address clone = createClone(libraryAddress);
        MinimalManuscript2(clone).init(_da);
        MinimalManuscript2(clone).transferOwnership(msg.sender);
        ManuscriptCreated(clone, libraryAddress);
        manuscriptRegistry[_da] = clone;
    }
}
