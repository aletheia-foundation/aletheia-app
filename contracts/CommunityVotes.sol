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
        uint numAccepted;
    }

    mapping(bytes32 => voting) public votingList;

    function CommunityVotes(uint _votingDuration) public {
        votingDuration = _votingDuration;
    }

    function createVoting(bytes32 ipfsHash) public onlyAllowedAccount {
        // add check for authorship ?
        require(votingList[ipfsHash].startingBlock == 0);
        votingList[ipfsHash].startingBlock = block.number;
    }

    function votingActive(bytes32 ipfsHash) public constant returns(uint) {
        // check that voting has been started
        require(votingList[ipfsHash].startingBlock != 0);
        // return remaining blocks until votin is closed
        // note that if the remaining block number is 1 the next transaction will
        // be in the block which closes the voting. Consequently, voting is
        // not possible anymore when the remaining block number goes down to 1
        if (votingList[ipfsHash].startingBlock + votingDuration > block.number) {
            return votingList[ipfsHash].startingBlock + votingDuration - block.number;
        }
        return 0;
    }

    function vote(bytes32 ipfsHash, address _voter, bool _vote) public onlyAllowedAccount {
        require(votingActive(ipfsHash) > 0);
        // check that voter did not vote yet
        require(votingList[ipfsHash].voters[_voter].voted == false);
        votingList[ipfsHash].voterList.push(_voter);
        votingList[ipfsHash].voters[_voter].voted = true;
        votingList[ipfsHash].voters[_voter].vote = _vote;
        if (_vote == true) votingList[ipfsHash].numAccepted++;
    }

    function getVoting(bytes32 ipfsHash) public constant returns(uint, uint, address[]){
        return (
            votingList[ipfsHash].startingBlock,
            votingList[ipfsHash].numAccepted,
            votingList[ipfsHash].voterList
            );
    }

    function getVote(bytes32 ipfsHash, address _voter) public constant returns(bool, bool){
        return (
            votingList[ipfsHash].voters[_voter].voted,
            votingList[ipfsHash].voters[_voter].vote
            );
    }

}
