pragma solidity ^0.4.6;

contract FIFO {
  bytes32[] fifoQueue;
  uint cursorPosition;

  function queueDepth()
      public
      constant
      returns(uint queueDepth)
  {
      return fifoQueue.length - cursorPosition;
  }

  function push(bytes32 requestPaperHash)
        public
        returns(uint PaperNumber)
    {
        if(fifoQueue.length + 1 < fifoQueue.length) throw; // exceeded 2^256 push requests
        return fifoQueue.push(requestPaperHash) - 1;
    }

  function pop()
        public
        returns(uint, bytes32)
    {
        if(fifoQueue.length==0) throw;
        if(fifoQueue.length - 1 < cursorPosition) throw;
        cursorPosition += 1;
        return (cursorPosition -1, fifoQueue[cursorPosition -1]);
    }
}
