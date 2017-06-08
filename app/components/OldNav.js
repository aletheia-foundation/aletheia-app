var React = require('react');
var NavLink = require('react-router-dom').NavLink;

function OldNav () {
    return (
        <nav className="navbar navbar-default" style={{backgroundColor: '#34ad58'}}>
        <div className="container-fluid">
          {/* Brand and toggle get grouped for better mobile display */}
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" /> 
              <span className="icon-bar" />
            </button>
            <a href="#" className="navbar-brand">
              <img style={{maxHeight: '100%'}} src="./../../assets/aletheia_logo.png" />
            </a>
            <a className="navbar-brand" href="../home/home.html">Aletheia</a>
          </div>
          {/* Collect the nav links, forms, and other content for toggling */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a href="#"><span id="account-div" className="label label-default" /></a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Ethereum Peers <span id="status-bar-ethereum" className="label label-default status-bar" /></a></li>
              <li><a href="#">Peers <span id="status-bar" className="label label-default status-bar" /></a></li>
            </ul>
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container-fluid */}
      </nav>
    );
}

module.exports = Nav;