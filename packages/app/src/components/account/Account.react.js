import React from 'react'
import Store from '../../store/store'
import AccountActions from '../../actions/accounts'

export default class Account extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '' }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findCurrent())
  }

  render() {
    const { address } = this.state
    return (
      <p ref="account">{address}</p>
    )
  }

  _onChange() {
    if(this.refs.account) {
      const { address } = Store.getState().account
      this.setState({ address })
    }
  }
}
