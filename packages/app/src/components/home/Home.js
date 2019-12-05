import React from 'react'
import CourtConfig from '../court/CourtConfig.react'
import AccountBalances from '../account/AccountBalances.react'

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <CourtConfig/>
        <AccountBalances/>
      </div>
    )
  }
}
