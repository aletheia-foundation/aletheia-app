var React = require('react');
var Link = require('react-router-dom').Link;

function PaperList () {
    return (
        <div>
        <div id="status-bar" className="status-bar" />
        <div id="status-bar-ethereum" className="status-bar" />
        <div id="account-div" />
        <div id="holder">
          <Link to='/submit-paper'>Submit Paper</Link>
          <ul id="papers-list" />
          <div id="error-div" />
        </div>
      </div>
    );
}

module.exports = PaperList;