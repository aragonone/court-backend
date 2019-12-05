import React from 'react'
import Store from '../../store/store'
import ANJActions from '../../actions/anj'
import { fromWei } from 'web3-utils'

export default class ANJTransfersList extends React.Component {
  constructor(props){
    super(props)
    this.state = { transfers: null, account: this.props.match.params.address }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(ANJActions.findTransfers(this.state.account))
  }

  render() {
    const { transfers } = this.state
    return (
      <div ref="anjTransfersList">
        <h3>ANJ Transfers of {this.state.account}</h3>
        { (!transfers) ? <em>Loading...</em> : transfers.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
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
    return this.state.transfers.map((transfer, index) => {
      return (
        <tr key={index}>
          <td>{transfer.from}</td>
          <td>{transfer.to}</td>
          <td>{fromWei(transfer.amount)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.anjTransfersList) {
      const { transfers } = Store.getState().anj
      this.setState({ transfers })
    }
  }
}
