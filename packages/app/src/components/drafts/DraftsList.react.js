import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import DraftsActions from '../../actions/drafts'
import { toDate } from '../../helpers/toDate'
import { summarize } from '../../helpers/summarize'

export default class DraftsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { drafts: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(DraftsActions.findAll())
  }

  render() {
    const { drafts } = this.state
    return (
      <div ref="draftsList">
        <h3>Drafts</h3>
        { (!drafts) ? <em>Loading...</em> : drafts.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Juror</th>
                <th>Dispute ID</th>
                <th>Round #</th>
                <th>Weight</th>
                <th>Commitment</th>
                <th>Outcome</th>
                <th>Leaker</th>
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
    return this.state.drafts.map((draft, index) => {
      return (
        <tr key={index}>
          <td>{summarize(draft.id)}</td>
          <td>{draft.juror.id}</td>
          <td>
            <Link to={`/dispute/${draft.round.dispute.id}`}>
              <b>#{draft.round.dispute.id}</b>
            </Link>
          </td>
          <td>{draft.round.number}</td>
          <td>{draft.weight}</td>
          <td>{summarize(draft.commitment)}</td>
          <td>{draft.outcome}</td>
          <td>{draft.leaker}</td>
          <td>{toDate(draft.createdAt)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.draftsList) {
      const { list } = Store.getState().drafts
      this.setState({ drafts: list })
    }
  }
}
