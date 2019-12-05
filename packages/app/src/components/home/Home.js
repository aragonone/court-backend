import React from 'react'
import AccountBalances from '../account/AccountBalances.react'

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <AccountBalances/>
      </div>
    )
  }
}
