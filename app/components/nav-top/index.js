import React, { Component } from 'react'

import './index.scss'
import '../system-info/index.scss'

class NavTop extends Component {
  handleClick = (e) => {
    e.preventDefault()
    sessionStorage.user = 0
    location.href = "/logout"
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    return (
      <div className="nav-top">
        Ethan Yu's Blog Admin
        <div className="fr">
          Welcome, Ethan
          <a href="/logout" onClick={this.handleClick}>Log Out</a>
        </div>
      </div>
    )
  }
}

export default NavTop