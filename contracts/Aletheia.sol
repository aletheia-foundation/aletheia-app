pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Reputation.sol";
import "./ManuscriptIndex.sol";
import "./CommunityVotes.sol";
import "./Manuscript.sol";
import "./MinimalManuscript.sol";


contract Aletheia is Ownable {

    Reputation public reputation;
    ManuscriptIndex public manuscriptIndex;
    CommunityVotes public communityVotes;
    mapping(address => uint256) public balanceOf;

    function Aletheia(address reputationAddress, address manuscriptIndexAddress, address votesAddress) public {
        reputation = Reputation(reputationAddress);
        manuscriptIndex = ManuscriptIndex(manuscriptIndexAddress);
        communityVotes = CommunityVotes(votesAddress);
    }

    function remove() public onlyOwner payable {
        selfdestruct(msg.sender);
    }

    // deploy new manuscript (contract factory)
    function newManuscript(bytes32 _hash, string title, address[] authors) public
        returns(address _newManuscriptAddress)
    {
        require(manuscriptIndex.manuscriptAddress(_hash) == 0x00);

        MinimalManuscript m = new MinimalManuscript(_hash, title);
        for (uint i = 0; i < authors.length; i++) {
            m.addAuthor(authors[i]);
        }
        m.transferOwnership(msg.sender);
        communityVotes.createVoting(_hash);
        manuscriptIndex.add(_hash, m);

        // ToDo: Update of citation count should be performed
        // after review of paper
        // ToDo: How to avoid to receive rep from one paper
        // several times?
        /*for (uint paperIdx = 0; paperIdx < paper.citationCount(); paperIdx++) {
            balanceOf[paper.citation(paperIdx)] += 10;
        }*/
        return m;
    }

    function communityVote(bytes32 _hash, bool _vote) public {
        // add check if msg.sender is registered member of Aletheia
        // member registration still to come...
        // check that authors cannot vote for their own manuscript
        Manuscript paper = Manuscript(manuscriptIndex.manuscriptAddress(_hash));
        require(!paper.isOwner(msg.sender));
        for (uint i = 0; i < paper.authorCount(); i++) {
            require(paper.author(i) != msg.sender);
        }
        communityVotes.vote(_hash, msg.sender, _vote);
    }
}
