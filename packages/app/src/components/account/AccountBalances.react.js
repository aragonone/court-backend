import React from 'react'
import Store from '../../store/store'
import AccountActions from '../../actions/accounts'

export default class AccountBalances extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: '', eth: {}, anj: {}, fee: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findCurrent())
  }

  render() {
    const { address, eth, anj, fee } = this.state
    return (
      <div ref="accountBalances" className="balances">
        <h3>Your Account</h3>
        { !address ? 'Loading...' :
          <div>
            <p>Address: {address}</p>
            <p>{eth.symbol} balance: {eth.balance}</p>
            <p>{anj.symbol} balance: {anj.balance}</p>
            <p>{fee.symbol} balance: {fee.balance}</p>
          </div>
        }
      </div>
    )
  }

  _onChange() {
    if(this.refs.accountBalances) {
      const { address, eth, anj, fee } = Store.getState().account
      this.setState({ address, eth, anj, fee })
    }
  }
}
