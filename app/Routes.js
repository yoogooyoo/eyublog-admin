import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from './containers/App'
import Login from './components/login'
import Home from './containers/Home'

const Routes = () => (
  <Router history={browserHistory}>
    <Route path="/login" components={Login} />
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
    </Route>
  </Router>
)

export default Routes