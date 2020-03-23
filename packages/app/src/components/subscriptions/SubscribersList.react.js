import React from 'react'
import Store from '../../store/store'
import SubscriptionsActions from '../../actions/subscriptions'

export default class SubscribersList extends React.Component {
  constructor(props){
    super(props)
    this.state = { subscribers: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(SubscriptionsActions.findAllSubscribers())
  }

  render() {
    const { subscribers } = this.state
    return (
      <div ref="subscribersList">
        <h3>Subscribers</h3>
        { (!subscribers) ? <em>Loading...</em> : subscribers.length === 0 ?
          <em>None</em> :
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
      const { subscribers } = Store.getState().subscriptions
      this.setState({ subscribers })
    }
  }
}
