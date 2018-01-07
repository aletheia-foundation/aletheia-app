pragma solidity ^0.4.18;

import "./Ownable.sol";


/**
 * @title Ownable
 * @dev The Ownable contract can have several owner addresses, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    //mapping public owners;
    mapping(address => bool) public owners;
    // number of owners
    uint public numberOfOwners;

    event OwnershipGranted(address indexed newOwner);
    event OwnershipRemoved(address indexed removedOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
    function Ownable() public {
        owners[msg.sender] = true;
        numberOfOwners = 1;
    }

  /**
   * @dev Throws if called by any account other than the owners.
   */
    modifier onlyOwner() {
        require(owners[msg.sender]);
        _;
    }

    /**
     * @dev Allows all current owners to give control of the contract to a newOwner.
     * @param newOwner The address to give ownership to.
     */
    function grantOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0) && !owners[newOwner]);
        OwnershipGranted(newOwner);
        owners[newOwner] = true;
        numberOfOwners += 1;
    }

    /**
     * @dev Allows all current owners to remove control of the contract from an account.
     * It is not possible to remove all owners from the contract.
     * @param removeOwner The address to remove ownership from.
     */
    function removeOwnership(address removeOwner) public onlyOwner {
        require(numberOfOwners > 1 && owners[removeOwner]);
        OwnershipRemoved(removeOwner);
        owners[removeOwner] = false;
        numberOfOwners -= 1;
    }


}
