pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Reputation.sol";
import "./CommunityVotes.sol";
import "./Manuscript.sol";
import "./MinimalManuscript.sol";


contract Aletheia is Ownable {

    Reputation public reputation;
    CommunityVotes public communityVotes;
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public registered;
    mapping(bytes32 => address) public manuscriptAddress;

    function Aletheia(address reputationAddress, address votesAddress) public {
        reputation = Reputation(reputationAddress);
        communityVotes = CommunityVotes(votesAddress);
    }

    function remove() public onlyOwner payable {
        selfdestruct(msg.sender);
    }

    // deploy new manuscript (contract factory)
    function newManuscript(bytes32 _hash) public
        returns(address _newManuscriptAddress)
    {
        MinimalManuscript m = new MinimalManuscript(_hash);
        m.transferOwnership(msg.sender);
        /* m.grantOwnership(msg.sender);
        m.removeOwnership(this); */
        manuscriptAddress[_hash] = m;
        return m;
    }

    function registerPaper(address _manuscriptAddress) public {
        // ToDo: should check, if upon reregistration the data address was
        // changed => new community vote / peer review necessary
        Manuscript paper = Manuscript(_manuscriptAddress);
        bytes32 _hash = paper.dataAddress();
        // only owner of manuscript should be able to register paper
        require(paper.isOwner(msg.sender));
        // paper requires at least one authors
        require(paper.authorCount() > 0);

        // Check to see if that address has already been registered.
        if (registered[_manuscriptAddress] == true) {
            // Update the citation count

        } else {
            // Register the manuscript and start community vote (and update the citations, after review?)
            communityVotes.createVoting(_hash);
            registered[_manuscriptAddress] = true;
        }

        // ToDo: Update of citation count should be performed
        // after review of paper
        // ToDo: How to avoid to receive rep from one paper
        // several times?
        /*for (uint paperIdx = 0; paperIdx < paper.citationCount(); paperIdx++) {
            balanceOf[paper.citation(paperIdx)] += 10;
        }*/
    }

    function communityVote(bytes32 _hash, bool _vote) public {
        // add check if msg.sender is registered member of Aletheia
        // member registration still to come...
        communityVotes.vote(_hash, msg.sender, _vote);
    }


}
