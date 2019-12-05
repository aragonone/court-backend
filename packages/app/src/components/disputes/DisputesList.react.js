import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import DisputeActions from '../../actions/disputes'

export default class DisputesList extends React.Component {
  constructor(props){
    super(props)
    this.state = { disputes: [] }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(DisputeActions.findAll())
  }

  render() {
    return (
      <div ref="disputesList">
        <h3>Disputes</h3>
        { this.state.disputes.length === 0 ?
          <em>Loading...</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Creator</th>
                <th>Term ID</th>
                <th>State</th>
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
          <td>2</td>
          <td>3</td>
          <td>4</td>
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
