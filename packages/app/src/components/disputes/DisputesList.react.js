import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import DisputeActions from '../../actions/disputes'
import { toDate } from '../../helpers/toDate'

export default class DisputesList extends React.Component {
  constructor(props){
    super(props)
    this.state = { disputes: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(DisputeActions.findAll())
  }

  render() {
    const { disputes } = this.state
    return (
      <div ref="disputesList">
        <h3>Disputes</h3>
        { (!disputes) ? <em>Loading...</em> : disputes.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Metadata</th>
                <th>Term ID</th>
                <th>Possible rulings</th>
                <th>State</th>
                <th>Rounds</th>
                <th>Final ruling</th>
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
    return this.state.disputes.map((dispute, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/dispute/${dispute.id}`}>
              <b>#{dispute.id}</b>
            </Link>
          </td>
          <td>{dispute.subject.id}</td>
          <td>{dispute.disputable ? `Disputable (${dispute.disputable.address}): ${dispute.disputable.title}` : dispute.metadata}</td>
          <td>{dispute.createTermId}</td>
          <td>{dispute.possibleRulings}</td>
          <td>{dispute.state}</td>
          <td>{parseInt(dispute.lastRoundId) + 1}</td>
          <td>{dispute.finalRuling}</td>
          <td>{toDate(dispute.createdAt)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.disputesList) {
      const { list } = Store.getState().disputes
      this.setState({ disputes: list })
    }
  }
}
