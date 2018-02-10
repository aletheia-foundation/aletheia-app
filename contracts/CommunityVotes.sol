pragma solidity ^0.4.18;

import "./Accessible.sol";


contract CommunityVotes is Accessible {

    uint public votingDuration;

    struct voter {
        bool weight;  // ??? use if voter restriction should be implemented
        bool voted;
        bool vote;
    }

    struct voting {
        uint startingBlock;
        address[] voterList;
        mapping(address => voter) voters;
        uint accepted;
    }

    mapping(bytes32 => voting) public votingList;

    function CommunityVotes(uint _votingDuration) {
        votingDuration = _votingDuration;
    }

    function createVoting(bytes32 ipfsHash) public {
        // add check for authorship ?
        require(votingList[ipfsHash].startingBlock == 0);
        votingList[ipfsHash].startingBlock = block.number;
    }

    function votingActive(bytes32 ipfsHash) constant public returns(bool) {
        // check that voting has been started
        require(votingList[ipfsHash].startingBlock != 0);
        // return true if voting duration is still valid
        if (block.number < votingList[ipfsHash].startingBlock + votingDuration) return true;
        else return false;
    }

    function vote(bytes32 ipfsHash, bool _vote) public {
        require(votingActive(ipfsHash));
        require(votingList[ipfsHash].voters[msg.sender].voted == false);
        votingList[ipfsHash].voterList.push(msg.sender);
        votingList[ipfsHash].voters[msg.sender].voted = true;
        votingList[ipfsHash].voters[msg.sender].vote = _vote;
        if(_vote == true) votingList[ipfsHash].accepted++;
    }

}
