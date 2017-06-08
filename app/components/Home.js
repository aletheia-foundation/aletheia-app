var React = require('react');
var Link = require('react-router-dom').Link;

function Home () {
    return (
    <div>
        <div id="status-bar" className="status-bar" />
        <h1>Aletheia <span className="subtitle">Search the worlds peer reviewed scientific knowledge.</span></h1>
        <form>
          <label htmlFor="search-papers">Search papers </label>
          <input id="search-papers" type="text" />
          <button type="submit">Search</button>
        </form>
        <p>
          <a href="#!/not-implemented">How it works</a>
        </p>
        <ul>
          <li><Link to='/submit-paper'>Submit a paper for peer review</Link></li>
          <li><a href="#!/not-implemented">Become a reviewer</a></li>
        </ul>
      </div>
    );
}

module.exports = Home;