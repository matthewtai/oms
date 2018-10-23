import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./pages/Main";
// import Detail from "./pages/Detail";
// import NoMatch from "./pages/NoMatch";
import Nav from "./components/Nav";

  // handleApiForSubmit = () => {
  //   event.preventDefault();
  //     API.getSearch(this.state.stockSearch)
  //       .then(res => this.state({ stock: res.data}))
  //       .catch(err => console.log(err));
  // }

  
const App = () => (
  <Router>
    <div>
      <Nav />
      <Switch>
        <Route exact path="/" component={Main} />
        {/* <Route exact path="/intraday" component={Main} /> */}
        {/* <Route exact path="/books" component={Books} />
        <Route exact path="/books/:id" component={Detail} />
        <Route component={NoMatch} /> */}
      </Switch>
    </div>
  </Router>
);

export default App;
