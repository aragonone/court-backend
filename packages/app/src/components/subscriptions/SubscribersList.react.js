import React from 'react'
import Store from '../../store/store'
import { fromWei } from 'web3-utils'
import SubscriptionsActions from '../../actions/subscriptions'

export default class SubscribersList extends React.Component {
  constructor(props){
    super(props)
    this.state = { subscribers: null, module: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(SubscriptionsActions.findModule())
    Store.dispatch(SubscriptionsActions.findAllSubscribers())
  }

  render() {
    const { subscribers, module } = this.state
    return (
      <div ref="subscribersList">
        <h3>Subscribers</h3>
        { (!subscribers || !module) ? <em>Loading...</em> : subscribers.length === 0 ?
          <em>None</em> :
          <div>
            <div>
              <p>Total paid: {fromWei(module.totalPaid)} </p>
              <p>Total donated: {fromWei(module.totalDonated)} </p>
              <p>Total collected: {fromWei(module.totalCollected)} </p>
              <p>Total governor shares: {fromWei(module.totalGovernorShares)} </p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subscribed</th>
                  <th>Paused</th>
                  <th>Last period ID</th>
                  <th>Previous delayed periods</th>
                </tr>
              </thead>
              <tbody>
                {this._buildList()}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.subscribers.map((subscriber, index) => {
      return (
        <tr key={index}>
          <td><b>{subscriber.id}</b></td>
          <td>{subscriber.subscribed ? 'Yes' : 'No'} </td>
          <td>{subscriber.paused ? 'Yes' : 'No'}</td>
          <td>{subscriber.lastPaymentPeriodId}</td>
          <td>{subscriber.previousDelayedPeriods}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.subscribersList) {
      const { module, subscribers } = Store.getState().subscriptions
      this.setState({ module, subscribers })
    }
  }
}
