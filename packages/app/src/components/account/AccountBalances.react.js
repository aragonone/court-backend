import React from 'react'
import Store from '../../store/store'
import Faucet from './Faucet.react'
import AccountActions from '../../actions/accounts'

export default class AccountBalances extends React.Component {
  constructor(props){
    super(props)
    this.state = { enabled: undefined, address: '', eth: {}, anj: {}, ant: {}, fee: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findCurrent())
  }

  render() {
    const { enabled } = this.state
    return (
      <div ref="accountBalances" className="balances">
        <h3>Your Account</h3>
        { enabled === undefined ? 'Loading...' :
          (enabled ? this._renderAccount() : this._renderEnabling())}
      </div>
    )
  }

  _renderAccount() {
    const { address, eth, anj, ant, fee } = this.state
    return (
      <div>
        { !address ? 'Loading...' :
          <div>
            <div>
              <p>Address: {address}</p>
              <p>{eth.symbol} balance: {eth.balance}</p>
              { ant.symbol ? <p>{ant.symbol} balance: {ant.balance}</p> : '' }
              { anj.symbol ? <p>{anj.symbol} balance: {anj.balance}</p> : '' }
              { fee.symbol ? <p>{fee.symbol} balance: {fee.balance}</p> : '' }
            </div>
            <Faucet/>
          </div>
        }
      </div>
    )
  }

  _renderEnabling() {
    return window.ethereum
      ? <div>Your web3 provider is disabled. Click <span onClick={this._enable} style={{cursor: 'pointer', textDecorationLine: 'underline'}}>here</span> to enable it, and reload the site.</div>
      : <em>No web3 provider detected. Please make sure you provide one to access your account information.</em>
  }

  _enable() {
    window.ethereum.enable()
    Store.dispatch(AccountActions.findCurrent())
  }

  _onChange() {
    if(this.refs.accountBalances) {
      const { account } = Store.getState()
      this.setState(account)
    }
  }
}
