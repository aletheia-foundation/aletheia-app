var React = require('react')
var Link = require('react-router-dom').Link;

function SubmitPaper() {
    return (
    <div id="holder">
        <h1 style={{textAlign: 'center'}}>Submit documents to Aletheia</h1>
        <br />
        <br />
        <div style={{textAlign: 'center'}}>
          <button className="btn btn-primary" id="the-file-to-upload">Permanently share a file</button>
        </div>
        <div className="upload-success-div alert alert-success" id="upload-success-div" style={{display: 'none'}}>
        </div>
        <br />
        <div style={{textAlign: 'center'}}>
          <Link to='/paper-list'>View all submitted papers</Link>
        </div>
        <div id="error-div" />
      </div>
    );
}

module.exports = SubmitPaper;