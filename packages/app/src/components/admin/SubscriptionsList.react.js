import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'

export default class SubscriptionsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { subscriptions: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findSubscriptions())
  }

  render() {
    const { subscriptions } = this.state
    return (
      <div ref="subscriptionsList">
        <h3>Subscriptions</h3>
        { (!subscriptions) ? <em>Loading...</em> : subscriptions.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Address</th>
                <th>Created at</th>
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
    return this.state.subscriptions.map((subscription, index) => {
      return (
        <tr key={index}>
          <td>{subscription.id}</td>
          <td>{subscription.email}</td>
          <td>{subscription.address}</td>
          <td>{subscription.createdAt}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.subscriptionsList) {
      const { admin: { subscriptions } } = Store.getState()
      this.setState({ subscriptions })
    }
  }
}
