import React from 'react'
import Store from '../../store/store'
import FaucetActions from '../../actions/faucet'

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
              { ant.symbol ? <p>{ant.symbol} balance: {ant.balance} <span onClick={() => this._claim(ant.address)} style={{cursor: 'pointer', textDecorationLine: 'underline'}}>claim</span></p> : '' }
              { anj.symbol ? <p>{anj.symbol} balance: {anj.balance} <span onClick={() => this._claim(anj.address)} style={{cursor: 'pointer', textDecorationLine: 'underline'}}>claim</span></p> : '' }
              { fee.symbol ? <p>{fee.symbol} balance: {fee.balance} <span onClick={() => this._claim(fee.address)} style={{cursor: 'pointer', textDecorationLine: 'underline'}}>claim</span></p> : '' }
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
