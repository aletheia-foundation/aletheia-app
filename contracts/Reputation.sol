pragma solidity ^0.4.18;

import "./Accessible.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract Reputation is Accessible {

    using SafeMath for uint256;

    mapping(address => uint256) public reputation;

    function reputationOf(address account) public view returns (uint256) {
        return reputation[account];
    }

    function addReputation(address account, uint256 amount) public onlyAllowedAccount {
        reputation[account] = reputation[account].add(amount);
    }

    function removeReputation(address account, uint256 amount) public onlyAllowedAccount {
        reputation[account] = reputation[account].sub(amount);
    }

}
