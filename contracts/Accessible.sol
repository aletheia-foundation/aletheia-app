pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract Accessible is Ownable {
    //mapping public owners;
    mapping(address => bool) public allowedAccounts;
    // number of owners
    uint public numberOfAccounts;

    event AccessGranted(address indexed newAccount);
    event AccessRemoved(address indexed removedAccount);

    modifier onlyOwnerOrAllowed() {
        require(msg.sender == owner || allowedAccounts[msg.sender]);
        _;
    }

    modifier onlyAllowedAccount() {
        require(allowedAccounts[msg.sender]);
        _;
    }

    function grantAccess(address newAccount) public onlyOwnerOrAllowed {
        require(newAccount != address(0) && !allowedAccounts[newAccount]);
        AccessGranted(newAccount);
        allowedAccounts[newAccount] = true;
        numberOfAccounts += 1;
    }

    function removeAccess(address removeAccount) public onlyOwnerOrAllowed {
        require(allowedAccounts[removeAccount]);
        AccessRemoved(removeAccount);
        allowedAccounts[removeAccount] = false;
        numberOfAccounts -= 1;
    }


}
