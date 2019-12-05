import React from 'react'
import Store from '../../store/store'
import ANJActions from '../../actions/anj'
import { Link } from 'react-router-dom'
import { fromWei } from 'web3-utils'

export default class ANJBalancesList extends React.Component {
  constructor(props){
    super(props)
    this.state = { balances: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(ANJActions.findBalances())
  }

  render() {
    const { balances } = this.state
    return (
      <div ref="anjBalancesList">
        <h3>ANJ Balances</h3>
        { (!balances) ? <em>Loading...</em> : balances.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Owner</th>
                <th>Balance</th>
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
    return this.state.balances.map((balance, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/anj-transfers/${balance.id}`}>
              <b>#{balance.id}</b>
            </Link>
          </td>
          <td>{balance.owner}</td>
          <td>{fromWei(balance.amount)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.anjBalancesList) {
      const { balances } = Store.getState().anj
      this.setState({ balances })
    }
  }
}
