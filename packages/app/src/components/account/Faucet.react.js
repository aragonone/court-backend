import React from 'react'
import Store from '../../store/store'
import FaucetActions from '../../actions/faucet'

const ONE_DAY = 60 * 60 * 24

export default class Faucet extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: undefined, ant: {}, anj: {}, fee: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(FaucetActions.find())
  }

  render() {
    const { address, ant, anj, fee } = this.state
    return (
      <div ref="faucet">
        {address === undefined ? '' :
          <div>
            <h3>ERC20 Faucet</h3>
            <p>Address: { address }</p>
            <div>
              { ant.symbol ? <p>{ant.symbol} balance: {ant.balance} (<a onClick={() => this._claim(ant.address)} href="#">claim</a> up to {ant.quota} every {ant.period.toNumber()/ONE_DAY} days)</p> : '' }
              { anj.symbol ? <p>{anj.symbol} balance: {anj.balance} (<a onClick={() => this._claim(anj.address)} href="#">claim</a> up to {anj.quota} every {anj.period.toNumber()/ONE_DAY} days)</p> : '' }
              { fee.symbol ? <p>{fee.symbol} balance: {fee.balance} (<a onClick={() => this._claim(fee.address)} href="#">claim</a> up to {fee.quota} every {fee.period.toNumber()/ONE_DAY} days)</p> : '' }
            </div>
          </div>
        }
      </div>
    )
  }

  _claim(address) {
    Store.dispatch(FaucetActions.claim(address))
  }

  _onChange() {
    if(this.refs.faucet) {
      const { faucet } = Store.getState()
      this.setState(faucet)
    }
  }
}
