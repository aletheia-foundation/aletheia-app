var React = require('react');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;
var Nav = require('./Nav');
var BecomeAReviewer = require('./BecomeAReviewer');
var Home = require('./Home');
var HowItWorks = require('./HowItWorks');
var PaperList = require('./PaperList');
var SubmitPaper = require('./SubmitPaper');

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Nav />

                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/how-it-works' component={HowItWorks} />
                        <Route exact path='/submit-paper' component={SubmitPaper} />
                        <Route exact path='/paper-list' component={PaperList} />
                        <Route exact path='/become-a-reviewer' component={BecomeAReviewer} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

module.exports = App;