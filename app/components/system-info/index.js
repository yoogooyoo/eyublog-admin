import React, { Component } from 'react'

import './index.scss'

class SystemInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch("/get-system-info", {
      credentials: 'include'
    }).then((res) => {
      if (res.status !== 200) {
        throw new Error('Load Failed, Status:' + res.status)
      }
      res.json().then((data) => {
        if (data.status === 0) {
          this.setState({error: data.message})
        } else {
          this.setState({...data.info})
        }
      }).catch((error) => {
        console.log(error)
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    const {serverIP, serverVersion, clientIP, clientVersion, dbVersion} = this.state

    return (
      <div className="system-info">
        <h3>System Info V1.0</h3>
        <ul>
          <li>
            <span>Database Info</span>
            <p>Database Version: {dbVersion}</p>
          </li>
          <li>
            <span>Server Info</span>
            <p>Server Address: {serverIP}</p>
            <p>Server Type & version: {serverVersion}</p>
          </li>
          <li>
            <span>Client Info</span>
            <p>Client Address: {clientIP}</p>
            <p>Client Version: {clientVersion}</p>
          </li>
        </ul>
      </div>
    )
  }
}

export default SystemInfo