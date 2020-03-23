import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import { fromWei } from 'web3-utils'
import SubscriptionsActions from '../../actions/subscriptions'

export default class PeriodsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { periods: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(SubscriptionsActions.findAllPeriods())
  }

  render() {
    const { periods } = this.state
    return (
      <div ref="periodsList">
        <h3>Subscription Periods</h3>
        { (!periods) ? <em>Loading...</em> : periods.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fee token</th>
                <th>Fee amount</th>
                <th>Balance checkpoint</th>
                <th>Total active balance</th>
                <th>Collected fees</th>
              </tr>
            </thead>
            <tbody>
              {this._buildList()}
            </tbody>
          </table>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.periods.map((period, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/period/${period.id}`}>
              <b>#{period.id}</b>
            </Link>
          </td>
          <td>{period.feeToken}</td>
          <td>{fromWei(period.feeAmount)}</td>
          <td>{period.balanceCheckpoint}</td>
          <td>{fromWei(period.totalActiveBalance)}</td>
          <td>{fromWei(period.collectedFees)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.periodsList) {
      const { periods } = Store.getState().subscriptions
      this.setState({ periods })
    }
  }
}
