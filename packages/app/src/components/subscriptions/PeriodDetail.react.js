import React from 'react'
import Store from '../../store/store'
import { fromWei } from 'web3-utils'
import SubscriptionsActions from '../../actions/subscriptions'

export default class PeriodDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { id: this.props.match.params.id, period: { } }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(SubscriptionsActions.findPeriod(this.state.id))
  }

  render() {
    const { id, period } = this.state
    return (
      <div ref="periodDetail">
        <h3>Subscription Period #{id}</h3>
          { !period.id ? 'Loading...' :
            <div>
              <p>Fee token: {period.feeToken}</p>
              <p>Balance checkpoint: {period.balanceCheckpoint ? period.balanceCheckpoint : 'loading...'}</p>
              <p>Total active balance: {period.totalActiveBalance ? fromWei(period.totalActiveBalance) : 'loading...'}</p>
              <p>Collected fees: {fromWei(period.collectedFees)}</p>
              <p>Claims: {this.state.period.jurorClaims.length === 0 && 'None'}</p>
              <ul>{this._buildClaimsList()}</ul>
            </div>
          }
      </div>
    )
  }

  _buildClaimsList() {
    return this.state.period.jurorClaims.map((claim, index) =>
      <li key={index}>
        Claim #{claim.id}
        <ul>
          <li>Submitter: {claim.juror.id}</li>
          <li>Amount: {fromWei(claim.amount)}</li>
        </ul>
      </li>
    )
  }

  _onChange() {
    if(this.refs.periodDetail) {
      const { period } = Store.getState().subscriptions
      this.setState({ period })
    }
  }
}
