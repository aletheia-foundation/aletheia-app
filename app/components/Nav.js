var React = require('react');
var Link = require('react-router-dom').Link;
var NavLink = require('react-router-dom').NavLink;

function Nav () {
    return (
        <ul className='nav'>
            <li>
                <NavLink activeClassName= 'active' to='/'>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink activeClassName= 'active' to='/submit-paper'>
                    Submit Paper
                </NavLink>
            </li>
            <li>
                <NavLink activeClassName= 'active' to='/paper-list'>
                    Paper List
                </NavLink>
            </li>
            <li>
                <NavLink activeClassName= 'active' to='/how-it-works'>
                    How it Works
                </NavLink>
            </li>
            <li>
                <NavLink activeClassName= 'active' to='/become-a-reviewer'>
                    Become a Reviewer
                </NavLink>
            </li>
        </ul>
    )
}

module.exports = Nav;