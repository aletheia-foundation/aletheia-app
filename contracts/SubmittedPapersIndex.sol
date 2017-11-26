pragma solidity ^0.4.7;

import "./FIFO.sol";
import "./LinkedList.sol";

contract SubmittedPapersIndex {

  FIFO public ManuscriptQueue;
  DoublyLinkedList.data public ReviewedManuscripts;

  function FifoClient(){
    ManuscriptQueue = new FIFO();
  }
  /**
    Queue(FIFO) Accept Manuscripts and add to queue to be vetted.
  */
  function push(bytes32 _hash)
    public
    returns(uint ManuscriptNumber)
  {
    require(_hash != 0x00);
    uint ManuscriptNum = ManuscriptQueue.push(_hash);
    return ManuscriptNum;
  }
  /**
    Function called after a Manuscript is vetted
    Append vetted manuscript to ReviewedManuscriptList.
  */
  function pop()
    public
    returns(uint, bytes32)
  {
    uint ManuscriptNum;
    bytes32 ManuscriptHash;
    (ManuscriptNum, ManuscriptHash) = PaperQueue.pop();
    ReviewedList.append(ManuscriptHash);
    return(ManuscriptNum, ManuscriptHash);
  }
  /**
    Function to get all manuscript indexes.
  */
  function getAll()
    constant returns (bytes32[] hashes)
    {
      bytes32[] store;
      var count = ReviewedList.size_list();
      var it = ReviewedList.iterate_start();
      while(it != count){
        store.push(ReviewedList.iterate_get(it));
        it = ReviewedList.iterate_next(it);
      }
      return store;
    }
}
