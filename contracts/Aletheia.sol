pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Reputation.sol";
import "./ManuscriptIndex.sol";
import "./Manuscript.sol";
import "./MinimalManuscript.sol";


contract Aletheia is Ownable {

    Reputation public reputation;
    ManuscriptIndex public manuscriptIndex;
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public registered;
    mapping(bytes32 => address) public manuscriptAddress;

    function Aletheia(address reputationAddress, address manuscriptIndexAddress) public {
        reputation = Reputation(reputationAddress);
        manuscriptIndex = ManuscriptIndex(manuscriptIndexAddress);
    }

    function remove() public onlyOwner payable {
        selfdestruct(msg.sender);
    }

    // deploy new manuscript (contract factory)
    function newManuscript(bytes32 _hash) public
        returns(address _newManuscriptAddress)
    {
        require(manuscriptAddress[_hash] == 0x00);
        MinimalManuscript m = new MinimalManuscript(_hash);
        m.transferOwnership(msg.sender);
        manuscriptAddress[_hash] = m;
        manuscriptIndex.add(_hash, m);
        return m;
    }

    function registerPaper(address _manuscriptAddress) public {
        // ToDo: should check, if upon reregistration the data address was
        // changed => new community vote / peer review necessary
        Manuscript paper = Manuscript(_manuscriptAddress);
        // only owner of manuscript should be able to register paper
        require(paper.isOwner(msg.sender));

        // Check to see if that address has already been registered.
        if (registered[_manuscriptAddress] == true) {
            // Update the citation count

        } else {
            // Register the manuscript (and update the citations, after review?)
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


}
