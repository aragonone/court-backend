import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'
import { Link } from 'react-router-dom'
import { summarize } from '../../helpers/summarize'

export default class RevealsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { reveals: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findReveals())
  }

  render() {
    const { reveals } = this.state
    return (
      <div ref="revealsList">
        <h3>Reveals</h3>
        { (!reveals) ? <em>Loading...</em> : reveals.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Juror</th>
                <th>Dispute ID</th>
                <th>Round #</th>
                <th>Vote ID</th>
                <th>Outcome</th>
                <th>Salt</th>
                <th>Revealed</th>
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
    return this.state.reveals.map((reveal, index) => {
      return (
        <tr key={index}>
          <td>{reveal.id}</td>
          <td>{reveal.juror}</td>
          <td>{reveal.disputeId}</td>
          <td>{reveal.roundNumber}</td>
          <td>{reveal.voteId}</td>
          <td>{reveal.outcome}</td>
          <td>{summarize(reveal.salt)}</td>
          <td>{reveal.revealed ? 'Yes' : 'No'}</td>
          <td>{reveal.createdAt}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.revealsList) {
      const { admin: { reveals } } = Store.getState()
      this.setState({ reveals })
    }
  }
}
