import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login"
// import Detail from "./pages/Detail";
// import NoMatch from "./pages/NoMatch";

  // handleApiForSubmit = () => {
  //   event.preventDefault();
  //     API.getSearch(this.state.stockSearch)
  //       .then(res => this.state({ stock: res.data}))
  //       .catch(err => console.log(err));
  // }

  
const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/oms" component={Main} />
        <Route exact path="/" component={Login} />
        {/* <Route exact path="/intraday" component={Main} /> */}
        {/* <Route exact path="/books" component={Books} />
        <Route exact path="/books/:id" component={Detail} />
        <Route component={NoMatch} /> */}
      </Switch>
    </div>
  </Router>
);

export default App;
