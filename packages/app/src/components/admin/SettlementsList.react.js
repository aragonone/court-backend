import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'
import { Link } from 'react-router-dom'
import { summarize } from '../../helpers/summarize'

export default class SettlementsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { settlements: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findSettlements())
  }

  render() {
    const { settlements } = this.state
    return (
      <div ref="settlementsList">
        <h3>Settlements</h3>
        { (!settlements) ? <em>Loading...</em> : settlements.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Dispute ID</th>
                <th>Settled</th>
                <th>Tries</th>
                <th>Error</th>
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
    return this.state.settlements.map((settlement, index) => {
      return (
        <tr key={index}>
          <td>{settlement.id}</td>
          <td>{settlement.disputeId}</td>
          <td>{settlement.settled ? 'Yes' : 'No'}</td>
          <td>{settlement.tries}</td>
          <td>{settlement.error ? <Link to={`/errors/${settlement.error.id}`}>{summarize(settlement.error.message)}</Link> : 'No'}</td>
          <td>{settlement.createdAt}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.settlementsList) {
      const { admin: { settlements } } = Store.getState()
      this.setState({ settlements })
    }
  }
}
